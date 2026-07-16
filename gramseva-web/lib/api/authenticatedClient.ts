/**
 * Authenticated API Client
 *
 * Wraps the base API client to provide automatic:
 * - Token injection (Authorization + apikey headers)
 * - Session validation before every request
 * - Automatic 401 recovery (refresh + retry once)
 * - Typed error handling for auth failures
 *
 * This is the ONLY way services should communicate with Supabase REST APIs.
 *
 * @example
 * ```ts
 * import { authenticatedClient } from '@/lib/api/authenticatedClient';
 *
 * // GET with auth
 * const { data } = await authenticatedClient.get<Scheme[]>('/schemes', {
 *   params: { select: '*', category: 'eq.agriculture' },
 * });
 *
 * // POST with auth
 * const { data } = await authenticatedClient.post<Complaint>('/complaints', {
 *   title: 'Road damage',
 *   description: 'Main road near school',
 * });
 * ```
 */

import type { ApiResponse, PaginatedResponse, RequestConfig } from '@/types/api';
import { type ApiClientConfig } from './client';
import { parseResponse, parsePaginatedResponse } from './response';
import {
  SessionExpiredError,
  RefreshFailedError,
  NetworkError,
  TimeoutError,
  ApiClientError,
} from './errors';
import {
  getAccessToken,
  isTokenExpired,
  hasStoredSession,
  refreshSession,
} from '@/lib/auth';
import { REQUEST_TIMEOUT, DEFAULT_RETRIES, DEFAULT_RETRY_DELAY } from '@/lib/constants/api';
import { logger } from './logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthenticatedClientConfig {
  /** Override the base URL (defaults to NEXT_PUBLIC_SUPABASE_URL). */
  baseUrl?: string;
  /** Additional headers to merge into every request. */
  headers?: Record<string, string>;
  /** Override request timeout in ms. */
  timeout?: number;
  /** Override retry count. */
  retries?: number;
  /** Override retry delay in ms. */
  retryDelay?: number;
}

// ─── Internal State ──────────────────────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

// ─── Token Management ────────────────────────────────────────────────────────

/**
 * Ensures a valid access token exists and is not expired.
 * If the token is expired or missing, attempts to refresh.
 * Returns the access token or throws if no session is available.
 */
async function ensureAccessToken(): Promise<string> {
  if (!hasStoredSession()) {
    throw new SessionExpiredError('No active session. Please log in.');
  }

  if (!isTokenExpired()) {
    const token = getAccessToken();
    if (token) return token;
  }

  logger.info('Token expired or missing, attempting refresh...');
  await refreshSession();

  const token = getAccessToken();
  if (!token) {
    throw new RefreshFailedError('Could not obtain a valid access token.');
  }

  return token;
}

/**
 * Builds auth headers by reading the current access token.
 * Returns undefined if no session exists (for optional auth requests).
 */
function buildAuthHeaders(
  customHeaders?: Record<string, string>,
): Record<string, string> {
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const headers: Record<string, string> = {
    apikey: supabaseKey,
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// ─── 401 Recovery ────────────────────────────────────────────────────────────

/**
 * Attempts to recover from a 401 Unauthorized response.
 * Refreshes the session token and returns true if successful.
 * Uses a shared promise to prevent concurrent refresh attempts.
 */
async function attempt401Recovery(): Promise<boolean> {
  if (!hasStoredSession()) return false;

  // Deduplicate concurrent refresh attempts
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const result = await refreshSession();
        return result.data !== undefined;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

// ─── Core Request Function ───────────────────────────────────────────────────

async function authenticatedRequest<T>(
  method: string,
  path: string,
  config: ApiClientConfig,
  options: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const {
    timeout = config.timeout ?? REQUEST_TIMEOUT,
    retries = config.retries ?? DEFAULT_RETRIES,
    retryDelay = config.retryDelay ?? DEFAULT_RETRY_DELAY,
    signal,
    body,
    params,
    cache,
    headers: customHeaders,
  } = options;

  // 1. Ensure valid token before request
  let accessToken: string;
  try {
    accessToken = await ensureAccessToken();
  } catch (error) {
    if (error instanceof SessionExpiredError || error instanceof RefreshFailedError) {
      throw error;
    }
    throw new RefreshFailedError(
      error instanceof Error ? error.message : 'Session validation failed.',
    );
  }

  const fullHeaders: Record<string, string> = {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const url = new URL(path, config.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const fullUrl = url.toString();
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      const waitTime = retryDelay * Math.pow(2, attempt - 1);
      logger.info(`Retry ${attempt}/${retries} for ${method} ${path} (wait ${waitTime}ms)`);
      await new Promise((r) => setTimeout(r, waitTime));
    }

    const controller = new AbortController();
    let timedOut = false;

    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);

    if (signal) {
      if (signal.aborted) {
        clearTimeout(timeoutId);
        throw signal.reason instanceof Error ? signal.reason : new Error('Request aborted');
      }
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timeoutId);
          controller.abort();
        },
        { once: true },
      );
    }

    try {
      logger.debug(`[Auth] ${method} ${path}`);

      const response = await fetch(fullUrl, {
        method,
        headers: fullHeaders,
        body: body != null ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache,
      });

      clearTimeout(timeoutId);

      // 2. Handle 401 — attempt recovery and retry once
      if (response.status === 401 && attempt === 0) {
        logger.warn(`401 received for ${method} ${path}, attempting recovery...`);

        const recovered = await attempt401Recovery();
        if (recovered) {
          // Re-read the new token and retry
          const newToken = getAccessToken();
          if (newToken) {
            fullHeaders['Authorization'] = `Bearer ${newToken}`;
            continue; // Retry the request
          }
        }

        // Recovery failed — throw appropriate error
        if (!hasStoredSession()) {
          throw new SessionExpiredError();
        }
        throw new RefreshFailedError();
      }

      logger.debug(`[Auth] ${response.status} ${method} ${path}`);

      return await parseResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (timedOut) {
        lastError = new TimeoutError(`Request to ${path} timed out after ${timeout}ms`);
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        if (signal?.aborted) {
          throw signal.reason instanceof Error ? signal.reason : new Error('Request aborted');
        }
        lastError = new TimeoutError(`Request to ${path} was aborted`);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        lastError = new NetworkError();
      } else if (
        error instanceof SessionExpiredError ||
        error instanceof RefreshFailedError
      ) {
        throw error;
      } else if (error instanceof ApiClientError) {
        throw error;
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      if (method !== 'GET' || attempt >= retries || !isRetryableForAuth(lastError)) {
        throw lastError;
      }

      logger.warn(`[Auth] ${method} ${path} failed: ${lastError.message}`);
    }
  }

  throw lastError || new NetworkError();
}

async function authenticatedRequestRaw(
  path: string,
  method: string,
  config: ApiClientConfig,
  options: RequestConfig = {},
): Promise<Response> {
  const {
    timeout = config.timeout ?? REQUEST_TIMEOUT,
    signal,
    body,
    params,
    cache,
    headers: customHeaders,
  } = options;

  let accessToken: string;
  try {
    accessToken = await ensureAccessToken();
  } catch (error) {
    if (error instanceof SessionExpiredError || error instanceof RefreshFailedError) {
      throw error;
    }
    throw new RefreshFailedError(
      error instanceof Error ? error.message : 'Session validation failed.',
    );
  }

  const fullHeaders: Record<string, string> = {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const url = new URL(path, config.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      throw signal.reason instanceof Error ? signal.reason : new Error('Request aborted');
    }
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        controller.abort();
      },
      { once: true },
    );
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: fullHeaders,
      body: body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (controller.signal.aborted && !(signal?.aborted)) {
      throw new TimeoutError(`Request to ${path} timed out after ${timeout}ms`);
    }

    if (signal?.aborted) {
      throw signal.reason instanceof Error ? signal.reason : new Error('Request aborted');
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError();
    }

    throw error;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isRetryableForAuth(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    if (error.status !== undefined) {
      return error.status >= 500;
    }
    return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT';
  }
  return false;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface AuthenticatedApiClient {
  /** Authenticated GET request. Returns typed ApiResponse. */
  get<T>(path: string, options?: Omit<RequestConfig, 'body'>): Promise<ApiResponse<T>>;

  /** Authenticated POST request. Returns typed ApiResponse. */
  post<T>(path: string, body?: unknown, options?: RequestConfig): Promise<ApiResponse<T>>;

  /** Authenticated PUT request. Returns typed ApiResponse. */
  put<T>(path: string, body?: unknown, options?: RequestConfig): Promise<ApiResponse<T>>;

  /** Authenticated PATCH request. Returns typed ApiResponse. */
  patch<T>(path: string, body?: unknown, options?: RequestConfig): Promise<ApiResponse<T>>;

  /** Authenticated DELETE request. Returns typed ApiResponse. */
  delete<T>(path: string, options?: Omit<RequestConfig, 'body'>): Promise<ApiResponse<T>>;

  /** Authenticated paginated GET request. Returns PaginatedResponse with total/pages metadata. */
  paginated<T>(
    path: string,
    page: number,
    pageSize: number,
    options?: Omit<RequestConfig, 'body'>,
  ): Promise<PaginatedResponse<T>>;

  /** Authenticated raw fetch — returns the raw Response for streaming or custom parsing. */
  raw(path: string, method: string, options?: RequestConfig): Promise<Response>;
}

/**
 * Creates a pre-configured authenticated API client.
 *
 * @param config - Optional configuration overrides.
 * @returns An AuthenticatedApiClient with all HTTP methods.
 *
 * @example
 * ```ts
 * const client = createAuthenticatedClient({ timeout: 10_000 });
 * const { data } = await client.get<Scheme[]>('/schemes');
 * ```
 */
export function createAuthenticatedClient(
  config: AuthenticatedClientConfig = {},
): AuthenticatedApiClient {
  const clientConfig: ApiClientConfig = {
    baseUrl: config.baseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    defaultHeaders: buildAuthHeaders(config.headers),
    timeout: config.timeout,
    retries: config.retries,
    retryDelay: config.retryDelay,
  };

  return {
    get<T>(path: string, options?: Omit<RequestConfig, 'body'>): Promise<ApiResponse<T>> {
      return authenticatedRequest<T>('GET', path, clientConfig, options);
    },

    post<T>(
      path: string,
      body?: unknown,
      options?: RequestConfig,
    ): Promise<ApiResponse<T>> {
      return authenticatedRequest<T>('POST', path, clientConfig, { ...options, body });
    },

    put<T>(
      path: string,
      body?: unknown,
      options?: RequestConfig,
    ): Promise<ApiResponse<T>> {
      return authenticatedRequest<T>('PUT', path, clientConfig, { ...options, body });
    },

    patch<T>(
      path: string,
      body?: unknown,
      options?: RequestConfig,
    ): Promise<ApiResponse<T>> {
      return authenticatedRequest<T>('PATCH', path, clientConfig, { ...options, body });
    },

    delete<T>(path: string, options?: Omit<RequestConfig, 'body'>): Promise<ApiResponse<T>> {
      return authenticatedRequest<T>('DELETE', path, clientConfig, options);
    },

    paginated<T>(
      path: string,
      page: number,
      pageSize: number,
      options?: Omit<RequestConfig, 'body'>,
    ): Promise<PaginatedResponse<T>> {
      return authenticatedRequestRaw(path, 'GET', clientConfig, options).then((response) =>
        parsePaginatedResponse<T>(response, page, pageSize),
      );
    },

    raw(path: string, method: string, options?: RequestConfig): Promise<Response> {
      return authenticatedRequestRaw(path, method, clientConfig, options);
    },
  };
}

/**
 * Default authenticated client instance.
 * Pre-configured with Supabase credentials from environment variables.
 */
export const authenticatedClient = createAuthenticatedClient();

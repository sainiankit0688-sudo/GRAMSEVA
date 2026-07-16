import type { ApiResponse, PaginatedResponse, RequestConfig } from '@/types/api';
import { parseResponse, parsePaginatedResponse } from './response';
import { NetworkError, TimeoutError, ApiClientError } from './errors';
import { logger } from './logger';

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1_000;

export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build a full URL from a base URL, path, and optional query parameters.
 *
 * @param baseUrl - The base URL (e.g., Supabase URL).
 * @param path - The API path (e.g., '/schemes').
 * @param params - Optional query parameters.
 * @returns The fully constructed URL string.
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(path, baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    if (error.status !== undefined) {
      return error.status >= 500;
    }
    return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT';
  }
  return false;
}

async function request<T>(
  method: string,
  url: string,
  config: ApiClientConfig,
  options: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const {
    headers = {},
    timeout = config.timeout ?? DEFAULT_TIMEOUT,
    retries = config.retries ?? DEFAULT_RETRIES,
    retryDelay = config.retryDelay ?? DEFAULT_RETRY_DELAY,
    signal,
    body,
    params,
    cache,
  } = options;

  const fullUrl = buildUrl(config.baseUrl, url, params);

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      const waitTime = retryDelay * Math.pow(2, attempt - 1);
      logger.info(`Retry ${attempt}/${retries} for ${method} ${url} (wait ${waitTime}ms)`);
      await delay(waitTime);
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
      logger.debug(`${method} ${url}${params ? ' ' + JSON.stringify(params) : ''}`);

      const response = await fetch(fullUrl, {
        method,
        headers: {
          ...config.defaultHeaders,
          ...headers,
        },
        body: body != null ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache,
      });

      clearTimeout(timeoutId);

      logger.debug(`${response.status} ${method} ${url}`);

      return await parseResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (timedOut) {
        lastError = new TimeoutError(`Request to ${url} timed out after ${timeout}ms`);
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        if (signal?.aborted) {
          throw signal.reason instanceof Error ? signal.reason : new Error('Request aborted');
        }
        lastError = new TimeoutError(`Request to ${url} was aborted`);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        lastError = new NetworkError();
      } else if (error instanceof ApiClientError) {
        throw error;
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      if (method !== 'GET' || attempt >= retries || !isRetryableError(lastError)) {
        throw lastError;
      }

      logger.warn(`${method} ${url} failed: ${lastError.message}`);
    }
  }

  throw lastError || new NetworkError();
}

export function createApiClient(config: ApiClientConfig) {
  return {
    get<T>(path: string, options?: Omit<RequestConfig, 'body'>): Promise<ApiResponse<T>> {
      return request<T>('GET', path, config, options);
    },

    post<T>(
      path: string,
      body?: unknown,
      options?: RequestConfig,
    ): Promise<ApiResponse<T>> {
      return request<T>('POST', path, config, { ...options, body });
    },

    put<T>(
      path: string,
      body?: unknown,
      options?: RequestConfig,
    ): Promise<ApiResponse<T>> {
      return request<T>('PUT', path, config, { ...options, body });
    },

    patch<T>(
      path: string,
      body?: unknown,
      options?: RequestConfig,
    ): Promise<ApiResponse<T>> {
      return request<T>('PATCH', path, config, { ...options, body });
    },

    delete<T>(path: string, options?: Omit<RequestConfig, 'body'>): Promise<ApiResponse<T>> {
      return request<T>('DELETE', path, config, options);
    },

    paginated<T>(
      path: string,
      page: number,
      pageSize: number,
      options?: Omit<RequestConfig, 'body'>,
    ): Promise<PaginatedResponse<T>> {
      return requestRaw(path, 'GET', config, options).then((response) =>
        parsePaginatedResponse<T>(response, page, pageSize),
      );
    },

    raw(path: string, method: string, options?: RequestConfig): Promise<Response> {
      return requestRaw(path, method, config, options);
    },
  };
}

async function requestRaw(
  path: string,
  method: string,
  config: ApiClientConfig,
  options: RequestConfig = {},
): Promise<Response> {
  const {
    headers = {},
    timeout = config.timeout ?? DEFAULT_TIMEOUT,
    signal,
    body,
    params,
    cache,
  } = options;

  const fullUrl = buildUrl(config.baseUrl, path, params);

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
    const response = await fetch(fullUrl, {
      method,
      headers: {
        ...config.defaultHeaders,
        ...headers,
      },
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

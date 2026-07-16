const isDev = process.env.NODE_ENV === 'development';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'access_token',
  'refresh_token',
  'secret',
  'key',
  'authorization',
  'apikey',
  'api_key',
]);

function sanitize(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return data.length > 200 ? data.substring(0, 200) + '...' : data;
  }

  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export const logger = {
  debug(message: string, data?: unknown): void {
    if (!isDev) return;
    if (data !== undefined) {
      console.debug(`[API] ${message}`, sanitize(data));
    } else {
      console.debug(`[API] ${message}`);
    }
  },

  info(message: string, data?: unknown): void {
    if (!isDev) return;
    if (data !== undefined) {
      console.info(`[API] ${message}`, sanitize(data));
    } else {
      console.info(`[API] ${message}`);
    }
  },

  warn(message: string, data?: unknown): void {
    if (data !== undefined) {
      console.warn(`[API] ${message}`, sanitize(data));
    } else {
      console.warn(`[API] ${message}`);
    }
  },

  error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      console.error(`[API] ${message}`, error.message);
    } else if (error !== undefined) {
      console.error(`[API] ${message}`, sanitize(error));
    } else {
      console.error(`[API] ${message}`);
    }
  },
};

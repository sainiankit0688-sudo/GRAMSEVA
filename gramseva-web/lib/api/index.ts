export type { ApiResponse, ApiErrorBody, PaginatedResponse, RequestConfig, HttpMethod } from '@/types/api';

export { createApiClient, buildUrl } from './client';
export type { ApiClientConfig } from './client';

export {
  ApiClientError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ServerError,
  SessionExpiredError,
  RefreshFailedError,
  parseHttpError,
} from './errors';

export { parseResponse, parsePaginatedResponse } from './response';

export { createAuthenticatedClient, authenticatedClient } from './authenticatedClient';
export type { AuthenticatedApiClient, AuthenticatedClientConfig } from './authenticatedClient';

export { validateClientEnv, validateServerEnv, getEnv, getEnvOr } from './env';

export { logger } from './logger';

import type { ApiErrorBody } from '@/types/api';

export class ApiClientError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends ApiClientError {
  constructor(message = 'Network error. Please check your connection.') {
    super(message, undefined, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiClientError {
  constructor(message = 'Request timed out.') {
    super(message, undefined, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class UnauthorizedError extends ApiClientError {
  constructor(message = 'Unauthorized. Please log in again.') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiClientError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiClientError {
  constructor(message = 'Resource not found.') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiClientError {
  constructor(message = 'Validation failed.', details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ServerError extends ApiClientError {
  constructor(message = 'Internal server error.', status = 500) {
    super(message, status, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

export class SessionExpiredError extends ApiClientError {
  constructor(message = 'Session expired. Please log in again.') {
    super(message, 401, 'SESSION_EXPIRED');
    this.name = 'SessionExpiredError';
  }
}

export class RefreshFailedError extends ApiClientError {
  constructor(message = 'Failed to refresh session. Please log in again.') {
    super(message, 401, 'REFRESH_FAILED');
    this.name = 'RefreshFailedError';
  }
}

export function parseHttpError(status: number, body?: unknown): ApiClientError {
  let message: string;

  if (body && typeof body === 'object' && 'error' in body) {
    const errorBody = body as ApiErrorBody;
    message = errorBody.error || errorBody.message || `Request failed with status ${status}`;
  } else if (typeof body === 'string') {
    message = body;
  } else {
    message = `Request failed with status ${status}`;
  }

  switch (status) {
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 422:
      return new ValidationError(message, body);
    default:
      if (status >= 500) {
        return new ServerError(message, status);
      }
      return new ApiClientError(message, status, 'HTTP_ERROR', body);
  }
}

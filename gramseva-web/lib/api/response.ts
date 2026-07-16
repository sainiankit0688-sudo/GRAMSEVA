import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { parseHttpError } from './errors';

export async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    throw parseHttpError(response.status, body);
  }

  if (response.status === 204) {
    return { data: undefined as T, status: response.status, ok: true };
  }

  const data: T = await response.json();
  return { data, status: response.status, ok: true };
}

export async function parsePaginatedResponse<T>(
  response: Response,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<T>> {
  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    throw parseHttpError(response.status, body);
  }

  const data: unknown = await response.json();
  const total = parseInt(response.headers.get('x-total-count') || '0', 10);
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: Array.isArray(data) ? (data as T[]) : [data as T],
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
}

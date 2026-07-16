/**
 * Query Helpers — Pagination, Select, and Filter Builders
 *
 * Utility functions for constructing Supabase PostgREST-compatible
 * query parameters. Used by the service layer to build type-safe
 * query strings without manual string concatenation.
 *
 * @example
 * ```ts
 * import { buildSelect, buildPagination, buildFilters } from '@/lib/utils/queryHelpers';
 *
 * // Build a select clause
 * buildSelect(['id', 'title', 'category'])  →  'id,title,category'
 *
 * // Build pagination params
 * buildPagination({ page: 2, limit: 10 })
 *   →  { limit: 10, offset: 10, order: 'desc' }
 *
 * // Build filters
 * buildFilters({ category: 'eq.agriculture', status: 'eq.active' })
 *   →  { category: 'eq.agriculture', status: 'eq.active' }
 * ```
 */

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '@/lib/constants/api';

// ─── Select Builder ──────────────────────────────────────────────────────────

/**
 * Builds a Supabase PostgREST select clause from an array of column names.
 *
 * @param columns - Array of column names to select.
 * @returns Comma-separated select string, or '*' if empty.
 *
 * @example
 * ```ts
 * buildSelect(['id', 'title', 'about'])  →  'id,title,about'
 * buildSelect([])                          →  '*'
 * buildSelect()                           →  '*'
 * ```
 */
export function buildSelect(columns?: string[]): string {
  if (!columns || columns.length === 0) return '*';
  return columns.join(',');
}

/**
 * Builds a select clause with nested resource expansion.
 *
 * @param baseColumns - Top-level columns.
 * @param expansions - Resources to expand (PostgREST foreign key joins).
 * @returns PostgREST-compatible select string.
 *
 * @example
 * ```ts
 * buildSelectWithExpansions(
 *   ['id', 'title'],
 *   ['complaints(*)']
 * )  →  'id,title,complaints(*)'
 * ```
 */
export function buildSelectWithExpansions(
  baseColumns?: string[],
  expansions?: string[],
): string {
  const base = buildSelect(baseColumns);
  if (!expansions || expansions.length === 0) return base;
  return `${base},${expansions.join(',')}`;
}

// ─── Pagination Builder ──────────────────────────────────────────────────────

export interface PaginationParams {
  /** Page number (1-indexed). Defaults to DEFAULT_PAGE. */
  page?: number;
  /** Number of items per page. Clamped to [MIN_PAGE_SIZE, MAX_PAGE_SIZE]. */
  limit?: number;
}

export interface PaginationResult {
  /** Number of rows to fetch (limit). */
  limit: number;
  /** Number of rows to skip (offset). */
  offset: number;
}

/**
 * Converts page/limit pagination to offset-based parameters for PostgREST.
 * Clamps values to safe ranges.
 *
 * @param params - Pagination parameters.
 * @returns Object with `limit` and `offset` ready for query params.
 *
 * @example
 * ```ts
 * buildPagination({ page: 1, limit: 20 })
 *   →  { limit: 20, offset: 0 }
 *
 * buildPagination({ page: 3, limit: 10 })
 *   →  { limit: 10, offset: 20 }
 * ```
 */
export function buildPagination(params: PaginationParams = {}): PaginationResult {
  const page = Math.max(1, Math.floor(params.page ?? DEFAULT_PAGE));
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(MIN_PAGE_SIZE, Math.floor(params.limit ?? DEFAULT_PAGE_SIZE)),
  );
  const offset = (page - 1) * limit;

  return { limit, offset };
}

// ─── Filter Builder ──────────────────────────────────────────────────────────

export interface FilterMap {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Builds query parameters from a filter map.
 * Filters with undefined values are removed.
 *
 * @param filters - Key-value pairs where values are PostgREST filter operators
 *                  (e.g., `{ category: 'eq.agriculture', status: 'eq.active' }`).
 * @returns Clean filter object ready for URL search params.
 *
 * @example
 * ```ts
 * buildFilters({
 *   category: 'eq.agriculture',
 *   status: undefined,
 *   village: 'eq.Rampur',
 * })
 * →  { category: 'eq.agriculture', village: 'eq.Rampur' }
 * ```
 */
export function buildFilters(filters: FilterMap = {}): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) {
      result[key] = String(value);
    }
  }
  return result;
}

/**
 * Creates a PostgREST equality filter string.
 *
 * @param column - Column name.
 * @param value - Value to match.
 * @returns PostgREST filter string (e.g., `'eq.agriculture'`).
 */
export function eq(column: string, value: string | number): string {
  return `${column}=eq.${value}`;
}

/**
 * Creates a PostgREST "in" filter string.
 *
 * @param column - Column name.
 * @param values - Array of values to match.
 * @returns PostgREST filter string (e.g., `'category=in.(a,b,c)'`).
 */
export function isIn(column: string, values: (string | number)[]): string {
  const list = values.map((v) => String(v)).join(',');
  return `${column}=in.(${list})`;
}

/**
 * Creates a PostgREST "like" filter string.
 *
 * @param column - Column name.
 * @param pattern - SQL LIKE pattern (e.g., `%school%`).
 * @returns PostgREST filter string.
 */
export function like(column: string, pattern: string): string {
  return `${column}=like.${encodeURIComponent(pattern)}`;
}

/**
 * Creates a PostgREST "ilike" (case-insensitive like) filter string.
 *
 * @param column - Column name.
 * @param pattern - SQL LIKE pattern.
 * @returns PostgREST filter string.
 */
export function ilike(column: string, pattern: string): string {
  return `${column}=ilike.${encodeURIComponent(pattern)}`;
}

/**
 * Creates a PostgREST "gte" (greater than or equal) filter string.
 *
 * @param column - Column name.
 * @param value - Comparison value.
 * @returns PostgREST filter string.
 */
export function gte(column: string, value: string | number): string {
  return `${column}=gte.${value}`;
}

/**
 * Creates a PostgREST "lte" (less than or equal) filter string.
 *
 * @param column - Column name.
 * @param value - Comparison value.
 * @returns PostgREST filter string.
 */
export function lte(column: string, value: string | number): string {
  return `${column}=lte.${value}`;
}

// ─── Order Builder ───────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

/**
 * Creates a PostgREST order parameter.
 *
 * @param column - Column name to sort by.
 * @param direction - Sort direction ('asc' or 'desc').
 * @returns PostgREST order string.
 *
 * @example
 * ```ts
 * buildOrder('created_at', 'desc')  →  'created_at.desc'
 * ```
 */
export function buildOrder(column: string, direction: SortDirection = 'desc'): string {
  return `${column}.${direction}`;
}

// ─── Pagination Response Parser ──────────────────────────────────────────────

export interface PaginationMeta {
  /** Current page number (1-indexed). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;
  /** Total number of pages. */
  totalPages: number;
  /** Whether there are more pages after the current one. */
  hasMore: boolean;
}

/**
 * Parses pagination metadata from a response.
 *
 * @param total - Total number of items.
 * @param page - Current page number.
 * @param pageSize - Items per page.
 * @returns Parsed pagination metadata.
 */
export function parsePagination(
  total: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}

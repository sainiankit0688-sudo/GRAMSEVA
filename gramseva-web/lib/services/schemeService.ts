/**
 * Scheme Service
 *
 * Handles all CRUD operations for government schemes via
 * the authenticated API client. No duplicated fetch logic —
 * every method delegates to `authenticatedClient`.
 *
 * @example
 * ```ts
 * import { schemeService } from '@/lib/services/schemeService';
 *
 * const schemes = await schemeService.list({ category: 'agriculture' });
 * const scheme = await schemeService.getById('pm_kisan');
 * const created = await schemeService.create({ category: 'education', about: '...' });
 * ```
 */

import { authenticatedClient } from '@/lib/api/authenticatedClient';
import type { PaginatedResponse } from '@/types/api';
import { TABLE_SCHEMES, SELECT_SCHEMAS } from '@/lib/constants/api';
import {
  buildSelect,
  buildPagination,
  buildFilters,
  buildOrder,
  type PaginationParams,
  type FilterMap,
} from '@/lib/utils/queryHelpers';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Scheme {
  id: string;
  category: string;
  about: string;
  objective?: string;
  who_can_apply?: string[];
  eligibility?: string[];
  not_eligible?: string[];
  documents?: string[];
  benefits?: string[];
  apply_process?: string[];
  apply_online_url?: string;
  apply_offline?: string[];
  last_date?: string;
  helpline?: string;
  faqs?: { q: string; a: string }[];
  related_schemes?: string[];
  official_website_url?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateSchemeInput {
  category: string;
  about: string;
  [key: string]: unknown;
}

export interface UpdateSchemeInput {
  category?: string;
  about?: string;
  [key: string]: unknown;
}

export interface SchemeListOptions {
  /** Filter by category. */
  category?: string;
  /** Filter by state. */
  state?: string;
  /** Select specific columns. */
  columns?: string[];
  /** Pagination parameters. */
  pagination?: PaginationParams;
  /** Additional PostgREST filters. */
  filters?: FilterMap;
  /** Sort column and direction. */
  orderBy?: { column: string; direction?: 'asc' | 'desc' };
}

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/**
 * Get a single scheme by ID.
 *
 * @param id - Scheme UUID.
 * @param columns - Optional columns to select.
 * @returns The scheme record.
 */
async function getById(
  id: string,
  columns?: string[],
): Promise<Scheme> {
  const select = buildSelect(columns);
  const { data } = await authenticatedClient.get<Scheme>(
    `/${TABLE_SCHEMES}`,
    {
      params: {
        id: `eq.${id}`,
        select,
        limit: 1,
      },
    },
  );
  const items = Array.isArray(data) ? data : [data];
  return items[0] as Scheme;
}

/**
 * List schemes with optional filtering, pagination, and sorting.
 *
 * @param options - List options (category, columns, pagination, filters, orderBy).
 * @returns Array of scheme records.
 */
async function list(options: SchemeListOptions = {}): Promise<Scheme[]> {
  const {
    category,
    state,
    columns,
    pagination,
    filters: extraFilters,
    orderBy,
  } = options;

  const select = columns ? buildSelect(columns) : SELECT_SCHEMAS;
  const { limit, offset } = buildPagination(pagination);

  const params: Record<string, string | number | undefined> = {
    select,
    limit,
    offset,
  };

  if (category) {
    params.category = `eq.${category}`;
  }

  if (state) {
    params.about = `ilike.%${state}%`;
  }

  if (orderBy) {
    params.order = buildOrder(orderBy.column, orderBy.direction);
  }

  if (extraFilters) {
    Object.assign(params, buildFilters(extraFilters));
  }

  const { data } = await authenticatedClient.get<Scheme[]>(
    `/${TABLE_SCHEMES}`,
    { params },
  );

  return Array.isArray(data) ? data : [data];
}

/**
 * List schemes with full pagination metadata.
 *
 * @param options - List options.
 * @returns Paginated response with total, page, pageSize, totalPages, hasMore.
 */
async function listPaginated(
  options: SchemeListOptions & { pagination: PaginationParams },
): Promise<PaginatedResponse<Scheme>> {
  const { pagination } = options;
  return authenticatedClient.paginated<Scheme>(
    `/${TABLE_SCHEMES}`,
    pagination.page ?? 1,
    pagination.limit ?? 20,
    {
      params: {
        select: options.columns ? buildSelect(options.columns) : SELECT_SCHEMAS,
        ...(options.category ? { category: `eq.${options.category}` } : {}),
        ...(options.orderBy
          ? { order: buildOrder(options.orderBy.column, options.orderBy.direction) }
          : {}),
      },
    },
  );
}

/**
 * Create a new scheme.
 *
 * @param input - Scheme data.
 * @returns The created scheme record.
 */
async function create(input: CreateSchemeInput): Promise<Scheme> {
  const { data } = await authenticatedClient.post<Scheme>(
    `/${TABLE_SCHEMES}`,
    input,
  );
  return data as Scheme;
}

/**
 * Update an existing scheme by ID.
 *
 * @param id - Scheme UUID.
 * @param input - Fields to update.
 * @returns The updated scheme record.
 */
async function update(id: string, input: UpdateSchemeInput): Promise<Scheme> {
  const { data } = await authenticatedClient.patch<Scheme>(
    `/${TABLE_SCHEMES}`,
    input,
    { params: { id: `eq.${id}` } },
  );
  return data as Scheme;
}

/**
 * Delete a scheme by ID.
 *
 * @param id - Scheme UUID.
 */
async function remove(id: string): Promise<void> {
  await authenticatedClient.delete(
    `/${TABLE_SCHEMES}`,
    { params: { id: `eq.${id}` } },
  );
}

/**
 * Upsert a scheme (insert or update on conflict).
 *
 * @param input - Scheme data with optional `id`.
 * @returns The upserted scheme record.
 */
async function upsert(input: CreateSchemeInput & { id?: string }): Promise<Scheme> {
  const { data } = await authenticatedClient.post<Scheme>(
    `/${TABLE_SCHEMES}`,
    input,
    {
      params: { prefer: 'resolution=merge-duplicates' },
    },
  );
  return data as Scheme;
}

/**
 * Search schemes by text query on the `about` field.
 *
 * @param query - Search term (case-insensitive).
 * @param columns - Optional columns to select.
 * @returns Matching scheme records.
 */
async function search(query: string, columns?: string[]): Promise<Scheme[]> {
  const select = buildSelect(columns);
  const { data } = await authenticatedClient.get<Scheme[]>(
    `/${TABLE_SCHEMES}`,
    {
      params: {
        select,
        or: `(about.ilike.%${query}%,objective.ilike.%${query}%,id.ilike.%${query}%)`,
      },
    },
  );
  return Array.isArray(data) ? data : [data];
}

// ─── Export ──────────────────────────────────────────────────────────────────

export const schemeService = {
  getById,
  list,
  listPaginated,
  create,
  update,
  remove,
  upsert,
  search,
} as const;

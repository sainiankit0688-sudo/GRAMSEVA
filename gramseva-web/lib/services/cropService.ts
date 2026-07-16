/**
 * Crop Service
 *
 * Handles all CRUD operations for crop data via
 * the authenticated API client.
 *
 * @example
 * ```ts
 * import { cropService } from '@/lib/services/cropService';
 *
 * const crops = await cropService.list();
 * const crop = await cropService.getById('crop-uuid');
 * ```
 */

import { authenticatedClient } from '@/lib/api/authenticatedClient';
import type { PaginatedResponse } from '@/types/api';
import { TABLE_CROPS } from '@/lib/constants/api';
import {
  buildSelect,
  buildPagination,
  buildFilters,
  buildOrder,
  type PaginationParams,
  type FilterMap,
} from '@/lib/utils/queryHelpers';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Crop {
  id: string;
  name: string;
  season?: string;
  category?: string;
  description?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreateCropInput {
  name: string;
  season?: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
}

export interface UpdateCropInput {
  name?: string;
  season?: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
}

export interface CropListOptions {
  /** Filter by season. */
  season?: string;
  /** Filter by category. */
  category?: string;
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
 * Get a single crop by ID.
 *
 * @param id - Crop UUID.
 * @param columns - Optional columns to select.
 * @returns The crop record.
 */
async function getById(id: string, columns?: string[]): Promise<Crop> {
  const select = buildSelect(columns);
  const { data } = await authenticatedClient.get<Crop>(
    `/${TABLE_CROPS}`,
    {
      params: {
        id: `eq.${id}`,
        select,
        limit: 1,
      },
    },
  );
  const items = Array.isArray(data) ? data : [data];
  return items[0] as Crop;
}

/**
 * List crops with optional filtering, pagination, and sorting.
 *
 * @param options - List options (season, category, columns, pagination, filters, orderBy).
 * @returns Array of crop records.
 */
async function list(options: CropListOptions = {}): Promise<Crop[]> {
  const {
    season,
    category,
    columns,
    pagination,
    filters: extraFilters,
    orderBy,
  } = options;

  const select = buildSelect(columns);
  const { limit, offset } = buildPagination(pagination);

  const params: Record<string, string | number | undefined> = {
    select,
    limit,
    offset,
  };

  if (season) {
    params.season = `eq.${season}`;
  }
  if (category) {
    params.category = `eq.${category}`;
  }
  if (orderBy) {
    params.order = buildOrder(orderBy.column, orderBy.direction);
  }
  if (extraFilters) {
    Object.assign(params, buildFilters(extraFilters));
  }

  const { data } = await authenticatedClient.get<Crop[]>(
    `/${TABLE_CROPS}`,
    { params },
  );

  return Array.isArray(data) ? data : [data];
}

/**
 * List crops with full pagination metadata.
 *
 * @param options - List options with pagination.
 * @returns Paginated response.
 */
async function listPaginated(
  options: CropListOptions & { pagination: PaginationParams },
): Promise<PaginatedResponse<Crop>> {
  const { pagination } = options;
  return authenticatedClient.paginated<Crop>(
    `/${TABLE_CROPS}`,
    pagination.page ?? 1,
    pagination.limit ?? 20,
    {
      params: {
        select: buildSelect(options.columns),
        ...(options.season ? { season: `eq.${options.season}` } : {}),
        ...(options.category ? { category: `eq.${options.category}` } : {}),
        ...(options.orderBy
          ? { order: buildOrder(options.orderBy.column, options.orderBy.direction) }
          : {}),
      },
    },
  );
}

/**
 * Create a new crop.
 *
 * @param input - Crop data.
 * @returns The created crop record.
 */
async function create(input: CreateCropInput): Promise<Crop> {
  const { data } = await authenticatedClient.post<Crop>(
    `/${TABLE_CROPS}`,
    input,
  );
  return data as Crop;
}

/**
 * Update an existing crop by ID.
 *
 * @param id - Crop UUID.
 * @param input - Fields to update.
 * @returns The updated crop record.
 */
async function update(id: string, input: UpdateCropInput): Promise<Crop> {
  const { data } = await authenticatedClient.patch<Crop>(
    `/${TABLE_CROPS}`,
    input,
    { params: { id: `eq.${id}` } },
  );
  return data as Crop;
}

/**
 * Delete a crop by ID.
 *
 * @param id - Crop UUID.
 */
async function remove(id: string): Promise<void> {
  await authenticatedClient.delete(
    `/${TABLE_CROPS}`,
    { params: { id: `eq.${id}` } },
  );
}

/**
 * Search crops by name.
 *
 * @param query - Search term (case-insensitive).
 * @param columns - Optional columns to select.
 * @returns Matching crop records.
 */
async function search(query: string, columns?: string[]): Promise<Crop[]> {
  const select = buildSelect(columns);
  const { data } = await authenticatedClient.get<Crop[]>(
    `/${TABLE_CROPS}`,
    {
      params: {
        select,
        name: `ilike.%${query}%`,
      },
    },
  );
  return Array.isArray(data) ? data : [data];
}

/**
 * Upsert a crop (insert or update on conflict).
 *
 * @param input - Crop data with optional `id`.
 * @returns The upserted crop record.
 */
async function upsert(input: CreateCropInput & { id?: string }): Promise<Crop> {
  const { data } = await authenticatedClient.post<Crop>(
    `/${TABLE_CROPS}`,
    input,
    {
      params: { prefer: 'resolution=merge-duplicates' },
    },
  );
  return data as Crop;
}

// ─── Export ──────────────────────────────────────────────────────────────────

export const cropService = {
  getById,
  list,
  listPaginated,
  create,
  update,
  remove,
  search,
  upsert,
} as const;

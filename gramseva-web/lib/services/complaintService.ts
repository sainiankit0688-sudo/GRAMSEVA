/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

/**
 * Complaint Service
 *
 * Handles all CRUD operations for user complaints, complaint
 * updates (timeline), photo management, search, and analytics
 * via the authenticated API client.
 */

import { authenticatedClient } from '@/lib/api/authenticatedClient';
import { getAccessToken } from '@/lib/auth';
import type { PaginatedResponse } from '@/types/api';
import { TABLE_COMPLAINTS, TABLE_COMPLAINT_UPDATES } from '@/lib/constants/api';
import {
  buildSelect,
  buildPagination,
  buildFilters,
  buildOrder,
  type PaginationParams,
  type FilterMap,
} from '@/lib/utils/queryHelpers';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  address?: string;
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  pincode?: string;
  photo_url?: string;
  photo_urls?: string[];
  latitude?: number;
  longitude?: number;
  priority?: ComplaintPriority;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  previous_status: string;
  new_status: string;
  admin_remarks: string;
  updated_by: string;
  created_at: string;
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  category: string;
  address?: string;
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  pincode?: string;
  photo_url?: string;
  photo_urls?: string[];
  latitude?: number;
  longitude?: number;
  priority?: ComplaintPriority;
}

export interface UpdateComplaintInput {
  title?: string;
  description?: string;
  status?: ComplaintStatus;
  category?: string;
  address?: string;
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  pincode?: string;
  photo_url?: string;
  photo_urls?: string[];
  latitude?: number;
  longitude?: number;
  priority?: ComplaintPriority;
}

export interface ComplaintListOptions {
  status?: ComplaintStatus;
  category?: string;
  priority?: ComplaintPriority;
  district?: string;
  state?: string;
  village?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  columns?: string[];
  pagination?: PaginationParams;
  filters?: FilterMap;
  orderBy?: { column: string; direction?: 'asc' | 'desc' };
}

export interface ComplaintStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  avgResolutionDays: number | null;
  monthlyCounts: { month: string; count: number }[];
}

// ─── CRUD Operations ─────────────────────────────────────────────────────────

async function getById(id: string, columns?: string[]): Promise<Complaint> {
  const select = buildSelect(columns);
  const { data } = await authenticatedClient.get<Complaint>(
    `/${TABLE_COMPLAINTS}`,
    { params: { id: `eq.${id}`, select, limit: 1 } },
  );
  const items = Array.isArray(data) ? data : [data];
  return items[0] as Complaint;
}

async function listMine(options: ComplaintListOptions = {}): Promise<Complaint[]> {
  const {
    status, category, priority, district, state, village,
    dateFrom, dateTo, search,
    columns, pagination, filters: extraFilters,
    orderBy = { column: 'created_at', direction: 'desc' },
  } = options;

  const select = buildSelect(columns);
  const { limit, offset } = buildPagination(pagination);

  const params: Record<string, string | number | undefined> = {
    select, limit, offset,
    order: buildOrder(orderBy.column, orderBy.direction),
  };

  if (status) params.status = `eq.${status}`;
  if (category) params.category = `eq.${category}`;
  if (priority) params.priority = `eq.${priority}`;
  if (district) params.district = `like.*${encodeURIComponent(district)}*`;
  if (state) params.state = `like.*${encodeURIComponent(state)}*`;
  if (village) params.village = `like.*${encodeURIComponent(village)}*`;
  if (dateFrom) params.created_at = `gte.${dateFrom}`;
  if (dateTo) params.created_at = `lte.${dateTo}`;
  if (search) {
    params.or = `(title.ilike.*${encodeURIComponent(search)}*,description.ilike.*${encodeURIComponent(search)}*,village.ilike.*${encodeURIComponent(search)}*,district.ilike.*${encodeURIComponent(search)}*,id.ilike.*${encodeURIComponent(search)}*)`;
  }
  if (extraFilters) Object.assign(params, buildFilters(extraFilters));

  const { data } = await authenticatedClient.get<Complaint[]>(
    `/${TABLE_COMPLAINTS}`, { params },
  );
  return Array.isArray(data) ? data : [data];
}

async function listAll(
  options: ComplaintListOptions & { pagination: PaginationParams },
): Promise<PaginatedResponse<Complaint>> {
  const { pagination, status, category, priority, district, state, search } = options;
  const params: Record<string, string | number | undefined> = {
    select: buildSelect(options.columns),
    order: options.orderBy
      ? buildOrder(options.orderBy.column, options.orderBy.direction)
      : buildOrder('created_at', 'desc'),
  };
  if (status) params.status = `eq.${status}`;
  if (category) params.category = `eq.${category}`;
  if (priority) params.priority = `eq.${priority}`;
  if (district) params.district = `like.*${encodeURIComponent(district)}*`;
  if (state) params.state = `like.*${encodeURIComponent(state)}*`;
  if (search) {
    params.or = `(title.ilike.*${encodeURIComponent(search)}*,description.ilike.*${encodeURIComponent(search)}*,village.ilike.*${encodeURIComponent(search)}*,district.ilike.*${encodeURIComponent(search)}*)`;
  }

  return authenticatedClient.paginated<Complaint>(
    `/${TABLE_COMPLAINTS}`,
    pagination.page ?? 1,
    pagination.limit ?? 20,
    { params },
  );
}

async function create(input: CreateComplaintInput): Promise<Complaint> {
  const { data } = await authenticatedClient.post<Complaint>(
    `/${TABLE_COMPLAINTS}`, input,
  );
  return data as Complaint;
}

async function update(id: string, input: UpdateComplaintInput): Promise<Complaint> {
  const { data } = await authenticatedClient.patch<Complaint>(
    `/${TABLE_COMPLAINTS}`, input,
    { params: { id: `eq.${id}` } },
  );
  return data as Complaint;
}

async function remove(id: string): Promise<void> {
  await authenticatedClient.delete(
    `/${TABLE_COMPLAINTS}`, { params: { id: `eq.${id}` } },
  );
}

async function cancel(id: string): Promise<Complaint> {
  return update(id, { status: 'rejected' });
}

// ─── Photo Management ────────────────────────────────────────────────────────

async function uploadPhoto(file: File, userId: string): Promise<string> {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const token = getAccessToken();
  if (!token || !SUPABASE_URL) throw new Error('Authentication required.');

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/complaints/${path}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error_description || body.message || 'Upload failed.');
  }

  return `${SUPABASE_URL}/storage/v1/object/public/complaints/${path}`;
}

async function uploadPhotos(files: File[], userId: string): Promise<string[]> {
  const results = await Promise.all(
    files.map((file) => uploadPhoto(file, userId)),
  );
  return results;
}

async function deletePhoto(photoUrl: string): Promise<void> {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const token = getAccessToken();
  if (!token || !SUPABASE_URL) throw new Error('Authentication required.');

  const urlParts = photoUrl.split('/complaints/');
  const path = urlParts[1];
  if (!path) throw new Error('Invalid photo URL.');

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/complaints/${path}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error_description || body.message || 'Delete failed.');
  }
}

// ─── Search & Nearby ─────────────────────────────────────────────────────────

async function searchNearby(
  lat: number,
  lng: number,
  radiusKm: number = 10,
): Promise<Complaint[]> {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  const { data } = await authenticatedClient.get<Complaint[]>(
    `/${TABLE_COMPLAINTS}`,
    {
      params: {
        select: '*',
        latitude: `gte.${(lat - latDelta).toFixed(6)},lte.${(lat + latDelta).toFixed(6)}`,
        longitude: `gte.${(lng - lngDelta).toFixed(6)},lte.${(lng + lngDelta).toFixed(6)}`,
        order: 'created_at.desc',
        limit: 20,
      },
    },
  );
  return Array.isArray(data) ? data : data ? [data] : [];
}

async function searchByCategory(category: string, excludeId?: string): Promise<Complaint[]> {
  const params: Record<string, string | number> = {
    select: '*',
    category: `eq.${category}`,
    order: 'created_at.desc',
    limit: 10,
  };
  if (excludeId) {
    params.id = `neq.${excludeId}`;
  }
  const { data } = await authenticatedClient.get<Complaint[]>(
    `/${TABLE_COMPLAINTS}`, { params },
  );
  return Array.isArray(data) ? data : data ? [data] : [];
}

async function searchByVillage(village: string, excludeId?: string): Promise<Complaint[]> {
  const params: Record<string, string | number> = {
    select: '*',
    village: `eq.${village}`,
    order: 'created_at.desc',
    limit: 10,
  };
  if (excludeId) {
    params.id = `neq.${excludeId}`;
  }
  const { data } = await authenticatedClient.get<Complaint[]>(
    `/${TABLE_COMPLAINTS}`, { params },
  );
  return Array.isArray(data) ? data : data ? [data] : [];
}

// ─── Complaint Updates (Timeline) ────────────────────────────────────────────

async function getUpdates(complaintId: string): Promise<ComplaintUpdate[]> {
  const { data } = await authenticatedClient.get<ComplaintUpdate[]>(
    `/${TABLE_COMPLAINT_UPDATES}`,
    {
      params: {
        complaint_id: `eq.${complaintId}`,
        select: '*',
        order: 'created_at.desc',
      },
    },
  );
  return Array.isArray(data) ? data : data ? [data] : [];
}

// ─── Export ──────────────────────────────────────────────────────────────────

export const complaintService = {
  getById,
  listMine,
  listAll,
  create,
  update,
  remove,
  cancel,
  uploadPhoto,
  uploadPhotos,
  deletePhoto,
  searchNearby,
  searchByCategory,
  searchByVillage,
  getUpdates,
} as const;

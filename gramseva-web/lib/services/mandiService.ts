/**
 * Mandi Service
 *
 * Handles live market price data from the Railway backend
 * (Data.gov.in source). Uses the internal /api/mandi proxy route.
 */

import { createApiClient } from '@/lib/api/client';
import { REQUEST_TIMEOUT } from '@/lib/constants/api';
import type { MandiApiResponse, MandiQueryParams } from '@/lib/agriculture/types';

// ─── Internal Client ──────────────────────────────────────────────────────────

const mandiClient = createApiClient({
  baseUrl: '',
  timeout: REQUEST_TIMEOUT,
  retries: 1,
});

// ─── Operations ───────────────────────────────────────────────────────────────

async function getPrices(params: MandiQueryParams = {}): Promise<MandiApiResponse> {
  const searchParams = new URLSearchParams();
  if (params.state) searchParams.set('state', params.state);
  if (params.commodity) searchParams.set('commodity', params.commodity);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.offset) searchParams.set('offset', String(params.offset));

  const qs = searchParams.toString();
  const path = `/api/mandi${qs ? `?${qs}` : ''}`;

  const { data } = await mandiClient.get<MandiApiResponse>(path);
  return data as MandiApiResponse;
}

async function getStates(): Promise<string[]> {
  const { data } = await mandiClient.get<string[]>('/api/mandi?endpoint=states');
  return (data as string[]) || [];
}

async function getCommodities(): Promise<string[]> {
  const { data } = await mandiClient.get<string[]>('/api/mandi?endpoint=commodities');
  return (data as string[]) || [];
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const mandiService = {
  getPrices,
  getStates,
  getCommodities,
} as const;

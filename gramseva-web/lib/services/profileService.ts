/**
 * Profile Service
 *
 * Handles user profile CRUD operations via the authenticated API client.
 * Uses Supabase GoTrue for user metadata and PostgREST for profile records.
 *
 * @example
 * ```ts
 * import { profileService } from '@/lib/services/profileService';
 *
 * const profile = await profileService.getCurrent();
 * await profileService.update({ name: 'Ramesh', village: 'Rampur' });
 * ```
 */

import { authenticatedClient } from '@/lib/api/authenticatedClient';
import { getAccessToken, getStoredUser, type AuthUser } from '@/lib/auth';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  role?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
}

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/**
 * Get the current user's profile.
 * First checks localStorage for cached user data,
 * then fetches from Supabase GoTrue API.
 *
 * @returns The current user profile, or null if not authenticated.
 */
async function getCurrent(): Promise<UserProfile | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const { data } = await authenticatedClient.get<UserProfile>('/auth/v1/user');
    return data as UserProfile;
  } catch {
    // Fall back to cached user from localStorage
    const stored = getStoredUser();
    if (!stored) return null;
    return mapAuthUserToProfile(stored);
  }
}

/**
 * Update the current user's profile via Supabase GoTrue API.
 *
 * @param input - Fields to update.
 * @returns The updated user profile.
 * @throws SessionExpiredError if not authenticated.
 * @throws RefreshFailedError if token refresh fails.
 */
async function update(input: UpdateProfileInput): Promise<UserProfile> {
  const { data } = await authenticatedClient.put<UserProfile>(
    '/auth/v1/user',
    { data: input },
  );
  return data as UserProfile;
}

/**
 * Get a specific user profile by ID (admin use).
 *
 * @param id - User UUID.
 * @returns The user profile.
 */
async function getById(id: string): Promise<UserProfile> {
  const { data } = await authenticatedClient.get<UserProfile>(
    `/auth/v1/admin/users/${id}`,
  );
  return data as UserProfile;
}

/**
 * Check if the current user has admin role.
 *
 * @returns True if user has admin role.
 */
async function isAdmin(): Promise<boolean> {
  const profile = await getCurrent();
  return profile?.role === 'admin';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapAuthUserToProfile(user: AuthUser): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name,
    phone: user.user_metadata?.phone,
    village: user.user_metadata?.village,
    district: user.user_metadata?.district,
    state: user.user_metadata?.state,
    role: user.app_metadata?.role,
    created_at: user.created_at,
  };
}

// ─── Export ──────────────────────────────────────────────────────────────────

export const profileService = {
  getCurrent,
  update,
  getById,
  isAdmin,
} as const;

/**
 * Global Cache Invalidation Helpers
 *
 * Provides domain-specific cache invalidation functions that work
 * with the existing QueryCache infrastructure. These are the
 * canonical way to invalidate cached data after mutations.
 *
 * @example
 * ```ts
 * import { invalidateSchemes, invalidateProfile } from '@/lib/cache/invalidation';
 *
 * // After creating a complaint:
 * await complaintService.create(data);
 * invalidateComplaints();
 *
 * // After profile update:
 * await profileService.update(data);
 * invalidateProfile();
 *
 * // On logout:
 * invalidateAll();
 * ```
 */

import { queryCache, serializeQueryKey } from './queryCache';
import { queryKeys } from '@/lib/queryKeys';

// ─── Domain Invalidation ─────────────────────────────────────────────────────

/**
 * Invalidate all scheme-related cache entries.
 * Call after creating, updating, or deleting a scheme.
 */
export function invalidateSchemes(): void {
  const prefix = serializeQueryKey(queryKeys.schemes.all());
  queryCache.invalidateByPrefix(prefix);
}

/**
 * Invalidate all crop-related cache entries.
 * Call after creating, updating, or deleting a crop.
 */
export function invalidateCrops(): void {
  const prefix = serializeQueryKey(queryKeys.crops.all());
  queryCache.invalidateByPrefix(prefix);
}

/**
 * Invalidate all complaint-related cache entries.
 * Call after creating, updating, or deleting a complaint.
 */
export function invalidateComplaints(): void {
  const prefix = serializeQueryKey(queryKeys.complaints.all());
  queryCache.invalidateByPrefix(prefix);
}

/**
 * Invalidate the current user's profile cache.
 * Call after updating profile data.
 */
export function invalidateProfile(): void {
  const prefix = serializeQueryKey(queryKeys.profile.current());
  queryCache.invalidateByPrefix(prefix);
}

/**
 * Invalidate weather-related cache entries.
 * Call after switching location or when data is stale.
 */
export function invalidateWeather(): void {
  const prefix = serializeQueryKey(queryKeys.weather.city(''));
  queryCache.invalidateByPrefix(prefix);
}

/**
 * Invalidate all course-related cache entries.
 */
export function invalidateCourses(): void {
  const prefix = serializeQueryKey(queryKeys.courses.all());
  queryCache.invalidateByPrefix(prefix);
}

// ─── Global Invalidation ─────────────────────────────────────────────────────

/**
 * Invalidate the entire query cache.
 * Use on logout or when a full refresh is needed.
 */
export function invalidateAll(): void {
  queryCache.invalidateAll();
}

// ─── Auth Event Hooks ────────────────────────────────────────────────────────

/**
 * Called after a successful login.
 * Clears any stale public data and forces fresh fetches.
 */
export function onAuthLogin(): void {
  // Public data may have been fetched without auth — invalidate to refetch with auth
  invalidateSchemes();
  invalidateCourses();
}

/**
 * Called after logout.
 * Clears the entire cache to prevent data leakage between users.
 */
export function onAuthLogout(): void {
  invalidateAll();
}

/**
 * Called after a successful token refresh.
 * No cache invalidation needed — tokens are transparent to cached data.
 * This hook exists for future extensibility (e.g., analytics).
 */
export function onAuthRefresh(): void {
  // No-op: token refresh is transparent to cached data
}

/**
 * Called after a password reset.
 * Clears profile-related data that may be affected.
 */
export function onPasswordReset(): void {
  invalidateProfile();
}

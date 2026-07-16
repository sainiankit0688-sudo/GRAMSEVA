/**
 * Query Key Factory
 *
 * Centralized, typed query key generation for all data domains.
 * Eliminates string duplication and ensures consistent cache keying.
 *
 * @example
 * ```ts
 * import { queryKeys } from '@/lib/queryKeys';
 *
 * // In useQuery:
 * useQuery(queryKeys.schemes.all(), () => fetchSchemes());
 * useQuery(queryKeys.schemes.detail('pm_kisan'), () => fetchScheme('pm_kisan'));
 *
 * // In cache invalidation:
 * queryCache.invalidateByPrefix(serializeQueryKey(queryKeys.schemes.all()));
 * ```
 */

// ─── Scheme Keys ─────────────────────────────────────────────────────────────

const schemeKeys = {
  /** Base key for all scheme queries. */
  all: () => ['schemes'] as const,

  /** Key for a filtered scheme list by category. */
  list: (category?: string) =>
    category ? (['schemes', 'list', category] as const) : (['schemes', 'list'] as const),

  /** Key for a single scheme detail. */
  detail: (id: string) => ['schemes', 'detail', id] as const,

  /** Key for scheme search results. */
  search: (query: string) => ['schemes', 'search', query] as const,

  /** Key for featured schemes. */
  featured: () => ['schemes', 'featured'] as const,
};

// ─── Crop Keys ───────────────────────────────────────────────────────────────

const cropKeys = {
  /** Base key for all crop queries. */
  all: () => ['crops'] as const,

  /** Key for a filtered crop list. */
  list: (filters?: string) =>
    filters ? (['crops', 'list', filters] as const) : (['crops', 'list'] as const),

  /** Key for a single crop detail. */
  detail: (id: string) => ['crops', 'detail', id] as const,

  /** Key for crop search results. */
  search: (query: string) => ['crops', 'search', query] as const,
};

// ─── Complaint Keys ──────────────────────────────────────────────────────────

const complaintKeys = {
  /** Base key for all complaint queries. */
  all: () => ['complaints'] as const,

  /** Key for the current user's complaints. */
  mine: () => ['complaints', 'mine'] as const,

  /** Key for a single complaint detail. */
  detail: (id: string) => ['complaints', 'detail', id] as const,

  /** Key for complaint updates (timeline). */
  updates: (id: string) => ['complaints', 'updates', id] as const,

  /** Key for admin complaint list. */
  admin: () => ['complaints', 'admin'] as const,

  /** Key for admin complaint list with status filter. */
  adminFiltered: (status: string) => ['complaints', 'admin', status] as const,

  /** Key for filtered complaint list. */
  list: (filters?: string) =>
    filters ? (['complaints', 'list', filters] as const) : (['complaints', 'list'] as const),

  /** Key for complaint search results. */
  search: (query: string) => ['complaints', 'search', query] as const,

  /** Key for complaint stats/analytics. */
  stats: () => ['complaints', 'stats'] as const,

  /** Key for nearby complaints. */
  nearby: (lat: number, lng: number) => ['complaints', 'nearby', lat, lng] as const,

  /** Key for related complaints by category. */
  relatedCategory: (category: string, excludeId: string) =>
    ['complaints', 'related', 'category', category, excludeId] as const,

  /** Key for related complaints by village. */
  relatedVillage: (village: string, excludeId: string) =>
    ['complaints', 'related', 'village', village, excludeId] as const,
};

// ─── Profile Keys ────────────────────────────────────────────────────────────

const profileKeys = {
  /** Key for the current user's profile. */
  current: () => ['profile', 'current'] as const,

  /** Key for a specific user profile. */
  user: (id: string) => ['profile', 'user', id] as const,
};

// ─── Weather Keys ────────────────────────────────────────────────────────────

const weatherKeys = {
  city: (city: string) => ['weather', 'city', city] as const,
  coords: (lat: number, lon: number) => ['weather', 'coords', lat, lon] as const,
  forecast: (city: string) => ['weather', 'forecast', city] as const,
  aqi: (lat: number, lon: number) => ['weather', 'aqi', lat, lon] as const,
  uv: (lat: number, lon: number) => ['weather', 'uv', lat, lon] as const,
  favorites: () => ['weather', 'favorites'] as const,
};

// ─── Mandi Keys ──────────────────────────────────────────────────────────────

const mandiKeys = {
  /** Base key for all mandi queries. */
  all: () => ['mandi'] as const,

  /** Key for filtered mandi prices. */
  filtered: (state?: string, commodity?: string) => {
    if (state && commodity) return ['mandi', 'filtered', state, commodity] as const;
    if (state) return ['mandi', 'filtered', state] as const;
    if (commodity) return ['mandi', 'filtered', undefined, commodity] as const;
    return ['mandi', 'list'] as const;
  },
};

// ─── Education Keys ──────────────────────────────────────────────────────────

const educationKeys = {
  all: () => ['education'] as const,
  scholarships: (category?: string) =>
    category ? (['education', 'scholarships', category] as const) : (['education', 'scholarships'] as const),
  exams: () => ['education', 'exams'] as const,
  courses: (category?: string) =>
    category ? (['education', 'courses', category] as const) : (['education', 'courses'] as const),
  studyMaterial: (category?: string) =>
    category ? (['education', 'studyMaterial', category] as const) : (['education', 'studyMaterial'] as const),
  careerGuidance: () => ['education', 'careerGuidance'] as const,
  skills: () => ['education', 'skills'] as const,
  colleges: () => ['education', 'colleges'] as const,
  faq: () => ['education', 'faq'] as const,
  search: (query: string) => ['education', 'search', query] as const,
  bookmarks: () => ['education', 'bookmarks'] as const,
};

// ─── Emergency Keys ──────────────────────────────────────────────────────────

const emergencyKeys = {
  all: () => ['emergency'] as const,
  contacts: () => ['emergency', 'contacts'] as const,
  searchContacts: (query: string) => ['emergency', 'contacts', 'search', query] as const,
  hospitals: (state?: string) =>
    state ? (['emergency', 'hospitals', state] as const) : (['emergency', 'hospitals'] as const),
  hospital: (id: string) => ['emergency', 'hospitals', id] as const,
  police: (district?: string) =>
    district ? (['emergency', 'police', district] as const) : (['emergency', 'police'] as const),
  fire: () => ['emergency', 'fire'] as const,
  ambulance: (type?: string) =>
    type ? (['emergency', 'ambulance', type] as const) : (['emergency', 'ambulance'] as const),
  disaster: () => ['emergency', 'disaster'] as const,
  disasterStep: (id: string) => ['emergency', 'disaster', id] as const,
  helplines: (category?: string) =>
    category ? (['emergency', 'helplines', category] as const) : (['emergency', 'helplines'] as const),
  searchHelplines: (query: string) => ['emergency', 'helplines', 'search', query] as const,
};

// ─── Course Keys ─────────────────────────────────────────────────────────────

const courseKeys = {
  /** Base key for all course queries. */
  all: () => ['courses'] as const,

  /** Key for a course category. */
  category: (slug: string) => ['courses', 'category', slug] as const,

  /** Key for a single course detail. */
  detail: (id: string) => ['courses', 'detail', id] as const,
};

// ─── Admin Keys ───────────────────────────────────────────────────────────

const adminKeys = {
  all: () => ['admin'] as const,
  dashboard: () => ['admin', 'dashboard'] as const,
  users: (filters?: Record<string, unknown>) =>
    filters ? (['admin', 'users', filters] as const) : (['admin', 'users'] as const),
  user: (id: string) => ['admin', 'users', id] as const,
  complaints: (filters?: Record<string, unknown>) =>
    filters ? (['admin', 'complaints', filters] as const) : (['admin', 'complaints'] as const),
  complaint: (id: string) => ['admin', 'complaints', id] as const,
  analytics: () => ['admin', 'analytics'] as const,
  advancedAnalytics: () => ['admin', 'analytics', 'advanced'] as const,
  complaintAnalytics: () => ['admin', 'analytics', 'complaints'] as const,
  userAnalytics: () => ['admin', 'analytics', 'users'] as const,
  weatherAnalytics: () => ['admin', 'analytics', 'weather'] as const,
  educationAnalytics: () => ['admin', 'analytics', 'education'] as const,
  emergencyAnalytics: () => ['admin', 'analytics', 'emergency'] as const,
  aiAnalytics: () => ['admin', 'analytics', 'ai'] as const,
  activity: () => ['admin', 'activity'] as const,
  liveActivity: () => ['admin', 'liveActivity'] as const,
  auditLogs: (filters?: Record<string, unknown>) =>
    filters ? (['admin', 'auditLogs', filters] as const) : (['admin', 'auditLogs'] as const),
  notifications: () => ['admin', 'notifications'] as const,
  media: () => ['admin', 'media'] as const,
  content: (table: string) => ['admin', 'content', table] as const,
  settings: () => ['admin', 'settings'] as const,
  backups: () => ['admin', 'backups'] as const,
  health: () => ['admin', 'health'] as const,
  globalSearch: (query: string) => ['admin', 'search', query] as const,
};

// ─── Combined Export ─────────────────────────────────────────────────────────

/**
 * Complete query key factory organized by domain.
 *
 * Usage:
 * ```ts
 * queryKeys.schemes.all()          → ['schemes']
 * queryKeys.schemes.detail('x')    → ['schemes', 'detail', 'x']
 * queryKeys.crops.list('kharif')   → ['crops', 'list', 'kharif']
 * queryKeys.profile.current()      → ['profile', 'current']
 * queryKeys.weather.city('Delhi')  → ['weather', 'city', 'Delhi']
 * ```
 */
export const queryKeys = {
  schemes: schemeKeys,
  crops: cropKeys,
  complaints: complaintKeys,
  profile: profileKeys,
  weather: weatherKeys,
  courses: courseKeys,
  mandi: mandiKeys,
  education: educationKeys,
  emergency: emergencyKeys,
  admin: adminKeys,
} as const;

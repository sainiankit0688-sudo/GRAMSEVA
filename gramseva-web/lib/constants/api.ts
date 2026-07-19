/**
 * Shared API constants for the GramSeva web application.
 *
 * All magic numbers for timeouts, retries, pagination, caching,
 * and Supabase configuration are centralized here.
 * Never hardcode these values elsewhere.
 */

// ─── HTTP Timeouts ───────────────────────────────────────────────────────────

/** Default request timeout in milliseconds. */
export const REQUEST_TIMEOUT = 30_000;

/** Timeout for long-running requests (e.g., file uploads). */
export const REQUEST_TIMEOUT_LONG = 60_000;

/** Timeout for fast-fail requests (e.g., health checks). */
export const REQUEST_TIMEOUT_SHORT = 10_000;

// ─── Retry Configuration ─────────────────────────────────────────────────────

/** Default number of retry attempts for failed GET requests. */
export const DEFAULT_RETRIES = 2;

/** Base delay in milliseconds between retries. Actual delay uses exponential backoff. */
export const DEFAULT_RETRY_DELAY = 1_000;

/** Number of retries for the hook layer (useQuery). */
export const HOOK_RETRY_COUNT = 3;

/** Base delay for hook-layer retries. */
export const HOOK_RETRY_DELAY = 1_000;

// ─── Pagination Defaults ─────────────────────────────────────────────────────

/** Default page size for paginated queries. */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum allowed page size. */
export const MAX_PAGE_SIZE = 100;

/** Minimum page size. */
export const MIN_PAGE_SIZE = 1;

/** Default starting page number (1-indexed). */
export const DEFAULT_PAGE = 1;

// ─── Cache Durations ─────────────────────────────────────────────────────────

/** Stale time for scheme data (5 minutes). */
export const SCHEME_STALE_TIME = 5 * 60 * 1_000;

/** Stale time for user profile data (2 minutes). */
export const PROFILE_STALE_TIME = 2 * 60 * 1_000;

/** Stale time for complaint data (1 minute). */
export const COMPLAINT_STALE_TIME = 1 * 60 * 1_000;

/** Complaint draft autosave key prefix. */
export const COMPLAINT_DRAFT_KEY = 'gs_complaint_draft';

/** Complaint notifications localStorage key. */
export const COMPLAINT_NOTIFICATIONS_KEY = 'gs_complaint_notifications';

/** Max photos per complaint. */
export const COMPLAINT_MAX_PHOTOS = 5;

/** Max photo file size in bytes (5MB). */
export const COMPLAINT_MAX_PHOTO_SIZE = 5 * 1024 * 1024;

/** Autosave interval in ms (30 seconds). */
export const COMPLAINT_AUTOSAVE_INTERVAL = 30_000;

/** Stale time for crop data (5 minutes). */
export const CROP_STALE_TIME = 5 * 60 * 1_000;

/** Stale time for weather data (10 minutes). */
export const WEATHER_STALE_TIME = 10 * 60 * 1_000;

/** Refetch interval for weather data (5 minutes). */
export const WEATHER_REFETCH_INTERVAL = 5 * 60 * 1_000;

/** Stale time for mandi data (5 minutes). */
export const MANDI_STALE_TIME = 5 * 60 * 1_000;

/** Refetch interval for mandi data (5 minutes). */
export const MANDI_REFETCH_INTERVAL = 5 * 60 * 1_000;

// ─── Token Management ────────────────────────────────────────────────────────

/** Buffer in milliseconds before token expiry to trigger refresh. */
export const TOKEN_EXPIRY_BUFFER_MS = 60 * 1_000;

// ─── Supabase REST API ───────────────────────────────────────────────────────

/** Supabase REST API path prefix. */
export const SUPABASE_REST_PREFIX = '/rest/v1';

/** Supabase auth API path prefix. */
export const SUPABASE_AUTH_PREFIX = '/auth/v1';

// ─── Service Table Names ─────────────────────────────────────────────────────

/** Supabase table name for government schemes. */
export const TABLE_SCHEMES = 'schemes';

/** Supabase table name for user complaints. */
export const TABLE_COMPLAINTS = 'complaints';

/** Supabase table name for crops. */
export const TABLE_CROPS = 'crops';

/** Supabase table name for courses. */
export const TABLE_COURSES = 'courses';

/** Supabase table name for complaint status updates (timeline). */
export const TABLE_COMPLAINT_UPDATES = 'complaint_updates';

/** Supabase table name for emergency contacts. */
export const TABLE_EMERGENCY_CONTACTS = 'emergency_contacts';

/** Supabase table name for weather alerts. */
export const TABLE_WEATHER_ALERTS = 'weather_alerts';

/** Supabase table name for education resources. */
export const TABLE_EDUCATION_RESOURCES = 'education_resources';

/** Supabase table name for audit logs. */
export const TABLE_AUDIT_LOGS = 'audit_logs';

/** Supabase table name for notifications. */
export const TABLE_NOTIFICATIONS = 'notifications';

/** Supabase table name for media files. */
export const TABLE_MEDIA = 'media';

/** Supabase table name for FAQs. */
export const TABLE_FAQS = 'faqs';

/** Supabase table name for admin settings. */
export const TABLE_ADMIN_SETTINGS = 'admin_settings';

/** Supabase table name for backups. */
export const TABLE_BACKUPS = 'backups';

// ─── Default Select Columns ──────────────────────────────────────────────────

/** Default select clause for schemes. */
export const SELECT_SCHEMAS = 'id,category,about,created_at';

/** Default select clause for complaints. */
export const SELECT_COMPLAINTS = '*';

/** Default select clause for crops. */
export const SELECT_CROPS = '*';

/** Default select clause for courses. */
export const SELECT_COURSES = '*';

/** Stale time for education data (10 minutes — rarely changes). */
export const EDUCATION_STALE_TIME = 10 * 60 * 1_000;

/** Stale time for emergency data (5 minutes — needs to be reasonably current). */
export const EMERGENCY_STALE_TIME = 5 * 60 * 1_000;

// ─── AI Module ────────────────────────────────────────────────────────────────

/** localStorage key for AI conversations. */
export const AI_CONVERSATIONS_KEY = 'gs_ai_conversations';

/** localStorage key for AI recent prompts. */
export const AI_RECENT_PROMPTS_KEY = 'gs_ai_recent_prompts';

/** Maximum characters per chat message. */
export const AI_MAX_MESSAGE_LENGTH = 2000;

/** Maximum conversations stored locally. */
export const AI_MAX_CONVERSATIONS = 50;

/** Stale time for AI data (0 — always fresh, client-managed). */
export const AI_STALE_TIME = 0;

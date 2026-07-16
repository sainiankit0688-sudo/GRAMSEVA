const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const SESSION_COOKIE = 'gs_session';
const TOKEN_EXPIRY_BUFFER = 60 * 1000;

export interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata: {
    name?: string;
    phone?: string;
    village?: string;
    district?: string;
    state?: string;
    [key: string]: unknown;
  };
  app_metadata: {
    role?: string;
    [key: string]: unknown;
  };
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: AuthUser;
}

export interface AuthResponse {
  data?: AuthSession;
  error?: string;
}

// ─── Cookie Helpers ──────────────────────────────────────────────────────────

export function setSessionCookie(session: AuthSession): void {
  if (typeof document === 'undefined') return;
  const maxAge = session.expires_at
    ? Math.max(0, session.expires_at - Math.floor(Date.now() / 1000))
    : 60 * 60 * 24 * 7;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith(`${SESSION_COOKIE}=`));
}

// ─── Token Storage (localStorage) ────────────────────────────────────────────

const TOKEN_KEY = 'gs_access_token';
const REFRESH_KEY = 'gs_refresh_token';
const USER_KEY = 'gs_supabase_user';
const EXPIRY_KEY = 'gs_token_expiry';

export function saveTokens(session: AuthSession): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, session.access_token);
  localStorage.setItem(REFRESH_KEY, session.refresh_token);
  localStorage.setItem(EXPIRY_KEY, String(session.expires_at));
  if (session.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
  setSessionCookie(session);
}

export function clearTokens(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  clearSessionCookie();
}

export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(): boolean {
  if (typeof localStorage === 'undefined') return true;
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() >= (parseInt(expiry, 10) * 1000) - TOKEN_EXPIRY_BUFFER;
}

export function hasStoredSession(): boolean {
  return !!getAccessToken() && !!getRefreshToken();
}

// ─── Cross-Tab Auth Subscription ─────────────────────────────────────────────
// Uses the browser `storage` event to detect auth changes in other tabs.
// The `storage` event only fires in *other* tabs, not the current one,
// so each tab independently tracks its own auth state.

type AuthListener = () => void;
const authListeners = new Set<AuthListener>();
let storageListenerAttached = false;

function onStorageEvent(event: StorageEvent) {
  if (
    event.key === TOKEN_KEY ||
    event.key === REFRESH_KEY ||
    event.key === USER_KEY ||
    event.key === EXPIRY_KEY
  ) {
    authListeners.forEach((listener) => listener());
  }
}

function ensureStorageListener() {
  if (storageListenerAttached) return;
  if (typeof window === 'undefined') return;
  window.addEventListener('storage', onStorageEvent);
  storageListenerAttached = true;
}

/**
 * Subscribe to cross-tab auth changes.
 * Returns an unsubscribe function.
 * Safe to call from React useEffect — handles SSR and cleanup.
 */
export function subscribeToAuthChanges(callback: AuthListener): () => void {
  ensureStorageListener();
  authListeners.add(callback);
  return () => {
    authListeners.delete(callback);
    if (authListeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorageEvent);
      storageListenerAttached = false;
    }
  };
}

/**
 * Snapshot function for useSyncExternalStore.
 * Returns the current auth user from localStorage.
 * When called after a storage event, reads the updated state.
 */
export function getAuthSnapshot(): AuthUser | null {
  return getStoredUser();
}

/**
 * Server snapshot — always null (no localStorage on server).
 */
export function getAuthServerSnapshot(): null {
  return null;
}

// ─── Supabase GoTrue API ─────────────────────────────────────────────────────

function gotrueHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
}

function authHeaders(token: string): Record<string, string> {
  return {
    ...gotrueHeaders(),
    Authorization: `Bearer ${token}`,
  };
}

export async function signUp(params: {
  email: string;
  password: string;
  name: string;
  phone: string;
  village?: string;
  district?: string;
  state?: string;
}): Promise<AuthResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Backend not configured.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: gotrueHeaders(),
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        data: {
          name: params.name,
          phone: params.phone,
          village: params.village || '',
          district: params.district || '',
          state: params.state || '',
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error_description || data.msg || 'Signup failed.' };
    }

    if (data.access_token) {
      const session: AuthSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        user: data.user,
      };
      saveTokens(session);
      return { data: session };
    }

    return { data: undefined, error: '' };
  } catch {
    return { error: 'Network error. Please try again.' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Backend not configured.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: gotrueHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error_description || data.msg || 'Invalid email or password.' };
    }

    const session: AuthSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      user: data.user,
    };
    saveTokens(session);
    return { data: session };
  } catch {
    return { error: 'Network error. Please try again.' };
  }
}

export async function signOut(): Promise<void> {
  const token = getAccessToken();
  if (token && SUPABASE_URL) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: authHeaders(token),
      });
    } catch {
      // Ignore logout API errors
    }
  }
  clearTokens();
  clearLegacyStorage();
}

export async function refreshSession(): Promise<AuthResponse> {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'No refresh token available.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: gotrueHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      clearTokens();
      return { error: data.error_description || 'Session expired.' };
    }

    const session: AuthSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      user: data.user,
    };
    saveTokens(session);
    return { data: session };
  } catch {
    return { error: 'Network error during refresh.' };
  }
}

export async function ensureValidSession(): Promise<AuthSession | null> {
  if (!hasStoredSession()) return null;

  if (!isTokenExpired()) {
    const user = getStoredUser();
    const token = getAccessToken();
    const refreshToken = getRefreshToken();
    if (user && token && refreshToken) {
      const expiryStr = typeof localStorage !== 'undefined' ? localStorage.getItem(EXPIRY_KEY) : null;
      return {
        access_token: token,
        refresh_token: refreshToken,
        expires_at: expiryStr ? parseInt(expiryStr, 10) : 0,
        user,
      };
    }
  }

  const result = await refreshSession();
  return result.data || null;
}

export async function getUser(): Promise<AuthUser | null> {
  const token = getAccessToken();
  if (!token || !SUPABASE_URL) return null;

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: authHeaders(token),
    });

    if (!res.ok) {
      if (res.status === 401) {
        const refreshResult = await refreshSession();
        if (refreshResult.data) {
          const retry = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: authHeaders(refreshResult.data.access_token),
          });
          if (retry.ok) {
            const user = await retry.json();
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
          }
        }
      }
      return getStoredUser();
    }

    const user = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return getStoredUser();
  }
}

export async function updateUser(data: {
  name?: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
}): Promise<{ error?: string }> {
  const token = getAccessToken();
  if (!token || !SUPABASE_URL) {
    return { error: 'Not authenticated.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ data }),
    });

    if (!res.ok) {
      const body = await res.json();
      return { error: body.error_description || body.msg || 'Update failed.' };
    }

    const user = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return {};
  } catch {
    return { error: 'Network error.' };
  }
}

export async function forgotPassword(email: string): Promise<{ error?: string }> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Backend not configured.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: gotrueHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error_description || data.msg || 'Recovery request failed.' };
    }

    return {};
  } catch {
    return { error: 'Network error.' };
  }
}

export async function resetPassword(newPassword: string, accessToken: string): Promise<{ error?: string }> {
  if (!SUPABASE_URL) {
    return { error: 'Backend not configured.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: authHeaders(accessToken),
      body: JSON.stringify({ password: newPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error_description || data.msg || 'Password reset failed.' };
    }

    return {};
  } catch {
    return { error: 'Network error.' };
  }
}

export async function exchangeCodeForSession(code: string): Promise<AuthResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Backend not configured.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=authorization_code`, {
      method: 'POST',
      headers: gotrueHeaders(),
      body: JSON.stringify({ auth_code: code }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error_description || data.msg || 'Code exchange failed.' };
    }

    const session: AuthSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      user: data.user,
    };
    saveTokens(session);
    return { data: session };
  } catch {
    return { error: 'Network error.' };
  }
}

// ─── Legacy Migration ─────────────────────────────────────────────────────────

export function clearLegacyStorage(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('gs_current_user');
  localStorage.removeItem('gs_users');
  localStorage.removeItem('gs_user');
}



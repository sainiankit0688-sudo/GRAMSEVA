const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gramseva-ten.vercel.app';

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

// ─── Server Session Sync (HttpOnly Cookies) ──────────────────────────────────

export async function syncSessionToServer(session: AuthSession): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      }),
    });
  } catch { /* non-blocking */ }
}

export async function clearServerSession(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch { /* non-blocking */ }
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
  notifyAuthListeners();
}

export function clearTokens(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  notifyAuthListeners();
}

export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

let _cachedUserRaw: string | null = null;
let _cachedUser: AuthUser | null = null;

export function getStoredUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw === _cachedUserRaw) return _cachedUser;
    _cachedUserRaw = raw;
    _cachedUser = raw ? JSON.parse(raw) : null;
    return _cachedUser;
  } catch {
    _cachedUserRaw = null;
    _cachedUser = null;
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

function notifyAuthListeners(): void {
  authListeners.forEach((listener) => listener());
}

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
  const trimmedEmail = params.email.trim().toLowerCase();
  const trimmedPassword = params.password.trim();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Backend not configured.' };
  }

  try {
    if (process.env.NODE_ENV !== 'production') console.log('[Auth] Signing up:', { email: trimmedEmail });
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: gotrueHeaders(),
      body: JSON.stringify({
        email: trimmedEmail,
        password: trimmedPassword,
        data: {
          name: params.name,
          phone: params.phone,
          village: params.village || '',
          district: params.district || '',
          state: params.state || '',
        },
        options: {
          emailRedirectTo: `${SITE_URL}/auth/callback`,
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
      syncSessionToServer(session);
      return { data: session };
    }

    return { data: undefined, error: '' };
  } catch {
    return { error: 'Network error. Please try again.' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV !== 'production') console.error('[Auth] Backend not configured. SUPABASE_URL:', SUPABASE_URL ? 'set' : 'EMPTY', 'ANON_KEY:', SUPABASE_ANON_KEY ? 'set' : 'EMPTY');
    return { error: 'Backend not configured.' };
  }

  try {
    if (process.env.NODE_ENV !== 'production') console.log('[Auth] Signing in:', { email: trimmedEmail });
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: gotrueHeaders(),
      body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (process.env.NODE_ENV !== 'production') console.error('[Auth] Sign-in failed:', { status: res.status, error: data });
      return { error: data.error_description || data.msg || 'Invalid email or password.' };
    }

    if (process.env.NODE_ENV !== 'production') console.log('[Auth] Sign-in success for:', trimmedEmail);

    const session: AuthSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      user: data.user,
    };
    saveTokens(session);
    syncSessionToServer(session);
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
  clearServerSession();
  clearLegacyStorage();
}

let refreshLock: Promise<AuthResponse> | null = null;

export async function refreshSession(): Promise<AuthResponse> {
  if (refreshLock) return refreshLock;

  refreshLock = (async () => {
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
      syncSessionToServer(session);
      return { data: session };
    } catch {
      return { error: 'Network error during refresh.' };
    }
  })();

  try {
    return await refreshLock;
  } finally {
    refreshLock = null;
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
            notifyAuthListeners();
            return user;
          }
        }
      }
      return getStoredUser();
    }

    const user = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notifyAuthListeners();
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
    notifyAuthListeners();
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
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
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
    syncSessionToServer(session);
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



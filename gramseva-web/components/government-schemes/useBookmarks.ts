'use client';

/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { queryCache } from '@/lib/cache/queryCache';
import {
  hasStoredSession,
  subscribeToAuthChanges,
  getAccessToken,
} from '@/lib/auth';

const BOOKMARKS_LOCAL_KEY = 'gs_bookmarks';
const BOOKMARKS_TABLE = 'scheme_bookmarks';

function getLocalBookmarks(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const stored = localStorage.getItem(BOOKMARKS_LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function setLocalBookmarks(ids: string[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(BOOKMARKS_LOCAL_KEY, JSON.stringify(ids));
}

const FETCH_TIMEOUT = 8000;

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

function getHeaders(token: string) {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return { apikey: anonKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function fetchRemoteBookmarks(): Promise<string[]> {
  try {
    const token = getAccessToken();
    if (!token) return [];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const res = await fetchWithTimeout(`${supabaseUrl}/rest/v1/${BOOKMARKS_TABLE}?select=scheme_id`, {
      headers: getHeaders(token),
    });
    if (!res.ok) return [];
    const data: { scheme_id: string }[] = await res.json();
    return data.map((r) => r.scheme_id);
  } catch { return []; }
}

async function syncLocalToRemote(localIds: string[]): Promise<void> {
  const token = getAccessToken();
  if (!token || localIds.length === 0) return;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const existing = await fetchRemoteBookmarks();
  const toAdd = localIds.filter((id) => !existing.includes(id));
  if (toAdd.length === 0) return;
  const rows = toAdd.map((scheme_id) => ({ scheme_id }));
  await fetchWithTimeout(`${supabaseUrl}/rest/v1/${BOOKMARKS_TABLE}`, {
    method: 'POST',
    headers: { ...getHeaders(token), Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify(rows),
  });
}

async function toggleRemoteBookmark(schemeId: string, add: boolean): Promise<void> {
  const token = getAccessToken();
  if (!token) return;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (add) {
    await fetchWithTimeout(`${supabaseUrl}/rest/v1/${BOOKMARKS_TABLE}`, {
      method: 'POST',
      headers: { ...getHeaders(token), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ scheme_id: schemeId }),
    });
  } else {
    await fetchWithTimeout(`${supabaseUrl}/rest/v1/${BOOKMARKS_TABLE}?scheme_id=eq.${schemeId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  }
}

const BOOKMARK_CACHE_KEY = 'bookmarks_state';

export function useBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const cached = queryCache.get<string[]>(BOOKMARK_CACHE_KEY);
    return cached ?? getLocalBookmarks();
  });

  const isLoggedIn = useSyncExternalStore(
    subscribeToAuthChanges,
    () => hasStoredSession(),
    () => false,
  );

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    fetchRemoteBookmarks().then((remoteIds) => {
      if (cancelled) return;
      const localIds = getLocalBookmarks();
      if (localIds.length > 0) {
        const merged = [...new Set([...localIds, ...remoteIds])];
        setLocalBookmarks(merged);
        syncLocalToRemote(merged).then(() => {
          if (cancelled) return;
          setLocalBookmarks(merged);
          setBookmarkIds(merged);
          queryCache.set(BOOKMARK_CACHE_KEY, merged);
        });
      } else {
        setBookmarkIds(remoteIds);
        queryCache.set(BOOKMARK_CACHE_KEY, remoteIds);
      }
    });
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const isBookmarked = useCallback((schemeId: string) => {
    return bookmarkIds.includes(schemeId);
  }, [bookmarkIds]);

  const toggleBookmark = useCallback(async (schemeId: string) => {
    const isPresent = bookmarkIds.includes(schemeId);
    let newIds: string[];
    if (isPresent) {
      newIds = bookmarkIds.filter((id) => id !== schemeId);
    } else {
      newIds = [...bookmarkIds, schemeId];
    }
    setLocalBookmarks(newIds);
    setBookmarkIds(newIds);
    queryCache.set(BOOKMARK_CACHE_KEY, newIds);
    if (isLoggedIn) {
      await toggleRemoteBookmark(schemeId, !isPresent);
    }
    if (isLoggedIn) {
      setLocalBookmarks(newIds);
      queryCache.set(BOOKMARK_CACHE_KEY, newIds);
    }
  }, [bookmarkIds, isLoggedIn]);

  return { bookmarkIds, isBookmarked, toggleBookmark };
}

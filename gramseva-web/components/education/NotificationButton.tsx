'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useCallback } from 'react';
import { useSyncExternalStore } from 'react';
import { hasStoredSession, subscribeToAuthChanges, getAccessToken } from '@/lib/auth';

const NOTIFICATION_PREF_KEY = 'gs_education_notifications';
const NOTIFICATIONS_TABLE = 'education_notifications';

interface NotificationPrefs {
  [itemId: string]: boolean;
}

function getPrefs(): NotificationPrefs {
  if (typeof localStorage === 'undefined') return {};
  try {
    const stored = localStorage.getItem(NOTIFICATION_PREF_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function setPrefs(prefs: NotificationPrefs): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(NOTIFICATION_PREF_KEY, JSON.stringify(prefs));
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

async function toggleRemoteNotification(itemId: string, add: boolean): Promise<void> {
  const token = getAccessToken();
  if (!token) return;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (add) {
    await fetchWithTimeout(`${supabaseUrl}/rest/v1/${NOTIFICATIONS_TABLE}`, {
      method: 'POST',
      headers: { ...getHeaders(token), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ item_id: itemId }),
    });
  } else {
    await fetchWithTimeout(`${supabaseUrl}/rest/v1/${NOTIFICATIONS_TABLE}?item_id=eq.${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  }
}

interface NotificationButtonProps {
  itemId: string;
}

export default function NotificationButton({ itemId }: NotificationButtonProps) {
  const [subscribed, setSubscribed] = useState(() => getPrefs()[itemId] ?? false);

  const isLoggedIn = useSyncExternalStore(
    subscribeToAuthChanges,
    () => hasStoredSession(),
    () => false,
  );

  const toggle = useCallback(() => {
    setSubscribed((prev) => {
      const next = !prev;
      const prefs = getPrefs();
      prefs[itemId] = next;
      setPrefs(prefs);
      if (isLoggedIn) {
        toggleRemoteNotification(itemId, next).catch(() => {});
      }
      return next;
    });
  }, [itemId, isLoggedIn]);

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        subscribed
          ? 'bg-blue-50 border-blue-200 text-blue-700'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200'
      }`}
      aria-label={subscribed ? 'Unsubscribe from notifications' : 'Get notifications for updates'}
      aria-pressed={subscribed}
    >
      <svg className="w-3.5 h-3.5" fill={subscribed ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {subscribed ? 'Subscribed' : 'Notify Me'}
    </button>
  );
}

'use client';

/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useCallback } from 'react';

const NOTIFICATION_PREF_KEY = 'gs_notifications';

interface NotificationPrefs {
  [schemeId: string]: boolean;
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

interface NotificationButtonProps {
  schemeId: string;
}

export default function NotificationButton({ schemeId }: NotificationButtonProps) {
  const [subscribed, setSubscribed] = useState(() => {
    return getPrefs()[schemeId] ?? false;
  });

  const toggle = useCallback(() => {
    setSubscribed((prev) => {
      const next = !prev;
      const prefs = getPrefs();
      prefs[schemeId] = next;
      setPrefs(prefs);
      return next;
    });
  }, [schemeId]);

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        subscribed
          ? 'bg-blue-50 border-blue-200 text-blue-700'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200'
      }`}
      aria-label={subscribed ? 'Unsubscribe from notifications' : 'Get notifications for this scheme'}
      aria-pressed={subscribed}
    >
      <svg className="w-3.5 h-3.5" fill={subscribed ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {subscribed ? 'Subscribed' : 'Notify Me'}
    </button>
  );
}

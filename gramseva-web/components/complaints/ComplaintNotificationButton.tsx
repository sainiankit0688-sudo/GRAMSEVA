'use client';

/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useState, useCallback, useMemo } from 'react';
import { COMPLAINT_NOTIFICATIONS_KEY } from '@/lib/constants/api';

interface NotificationEntry {
  id: string;
  complaintId: string;
  title: string;
  message: string;
  type: 'created' | 'status_changed' | 'resolved' | 'rejected';
  read: boolean;
  createdAt: string;
}

function loadNotifications(): NotificationEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPLAINT_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifs: NotificationEntry[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(COMPLAINT_NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch {
    // Ignore
  }
}

export function addComplaintNotification(
  n: Omit<NotificationEntry, 'id' | 'read' | 'createdAt'>,
): void {
  const existing = loadNotifications();
  const entry: NotificationEntry = {
    ...n,
    id: Math.random().toString(36).slice(2, 9),
    read: false,
    createdAt: new Date().toISOString(),
  };
  saveNotifications([entry, ...existing].slice(0, 50));
}

export default function ComplaintNotificationButton() {
  const [notifications, setNotifications] = useState<NotificationEntry[]>(() => loadNotifications());
  const [showPanel, setShowPanel] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const markAllRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    setNotifications(updated);
  }, [notifications]);

  const clearAll = useCallback(() => {
    saveNotifications([]);
    setNotifications([]);
  }, []);

  const dismissNotification = useCallback(
    (id: string) => {
      const updated = notifications.filter((n) => n.id !== id);
      saveNotifications(updated);
      setNotifications(updated);
    },
    [notifications],
  );

  const typeIcon: Record<string, string> = {
    created: '📝',
    status_changed: '🔄',
    resolved: '✅',
    rejected: '❌',
  };

  function formatTime(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={showPanel}
      >
        <span className="text-lg" aria-hidden="true">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 max-h-80 overflow-hidden" role="dialog" aria-label="Notifications panel">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Notifications</span>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-amber-700 hover:underline"
                >
                  Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <span className="text-2xl" aria-hidden="true">🔕</span>
              <p className="text-xs text-gray-400 mt-2">No notifications</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-64" role="list">
              {notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2 p-3 border-b border-gray-50 ${n.read ? 'opacity-60' : 'bg-amber-50/30'}`}
                  role="listitem"
                >
                  <span className="text-sm mt-0.5" aria-hidden="true">{typeIcon[n.type] || '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 truncate">{n.message}</p>
                    <time className="text-xs text-gray-400" dateTime={n.createdAt}>
                      {formatTime(n.createdAt)}
                    </time>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissNotification(n.id)}
                    className="text-gray-300 hover:text-gray-500 text-xs"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

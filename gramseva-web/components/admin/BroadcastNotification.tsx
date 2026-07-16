/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { adminService, type Notification } from '@/lib/services/adminService';

const NOTIFICATION_TYPES = [
  { value: 'push', label: 'Push Notification' },
  { value: 'email', label: 'Email' },
  { value: 'in_app', label: 'In-App' },
] as const;

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'farmers', label: 'Farmers' },
  { value: 'students', label: 'Students' },
  { value: 'women', label: 'Women' },
  { value: 'senior_citizens', label: 'Senior Citizens' },
  { value: 'custom', label: 'Custom' },
] as const;

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-amber-100 text-amber-700',
  sent: 'bg-emerald-100 text-emerald-700',
};

const TYPE_LABELS: Record<string, string> = {
  push: 'Push',
  email: 'Email',
  in_app: 'In-App',
};

interface NotificationForm {
  title: string;
  body: string;
  type: 'push' | 'email' | 'in_app';
  audience: string;
  scheduleEnabled: boolean;
  scheduledAt: string;
}

const EMPTY_FORM: NotificationForm = {
  title: '',
  body: '',
  type: 'push',
  audience: 'all',
  scheduleEnabled: false,
  scheduledAt: '',
};

export default function BroadcastNotification() {
  const [form, setForm] = useState<NotificationForm>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery(
    queryKeys.admin.notifications(),
    () => adminService.getNotifications({ page, limit: 10 }),
    { staleTime: 30_000 },
  );

  const notifications = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const updateField = useCallback(<K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }, []);

  const previewNotification = useCallback((): Notification => ({
    id: 'preview',
    title: form.title || '(No title)',
    body: form.body || '(No body)',
    type: form.type,
    audience: form.audience,
    status: form.scheduleEnabled ? 'scheduled' : 'draft',
    scheduled_at: form.scheduleEnabled ? form.scheduledAt : undefined,
    sent_at: !form.scheduleEnabled ? new Date().toISOString() : undefined,
    created_at: new Date().toISOString(),
  }), [form]);

  const validate = useCallback((): string | null => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.body.trim()) return 'Body is required.';
    if (form.scheduleEnabled && !form.scheduledAt) return 'Schedule date/time is required.';
    return null;
  }, [form]);

  const handleSend = useCallback(async () => {
    const error = validate();
    if (error) {
      setFeedback({ kind: 'error', message: error });
      return;
    }

    setSending(true);
    setFeedback(null);

    try {
      await adminService.sendNotification({
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type,
        audience: form.audience,
        scheduled_at: form.scheduleEnabled ? form.scheduledAt : undefined,
      });
      setFeedback({ kind: 'success', message: form.scheduleEnabled ? 'Notification scheduled successfully!' : 'Notification sent successfully!' });
      setForm(EMPTY_FORM);
      refetch();
    } catch (err) {
      setFeedback({ kind: 'error', message: err instanceof Error ? err.message : 'Failed to send notification.' });
    } finally {
      setSending(false);
    }
  }, [form, validate, refetch]);

  const preview = previewNotification();

  return (
    <section className="space-y-6" aria-label="Broadcast Notification">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold">Broadcast Notification</h2>
        <p className="text-indigo-100 text-xs mt-1">Compose and send notifications to your users</p>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`rounded-2xl px-4 py-3 text-sm ${feedback.kind === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Compose</h3>

          <div className="space-y-1.5">
            <label htmlFor="notif-title" className="text-xs font-medium text-gray-600">
              Title <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="notif-title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Notification title"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              aria-required="true"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notif-body" className="text-xs font-medium text-gray-600">
              Body <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="notif-body"
              value={form.body}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Write your notification message..."
              rows={4}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="notif-type" className="text-xs font-medium text-gray-600">Type</label>
              <select
                id="notif-type"
                value={form.type}
                onChange={(e) => updateField('type', e.target.value as NotificationForm['type'])}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                {NOTIFICATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="notif-audience" className="text-xs font-medium text-gray-600">Audience</label>
              <select
                id="notif-audience"
                value={form.audience}
                onChange={(e) => updateField('audience', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                {AUDIENCE_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.scheduleEnabled}
                onClick={() => updateField('scheduleEnabled', !form.scheduleEnabled)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 ${form.scheduleEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${form.scheduleEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-xs text-gray-600">
                {form.scheduleEnabled ? 'Schedule for later' : 'Send immediately'}
              </span>
            </div>

            {form.scheduleEnabled && (
              <div className="space-y-1.5">
                <label htmlFor="notif-schedule" className="text-xs font-medium text-gray-600">Schedule Date &amp; Time</label>
                <input
                  id="notif-schedule"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => updateField('scheduledAt', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
            aria-label={form.scheduleEnabled ? 'Schedule notification' : 'Send notification now'}
          >
            {sending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />}
            {sending ? 'Sending...' : form.scheduleEnabled ? 'Schedule Notification' : 'Send Now'}
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Preview</h3>

          <div className="border border-gray-200 rounded-2xl overflow-hidden" aria-label="Notification preview">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white" aria-hidden="true">
                  G
                </div>
                <span className="text-xs font-medium text-white">GramSeva</span>
                <span className="text-[10px] text-indigo-200 ml-auto">{TYPE_LABELS[preview.type]}</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800">{preview.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{preview.body}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">To:</span>
                <span className="text-[10px] text-indigo-600 font-medium capitalize">{preview.audience === 'all' ? 'All Users' : preview.audience.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Type</span>
              <span className="text-gray-700 font-medium">{TYPE_LABELS[preview.type]}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Audience</span>
              <span className="text-gray-700 font-medium capitalize">{preview.audience === 'all' ? 'All Users' : preview.audience.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Delivery</span>
              <span className="text-gray-700 font-medium">{preview.scheduled_at ? 'Scheduled' : 'Immediate'}</span>
            </div>
            {preview.scheduled_at && (
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">Scheduled For</span>
                <span className="text-gray-700 font-medium">{new Date(preview.scheduled_at).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Notification History</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs text-gray-400">No notifications sent yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Sent notifications history">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell" scope="col">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Audience</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell" scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-800 truncate max-w-[200px]">{n.title}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{n.body}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-600">{TYPE_LABELS[n.type] || n.type}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600 capitalize">{n.audience === 'all' ? 'All Users' : n.audience.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[n.status] || 'bg-gray-100 text-gray-500'}`}>
                        {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {n.sent_at ? new Date(n.sent_at).toLocaleDateString('en-IN') : n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN') : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3">
            <nav className="flex items-center justify-center gap-1" aria-label="Notification history pagination">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Previous page"
              >
                ← Prev
              </button>
              <span className="text-xs text-gray-500 px-2">Page {page} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Next page"
              >
                Next →
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}

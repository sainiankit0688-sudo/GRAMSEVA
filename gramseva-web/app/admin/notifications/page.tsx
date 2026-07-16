/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import BroadcastNotification from '@/components/admin/BroadcastNotification';

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
        <p className="text-xs text-gray-500 mt-0.5">Send and manage broadcast notifications</p>
      </div>
      <BroadcastNotification />
    </div>
  );
}

/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import LiveActivity from '@/components/admin/LiveActivity';

export default function AdminLivePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Live Activity</h1>
        <p className="text-xs text-gray-500 mt-0.5">Real-time feed of admin actions</p>
      </div>
      <LiveActivity />
    </div>
  );
}

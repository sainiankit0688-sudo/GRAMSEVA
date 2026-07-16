/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import SystemHealth from '@/components/admin/SystemHealth';

export default function AdminHealthPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">System Health</h1>
        <p className="text-xs text-gray-500 mt-0.5">Monitor all platform services and APIs</p>
      </div>
      <SystemHealth />
    </div>
  );
}

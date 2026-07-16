/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import AuditLogTable from '@/components/admin/AuditLogTable';

export default function AdminAuditPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Audit Logs</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track all admin actions and system events</p>
      </div>
      <AuditLogTable />
    </div>
  );
}

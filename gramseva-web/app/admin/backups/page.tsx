/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import BackupManager from '@/components/admin/BackupManager';

export default function AdminBackupsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Backup & Restore</h1>
        <p className="text-xs text-gray-500 mt-0.5">Create backups and restore data</p>
      </div>
      <BackupManager />
    </div>
  );
}

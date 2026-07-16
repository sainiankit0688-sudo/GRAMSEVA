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
import { adminService, type BackupRecord } from '@/lib/services/adminService';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

type BackupType = 'full' | 'complaints' | 'users' | 'schemes';

const BACKUP_TYPE_OPTIONS: Array<{ value: BackupType; label: string }> = [
  { value: 'full', label: 'Full Backup' },
  { value: 'complaints', label: 'Complaints' },
  { value: 'users', label: 'Users' },
  { value: 'schemes', label: 'Schemes' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  running: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function toCSV(backups: BackupRecord[]): string {
  const header = 'ID,Type,Status,Size (bytes),Created At';
  const rows = backups.map(
    (b) => `${b.id},${b.type},${b.status},${b.file_size ?? ''},${b.created_at}`,
  );
  return [header, ...rows].join('\n');
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BackupManager() {
  const [backupType, setBackupType] = useState<BackupType>('full');
  const [creating, setCreating] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<BackupRecord | null>(null);

  const {
    data: backups,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(queryKeys.admin.backups(), () => adminService.getBackups(), {
    staleTime: 30_000,
  });

  const handleCreateBackup = useCallback(async () => {
    setCreating(true);
    try {
      await adminService.createBackup(backupType);
      await refetch();
    } finally {
      setCreating(false);
    }
  }, [backupType, refetch]);

  const handleExportCSV = useCallback(() => {
    if (!backups || backups.length === 0) return;
    const csv = toCSV(backups);
    downloadCSV(csv, `gramseva-backups-${Date.now()}.csv`);
  }, [backups]);

  const handleRestore = useCallback(async () => {
    if (!restoreTarget) return;
    setRestoreTarget(null);
  }, [restoreTarget]);

  const backupList = backups ?? [];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5" aria-label="Backup Manager">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Backup &amp; Restore</h2>
          <p className="text-xs text-gray-500 mt-0.5">Create and manage database backups</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="backup-type-select" className="sr-only">Backup type</label>
          <select
            id="backup-type-select"
            value={backupType}
            onChange={(e) => setBackupType(e.target.value as BackupType)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {BACKUP_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleCreateBackup}
            disabled={creating}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
          >
            {creating ? (
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
            {creating ? 'Creating...' : 'New Backup'}
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={backupList.length === 0}
            className="flex items-center gap-1.5 border border-gray-200 text-xs text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Export backup history as CSV"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading backups">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ))}
          <span className="sr-only">Loading backups...</span>
        </div>
      ) : backupList.length === 0 ? (
        <div className="text-center py-10">
          <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">No backups yet</p>
          <p className="text-xs text-gray-400 mt-1">Create your first backup to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-gray-100">
                <th scope="col" className="text-[10px] font-medium text-gray-500 uppercase tracking-wider pb-2 pr-4">ID</th>
                <th scope="col" className="text-[10px] font-medium text-gray-500 uppercase tracking-wider pb-2 pr-4">Type</th>
                <th scope="col" className="text-[10px] font-medium text-gray-500 uppercase tracking-wider pb-2 pr-4">Status</th>
                <th scope="col" className="text-[10px] font-medium text-gray-500 uppercase tracking-wider pb-2 pr-4">Size</th>
                <th scope="col" className="text-[10px] font-medium text-gray-500 uppercase tracking-wider pb-2 pr-4">Created At</th>
                <th scope="col" className="text-[10px] font-medium text-gray-500 uppercase tracking-wider pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backupList.map((backup) => (
                <tr key={backup.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4">
                    <span className="text-xs font-mono text-gray-600">{backup.id.slice(0, 8)}</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="text-xs text-gray-700 capitalize">{backup.type}</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[backup.status] || 'bg-gray-100 text-gray-500'}`}>
                      {STATUS_LABELS[backup.status] || backup.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="text-xs text-gray-600">
                      {backup.file_size != null ? formatBytes(backup.file_size) : '—'}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="text-xs text-gray-500">
                      {new Date(backup.created_at).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setRestoreTarget(backup)}
                      disabled={backup.status === 'failed'}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-1.5 py-0.5"
                      aria-label={`Restore backup ${backup.id.slice(0, 8)}`}
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isFetching && !isLoading && (
            <p className="text-[10px] text-gray-400 text-center mt-2">Refreshing...</p>
          )}
        </div>
      )}

      <ConfirmDialog
        open={restoreTarget !== null}
        title="Restore Backup"
        message={`Are you sure you want to restore backup ${restoreTarget?.id.slice(0, 8)}? This action will overwrite current data.`}
        confirmLabel="Restore"
        variant="warning"
        onConfirm={handleRestore}
        onCancel={() => setRestoreTarget(null)}
      />
    </section>
  );
}

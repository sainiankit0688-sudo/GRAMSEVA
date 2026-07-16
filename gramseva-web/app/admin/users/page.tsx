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
import { adminService } from '@/lib/services/adminService';
import UserTable from '@/components/admin/UserTable';
import SearchBar from '@/components/admin/SearchBar';
import ExportButton from '@/components/admin/ExportButton';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import type { UserRecord } from '@/components/admin/UserTable';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [actionTarget, setActionTarget] = useState<{ id: string; action: 'suspend' | 'activate' | 'delete' } | null>(null);

  const filters = { page, search };

  const { data, isLoading, refetch } = useQuery(
    [...queryKeys.admin.users(filters)] as unknown as readonly (string | number)[],
    () => adminService.getAdmins({
      search: search || undefined,
      pagination: { page, limit: 20 },
    }),
    { staleTime: 30_000 },
  );

  const handleSuspend = useCallback(async () => {
    if (!actionTarget || actionTarget.action !== 'suspend') return;
    try { await adminService.changeStatus(actionTarget.id, false); setActionTarget(null); refetch(); } catch { /* ignore */ }
  }, [actionTarget, refetch]);

  const handleActivate = useCallback(async () => {
    if (!actionTarget || actionTarget.action !== 'activate') return;
    try { await adminService.changeStatus(actionTarget.id, true); setActionTarget(null); refetch(); } catch { /* ignore */ }
  }, [actionTarget, refetch]);

  const handleDelete = useCallback(async () => {
    if (!actionTarget || actionTarget.action !== 'delete') return;
    try { await adminService.deleteUser(actionTarget.id); setActionTarget(null); refetch(); } catch { /* ignore */ }
  }, [actionTarget, refetch]);

  const handleExportCSV = useCallback(() => {
    const items = data?.data || [];
    const csv = ['Name,Email,Phone,Role,Status,Last Login'];
    items.forEach((u) => csv.push(`"${(u.name || '').replace(/"/g, '""')}",${u.email || ''},${u.phone || ''},${u.role || 'user'},${u.is_active !== false ? 'Active' : 'Suspended'},${u.last_sign_in_at || ''}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Users</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage registered users</p>
        </div>
        <ExportButton onExportCSV={handleExportCSV} label="Export CSV" />
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." />

      <UserTable
        users={(data?.data || []) as UserRecord[]}
        total={data?.total || 0}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        onSuspend={(id) => setActionTarget({ id, action: 'suspend' })}
        onActivate={(id) => setActionTarget({ id, action: 'activate' })}
        onDelete={(id) => setActionTarget({ id, action: 'delete' })}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={actionTarget?.action === 'suspend'}
        title="Suspend User"
        message="This user will be temporarily blocked from accessing the platform."
        confirmLabel="Suspend"
        variant="warning"
        onConfirm={handleSuspend}
        onCancel={() => setActionTarget(null)}
      />
      <ConfirmDialog
        open={actionTarget?.action === 'activate'}
        title="Activate User"
        message="Restore this user's access to the platform."
        confirmLabel="Activate"
        variant="info"
        onConfirm={handleActivate}
        onCancel={() => setActionTarget(null)}
      />
      <ConfirmDialog
        open={actionTarget?.action === 'delete'}
        title="Delete User"
        message="This action cannot be undone. The user account will be permanently deleted."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setActionTarget(null)}
      />
    </div>
  );
}

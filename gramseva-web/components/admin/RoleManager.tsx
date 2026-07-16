/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { adminService } from '@/lib/services/adminService';
import type { AdminUser, AdminRole } from '@/lib/services/adminService';
import { getRoleLevel, getRolePermissions } from '@/lib/services/adminService';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Pagination from '@/components/admin/Pagination';

const ALL_ROLES: AdminRole[] = ['super_admin', 'admin', 'moderator', 'support'];

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  support: 'Support',
};

const ROLE_BADGE_STYLES: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin: 'bg-indigo-100 text-indigo-700',
  moderator: 'bg-blue-100 text-blue-700',
  support: 'bg-green-100 text-green-700',
};

const PAGE_SIZE = 10;

export default function RoleManager() {
  const [page, setPage] = useState(1);
  const [pendingChange, setPendingChange] = useState<{ userId: string; userName: string; newRole: AdminRole } | null>(null);
  const [changing, setChanging] = useState(false);

  const filters = { page, limit: PAGE_SIZE };

  const { data, isLoading, isFetching, refetch } = useQuery(
    [...queryKeys.admin.users(filters)] as unknown as readonly (string | number)[],
    () => adminService.getAdmins({ pagination: { page, limit: PAGE_SIZE } }),
    { staleTime: 30_000 },
  );

  const users = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleRoleChange = useCallback((userId: string, userName: string, newRole: AdminRole) => {
    setPendingChange({ userId, userName, newRole });
  }, []);

  const confirmRoleChange = useCallback(async () => {
    if (!pendingChange) return;
    setChanging(true);
    try {
      await adminService.changeRole(pendingChange.userId, pendingChange.newRole);
      await refetch();
    } finally {
      setChanging(false);
      setPendingChange(null);
    }
  }, [pendingChange, refetch]);

  const formatLastActive = useCallback((iso: string | undefined): string => {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, []);

  return (
    <section aria-label="Role Manager" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Role Manager</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage admin roles and permissions hierarchy
          </p>
        </div>
        {isFetching && (
          <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" aria-label="Refreshing" />
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-xs font-medium text-gray-500 mb-3">Role Hierarchy</h3>
        <div className="flex items-center gap-2 flex-wrap" role="list" aria-label="Role hierarchy">
          {ALL_ROLES.map((role, idx) => (
            <div key={role} className="flex items-center gap-2" role="listitem">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${ROLE_BADGE_STYLES[role]}`}>
                {ROLE_LABELS[role]}
              </span>
              <span className="text-[10px] text-gray-400">
                Lv.{getRoleLevel(role)}
              </span>
              {idx < ALL_ROLES.length - 1 && (
                <span className="text-gray-300 text-xs" aria-hidden="true">{'>'}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4 flex-wrap">
          {ALL_ROLES.map((role) => {
            const perms = getRolePermissions(role);
            return (
              <div key={role} className="text-[10px] text-gray-400">
                <span className={`font-medium ${ROLE_BADGE_STYLES[role]?.split(' ')[1] ?? ''}`}>
                  {ROLE_LABELS[role]}
                </span>
                {': '}{perms.length} permissions
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400 mt-2">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Admin users with roles">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Current Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell" scope="col">Permissions</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Last Active</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">No users found</td>
                    </tr>
                  ) : (
                    users.map((user: AdminUser) => {
                      const currentRole = (user.role || 'support') as AdminRole;
                      const permCount = getRolePermissions(currentRole).length;

                      return (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-[#1A237E] flex-shrink-0"
                                aria-hidden="true"
                              >
                                {(user.name || user.email || '?')[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm text-gray-800 truncate max-w-[150px]">
                                  {user.name || 'Unnamed'}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                  {user.email || '—'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE_STYLES[currentRole] || 'bg-gray-100 text-gray-600'}`}>
                              {ROLE_LABELS[currentRole] || currentRole}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-600">{permCount}</span>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden" aria-label={`${permCount} of 12 permissions`}>
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#1A237E] to-[#3949AB]"
                                  style={{ width: `${(permCount / 12) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-xs text-gray-500">
                              {formatLastActive(user.last_sign_in_at)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <label className="sr-only" htmlFor={`role-select-${user.id}`}>
                                Change role for {user.name || user.email}
                              </label>
                              <select
                                id={`role-select-${user.id}`}
                                value={currentRole}
                                onChange={(e) => handleRoleChange(user.id, user.name || user.email || user.id, e.target.value as AdminRole)}
                                className="text-[10px] border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                                aria-label={`Change role for ${user.name || user.email}`}
                              >
                                {ALL_ROLES.map((r) => (
                                  <option key={r} value={r} disabled={r === currentRole}>
                                    {ROLE_LABELS[r]} (Lv.{getRoleLevel(r)})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="border-t border-gray-100 px-4 py-3">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingChange}
        title="Change User Role"
        message={
          pendingChange
            ? `Change ${pendingChange.userName}'s role to ${ROLE_LABELS[pendingChange.newRole]}? This will update their access permissions.`
            : ''
        }
        confirmLabel="Change Role"
        variant="warning"
        onConfirm={confirmRoleChange}
        onCancel={() => setPendingChange(null)}
        loading={changing}
      />
    </section>
  );
}

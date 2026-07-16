/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useMemo } from 'react';
import type { AdminRole, Permission } from '@/lib/services/adminService';
import { getRolePermissions } from '@/lib/services/adminService';

const ROLES: AdminRole[] = ['super_admin', 'admin', 'moderator', 'support'];

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

const PERMISSIONS: Permission[] = [
  'view',
  'create',
  'edit',
  'delete',
  'export',
  'manage_users',
  'manage_complaints',
  'manage_schemes',
  'manage_weather',
  'manage_education',
  'manage_emergency',
  'manage_ai',
];

const PERMISSION_LABELS: Record<Permission, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  export: 'Export',
  manage_users: 'Users',
  manage_complaints: 'Complaints',
  manage_schemes: 'Schemes',
  manage_weather: 'Weather',
  manage_education: 'Education',
  manage_emergency: 'Emergency',
  manage_ai: 'AI',
};

interface MatrixCell {
  granted: boolean;
  roleLabel: string;
  permLabel: string;
}

function buildMatrix(roles: AdminRole[], permissions: Permission[]): MatrixCell[][] {
  return roles.map((role) => {
    const perms = getRolePermissions(role);
    const roleLabel = ROLE_LABELS[role] || role;
    return permissions.map((perm) => ({
      granted: perms.includes(perm),
      roleLabel,
      permLabel: PERMISSION_LABELS[perm],
    }));
  });
}

export default function PermissionMatrix() {
  const matrix = useMemo(() => buildMatrix(ROLES, PERMISSIONS), []);

  return (
    <section aria-label="Permission Matrix" className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Permission Matrix</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Overview of role-based access control permissions
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            role="grid"
            aria-label="Permission Matrix"
          >
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 sticky left-0 bg-gray-50 z-10"
                  scope="col"
                >
                  Role
                </th>
                {PERMISSIONS.map((perm) => (
                  <th
                    key={perm}
                    className="text-center px-3 py-3 text-xs font-medium text-gray-500 min-w-[70px]"
                    scope="col"
                  >
                    {PERMISSION_LABELS[perm]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role, rowIdx) => (
                <tr
                  key={role}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${rowIdx % 2 === 0 ? '' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-3 sticky left-0 bg-inherit z-10">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ROLE_BADGE_STYLES[role]}`}>
                      {ROLE_LABELS[role]}
                    </span>
                  </td>
                  {matrix[rowIdx].map((cell: MatrixCell, colIdx: number) => (
                    <td
                      key={PERMISSIONS[colIdx]}
                      className="text-center px-3 py-3"
                    >
                      {cell.granted ? (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold"
                          role="img"
                          aria-label={`${cell.roleLabel} has ${cell.permLabel}`}
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-300 text-xs"
                          role="img"
                          aria-label={`${cell.roleLabel} lacks ${cell.permLabel}`}
                        >
                          ✗
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold" aria-hidden="true">✓</span>
            <span className="text-[10px] text-gray-500">Granted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-50 text-gray-300 text-[10px]" aria-hidden="true">✗</span>
            <span className="text-[10px] text-gray-500">Denied</span>
          </div>
          <span className="text-[10px] text-gray-400 ml-auto">
            {ROLES.length} roles &middot; {PERMISSIONS.length} permissions
          </span>
        </div>
      </div>
    </section>
  );
}

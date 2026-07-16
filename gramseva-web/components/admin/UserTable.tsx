/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import StatusBadge from './StatusBadge';
import Pagination from './Pagination';

export interface UserRecord {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
  last_sign_in_at?: string;
  created_at?: string;
  complaint_count?: number;
  [key: string]: unknown;
}

interface UserTableProps {
  users: UserRecord[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSuspend?: (id: string) => void;
  onActivate?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export default function UserTable({ users, total, page, pageSize, onPageChange, onSuspend, onActivate, onDelete, isLoading }: UserTableProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400 mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">User</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell" scope="col">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell" scope="col">Last Login</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-400">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-[#1A237E] flex-shrink-0" aria-hidden="true">
                        {(u.name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate max-w-[150px]">{u.name || 'Unnamed'}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{u.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-gray-600">{u.phone || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <StatusBadge status={u.is_active !== false ? 'active' : 'suspended'} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('en-IN') : '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onSuspend && u.is_active !== false && (
                        <button type="button" onClick={() => onSuspend(u.id)} className="text-[10px] text-orange-600 hover:text-orange-700 px-1.5 py-0.5 rounded hover:bg-orange-50 transition-colors" aria-label={`Suspend user: ${u.name || u.email}`}>
                          Suspend
                        </button>
                      )}
                      {onActivate && u.is_active === false && (
                        <button type="button" onClick={() => onActivate(u.id)} className="text-[10px] text-green-600 hover:text-green-700 px-1.5 py-0.5 rounded hover:bg-green-50 transition-colors" aria-label={`Activate user: ${u.name || u.email}`}>
                          Activate
                        </button>
                      )}
                      {onDelete && (
                        <button type="button" onClick={() => onDelete(u.id)} className="text-[10px] text-gray-400 hover:text-red-500 px-1.5 py-0.5 rounded transition-colors" aria-label={`Delete user: ${u.name || u.email}`}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

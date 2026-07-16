/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { adminService } from '@/lib/services/adminService';
import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import ExportButton from '@/components/admin/ExportButton';

const ACTION_TYPES = ['login', 'logout', 'create', 'edit', 'delete', 'export', 'role_change'] as const;
const RESOURCE_TYPES = ['complaints', 'users', 'schemes', 'education', 'emergency'] as const;

const ACTION_STYLES: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700',
  edit: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  login: 'bg-indigo-100 text-indigo-700',
  logout: 'bg-gray-100 text-gray-600',
  export: 'bg-purple-100 text-purple-700',
  role_change: 'bg-amber-100 text-amber-700',
};

const ACTION_LABELS: Record<string, string> = {
  login: 'Login',
  logout: 'Logout',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  export: 'Export',
  role_change: 'Role Change',
};

export default function AuditLogTable() {
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);

  const { data, isLoading, isFetching } = useQuery(
    ['admin', 'auditLogs'] as const,
    () => adminService.getAuditLogs({
      action: actionFilter || undefined,
      resource: resourceFilter || undefined,
      search: search || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      pagination: { page, limit: pageSize },
    }),
    { staleTime: 30_000 },
  );

  const logs = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleExportCSV = useCallback(() => {
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 'IP Address', 'Details'];
    const rows = logs.map((log) => [
      log.created_at,
      log.user_email || log.user_id,
      log.action,
      log.resource,
      log.resource_id || '',
      log.ip_address || '',
      log.details ? JSON.stringify(log.details) : '',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  return (
    <section className="space-y-4" aria-label="Audit Log">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold">Audit Log</h2>
        <p className="text-indigo-100 text-xs mt-1">Track all user and system actions across the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search by email or resource..."
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="audit-action" className="sr-only">Filter by action</label>
            <select
              id="audit-action"
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              aria-label="Filter by action type"
            >
              <option value="">All Actions</option>
              {ACTION_TYPES.map((a) => (
                <option key={a} value={a}>{ACTION_LABELS[a]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="audit-resource" className="sr-only">Filter by resource</label>
            <select
              id="audit-resource"
              value={resourceFilter}
              onChange={(e) => { setResourceFilter(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              aria-label="Filter by resource type"
            >
              <option value="">All Resources</option>
              {RESOURCE_TYPES.map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ExportButton onExportCSV={handleExportCSV} label="Export CSV" disabled={logs.length === 0} />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <label htmlFor="audit-date-from" className="text-[10px] text-gray-400 whitespace-nowrap">From</label>
            <input
              id="audit-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="audit-date-to" className="text-[10px] text-gray-400 whitespace-nowrap">To</label>
            <input
              id="audit-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          {(dateFrom || dateTo || actionFilter || resourceFilter || search) && (
            <button
              type="button"
              onClick={() => { setActionFilter(''); setResourceFilter(''); setSearch(''); setDateFrom(''); setDateTo(''); setPage(1); }}
              className="text-[10px] text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          )}
          {isFetching && !isLoading && (
            <span className="text-[10px] text-gray-400">Updating...</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading audit logs...</p>
            <div className="space-y-2 max-w-lg mx-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3" aria-hidden="true">
              <span className="text-lg">📋</span>
            </div>
            <p className="text-sm font-medium text-gray-600">No audit logs found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or date range</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Audit log entries">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell" scope="col">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Resource</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell" scope="col">Details</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden xl:table-cell" scope="col">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {new Date(log.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <br />
                      <span className="text-[10px] text-gray-400">
                        {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-700 truncate max-w-[160px] block" title={log.user_email || log.user_id}>
                        {log.user_email || log.user_id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ACTION_STYLES[log.action] || 'bg-gray-100 text-gray-500'}`}>
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600 capitalize">{log.resource}</span>
                      {log.resource_id && (
                        <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">{log.resource_id}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {log.details ? (
                        <span className="text-[10px] text-gray-500 truncate max-w-[200px] block" title={JSON.stringify(log.details, null, 2)}>
                          {Object.entries(log.details).map(([k, v]) => `${k}: ${String(v)}`).join(', ')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-[10px] text-gray-500 font-mono">{log.ip_address || '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">{total.toLocaleString()} entries</span>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </section>
  );
}

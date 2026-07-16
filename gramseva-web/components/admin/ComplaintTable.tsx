/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import type { ComplaintStatus } from '@/lib/services/complaintService';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';

export interface ComplaintRecord {
  id: string;
  title?: string;
  category?: string;
  status?: string;
  priority?: string;
  district?: string;
  created_at?: string;
  user_id?: string;
  [key: string]: unknown;
}

interface ComplaintTableProps {
  complaints: ComplaintRecord[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onStatusChange?: (id: string, status: ComplaintStatus) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export default function ComplaintTable({ complaints, total, page, pageSize, onPageChange, onStatusChange, onDelete, isLoading }: ComplaintTableProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400 mt-2">Loading complaints...</p>
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
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell" scope="col">Category</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell" scope="col">District</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell" scope="col">Date</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400">No complaints found</td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800 truncate max-w-[200px]">{c.title || 'Untitled'}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{c.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-gray-600 capitalize">{c.category || 'General'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status || 'pending'} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs capitalize ${c.priority === 'urgent' ? 'text-red-600 font-medium' : c.priority === 'high' ? 'text-orange-600' : 'text-gray-600'}`}>
                      {c.priority || 'low'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-600">{c.district || '—'}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">{c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onStatusChange && c.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(c.id, 'resolved')}
                          className="text-[10px] text-green-600 hover:text-green-700 px-1.5 py-0.5 rounded hover:bg-green-50 transition-colors"
                          aria-label={`Resolve complaint: ${c.title}`}
                        >
                          Resolve
                        </button>
                      )}
                      {onStatusChange && c.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(c.id, 'rejected')}
                          className="text-[10px] text-red-500 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                          aria-label={`Reject complaint: ${c.title}`}
                        >
                          Reject
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(c.id)}
                          className="text-[10px] text-gray-400 hover:text-red-500 px-1.5 py-0.5 rounded transition-colors"
                          aria-label={`Delete complaint: ${c.title}`}
                        >
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

/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { authenticatedClient } from '@/lib/api/authenticatedClient';
import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import ExportButton from '@/components/admin/ExportButton';
import { TABLE_EDUCATION_RESOURCES } from '@/lib/constants/api';

interface EducationResource {
  id: string;
  title?: string;
  category?: string;
  type?: string;
  created_at?: string;
}

export default function AdminEducationPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery(
    ['admin', 'education', page, search] as unknown as readonly (string | number)[],
    async () => {
      const params: Record<string, string | number> = { limit: 20, offset: (page - 1) * 20, order: 'title.asc' };
      if (search) params['or'] = `(title.ilike.%${search}%,category.ilike.%${search}%)`;
      const res = await authenticatedClient.get<EducationResource[]>(`/${TABLE_EDUCATION_RESOURCES}`, { params });
      const items = Array.isArray(res.data) ? res.data : [];
      return { data: items, total: items.length };
    },
    { staleTime: 60_000 },
  );

  const items = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Education Resources</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage educational content and resources</p>
        </div>
        <ExportButton onExportCSV={() => {
          const csv = ['Title,Category,Type'];
          items.forEach((r) => csv.push(`"${(r.title || '').replace(/"/g, '""')}",${r.category || ''},${r.type || ''}`));
          const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = `education-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
          URL.revokeObjectURL(url);
        }} label="Export CSV" />
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search resources..." />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">No education resources found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell" scope="col">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell" scope="col">Date</th>
              </tr></thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><span className="text-sm text-gray-800 truncate max-w-[250px] block">{r.title || 'Untitled'}</span></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-gray-600 capitalize">{r.category || '—'}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-gray-600 capitalize">{r.type || '—'}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {Math.ceil(total / 20) > 1 && (
          <div className="border-t border-gray-100 px-4 py-3">
            <Pagination page={page} totalPages={Math.ceil(total / 20)} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

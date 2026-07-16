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
import StatusBadge from '@/components/admin/StatusBadge';
import ExportButton from '@/components/admin/ExportButton';
import { TABLE_SCHEMES } from '@/lib/constants/api';

interface Scheme {
  id: string;
  name?: string;
  category?: string;
  ministry?: string;
  status?: string;
}

export default function AdminSchemesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery(
    ['admin', 'schemes', page, search] as unknown as readonly (string | number)[],
    async () => {
      const params: Record<string, string | number> = { limit: 20, offset: (page - 1) * 20, order: 'name.asc' };
      if (search) params['or'] = `(name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%)`;
      const res = await authenticatedClient.get<Scheme[]>(`/${TABLE_SCHEMES}`, { params });
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
          <h1 className="text-xl font-bold text-gray-800">Schemes</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage government schemes database</p>
        </div>
        <ExportButton onExportCSV={() => {
          const csv = ['Name,Category,Status'];
          items.forEach((s) => csv.push(`"${(s.name || '').replace(/"/g, '""')}",${s.category || ''},${s.status || 'active'}`));
          const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = `schemes-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
          URL.revokeObjectURL(url);
        }} label="Export CSV" />
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search schemes..." />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">No schemes found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell" scope="col">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Ministry</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell" scope="col">Status</th>
              </tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id || s.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><p className="text-sm text-gray-800 truncate max-w-[250px]">{s.name || 'Untitled'}</p></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-gray-600 capitalize">{s.category || '—'}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-gray-600 truncate max-w-[200px]">{s.ministry || '—'}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><StatusBadge status={s.status || 'active'} /></td>
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

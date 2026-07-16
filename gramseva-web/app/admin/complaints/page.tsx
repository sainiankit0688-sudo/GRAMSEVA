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
import ComplaintTable from '@/components/admin/ComplaintTable';
import SearchBar from '@/components/admin/SearchBar';
import AdvancedFilters from '@/components/admin/AdvancedFilters';
import ExportButton from '@/components/admin/ExportButton';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import type { ComplaintStatus, ComplaintPriority } from '@/lib/services/complaintService';
import type { ComplaintRecord } from '@/components/admin/ComplaintTable';

export default function AdminComplaintsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filters = { page, search, status, priority, category, district, dateFrom, dateTo };

  const { data, isLoading, refetch } = useQuery(
    [...queryKeys.admin.complaints(filters)] as unknown as readonly (string | number)[],
    () => adminService.getComplaints({
      status: status || undefined,
      priority: priority || undefined,
      category: category || undefined,
      district: district || undefined,
      search: search || undefined,
      pagination: { page, limit: 20 },
    }),
    { staleTime: 30_000 },
  );

  const handleStatusChange = useCallback(async (id: string, newStatus: string) => {
    try {
      await adminService.updateComplaintStatus(id, newStatus);
      refetch();
    } catch { /* ignore */ }
  }, [refetch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteComplaint(deleteTarget);
      setDeleteTarget(null);
      refetch();
    } catch { /* ignore */ }
  }, [deleteTarget, refetch]);

  const handleExportCSV = useCallback(() => {
    const items = (data?.data || []) as ComplaintRecord[];
    const csv = ['Title,Status,Priority,Category,District,Date'];
    items.forEach((c) => csv.push(`"${(c.title || '').replace(/"/g, '""')}",${c.status},${c.priority},${c.category},${c.district || ''},${c.created_at || ''}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `complaints-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const resetFilters = useCallback(() => {
    setStatus(''); setPriority(''); setCategory(''); setDistrict(''); setDateFrom(''); setDateTo(''); setPage(1);
  }, []);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Complaints</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage and resolve citizen complaints</p>
        </div>
        <ExportButton onExportCSV={handleExportCSV} label="Export CSV" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search complaints..." />
        </div>
      </div>

      <AdvancedFilters
        status={status as ComplaintStatus | ''} priority={priority as ComplaintPriority | ''} category={category} district={district}
        dateFrom={dateFrom} dateTo={dateTo}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        onPriorityChange={(v) => { setPriority(v); setPage(1); }}
        onCategoryChange={(v) => { setCategory(v); setPage(1); }}
        onDistrictChange={(v) => { setDistrict(v); setPage(1); }}
        onDateFromChange={(v) => { setDateFrom(v); setPage(1); }}
        onDateToChange={(v) => { setDateTo(v); setPage(1); }}
        onReset={resetFilters}
      />

      <ComplaintTable
        complaints={(data?.data || []) as ComplaintRecord[]}
        total={data?.total || 0}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        onStatusChange={handleStatusChange}
        onDelete={(id) => setDeleteTarget(id)}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Complaint"
        message="This action cannot be undone. Are you sure you want to delete this complaint?"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

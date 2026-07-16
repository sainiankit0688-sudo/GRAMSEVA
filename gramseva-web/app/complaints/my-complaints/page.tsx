'use client';

/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import Link from 'next/link';
import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { complaintService } from '@/lib/services/complaintService';
import { queryKeys } from '@/lib/queryKeys';
import { COMPLAINT_STALE_TIME, DEFAULT_PAGE_SIZE } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import { ComplaintCard, AdvancedFilters } from '@/components/complaints';
import type { AdvancedFiltersState } from '@/components/complaints/AdvancedFilters';
import type { Complaint } from '@/lib/services/complaintService';

export default function MyComplaintsPage() {
  const [filters, setFilters] = useState<AdvancedFiltersState>({
    search: '',
    statuses: [],
    categories: [],
    priorities: [],
    district: '',
    state: '',
    dateFrom: '',
    dateTo: '',
    sort: 'created_at.desc',
  });
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [filters.search]);

  const { data: complaints, isLoading, error, refetch } = useQuery(
    queryKeys.complaints.mine(),
    () => complaintService.listMine({ pagination: { page: 1, limit: 500 } }),
    { staleTime: COMPLAINT_STALE_TIME },
  );

  const handleRetry = useCallback(() => { refetch(); }, [refetch]);

  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];
    let result = [...complaints];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((c) =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q) ||
        c.village?.toLowerCase().includes(q) ||
        c.district?.toLowerCase().includes(q),
      );
    }

    if (filters.statuses.length > 0) {
      result = result.filter((c) => filters.statuses.includes(c.status));
    }
    if (filters.categories.length > 0) {
      result = result.filter((c) => filters.categories.includes(c.category));
    }
    if (filters.priorities.length > 0) {
      result = result.filter((c) => c.priority && filters.priorities.includes(c.priority));
    }
    if (filters.district) {
      const q = filters.district.toLowerCase();
      result = result.filter((c) => c.district?.toLowerCase().includes(q));
    }
    if (filters.state) {
      const q = filters.state.toLowerCase();
      result = result.filter((c) => c.state?.toLowerCase().includes(q));
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      result = result.filter((c) => c.created_at && new Date(c.created_at).getTime() >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo).getTime() + 86400000;
      result = result.filter((c) => c.created_at && new Date(c.created_at).getTime() <= to);
    }

    const [sortCol, sortDir] = filters.sort.split('.');
    result.sort((a: Complaint, b: Complaint) => {
      const aVal = a[sortCol as keyof Complaint] || '';
      const bVal = b[sortCol as keyof Complaint] || '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [complaints, debouncedSearch, filters]);

  const totalPages = useMemo(() => Math.ceil(filteredComplaints.length / DEFAULT_PAGE_SIZE), [filteredComplaints]);
  const paginatedComplaints = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return filteredComplaints.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [filteredComplaints, page]);

  const handleFiltersChange = useCallback((newFilters: AdvancedFiltersState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="My Complaints" titleHindi="मेरी शिकायतें" icon="📂" gradient="linear-gradient(135deg, #4E342E, #6D4C41)" />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Complaints', href: '/complaints' },
        { label: 'My Complaints' },
      ]} />

      <div className="px-4 py-5 flex flex-col gap-4">
        <Link href="/complaints/new"
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-700 text-white text-sm font-bold hover:bg-amber-800 transition-colors">
          <span aria-hidden="true">✏️</span> New Complaint / नई शिकायत
        </Link>

        <AdvancedFilters filters={filters} onChange={handleFiltersChange} />

        {!isLoading && !error && (
          <p className="text-xs text-gray-500" aria-live="polite">
            {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''} found
          </p>
        )}

        {isLoading && <LoadingSpinner message="Loading your complaints..." />}

        {error && <ErrorAlert message={error.message || 'Failed to load complaints.'} onRetry={handleRetry} />}

        {!isLoading && !error && filteredComplaints.length === 0 && (
          <EmptyState icon="📭" title="No complaints found" titleHindi="कोई शिकायत नहीं मिली"
            description={debouncedSearch || filters.statuses.length || filters.categories.length ? 'Try adjusting your filters.' : undefined} />
        )}

        {!isLoading && !error && paginatedComplaints.length > 0 && (
          <div className="flex flex-col gap-3" role="list" aria-label="My complaints list">
            {paginatedComplaints.map((complaint) => (
              <div key={complaint.id} role="listitem">
                <ComplaintCard complaint={complaint} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Pagination">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              ← Prev
            </button>
            <span className="text-xs text-gray-500" aria-current="page">Page {page} of {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next →
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

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

import { useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@/hooks/useQuery';
import { complaintService } from '@/lib/services/complaintService';
import { queryKeys } from '@/lib/queryKeys';
import { COMPLAINT_STALE_TIME } from '@/lib/constants/api';
import type { Complaint } from '@/lib/services/complaintService';

const CATEGORY_ICONS: Record<string, string> = {
  road: '🛣️',
  water: '💧',
  electricity: '⚡',
  sanitation: '🚽',
  drainage: '🌊',
  streetlight: '💡',
  garbage: '🗑️',
  other: '📋',
};

interface RelatedComplaintsProps {
  complaint: Complaint;
}

export default function RelatedComplaints({ complaint }: RelatedComplaintsProps) {
  const { data: nearbyData } = useQuery(
    queryKeys.complaints.nearby(complaint.latitude || 0, complaint.longitude || 0),
    () => complaint.latitude && complaint.longitude
      ? complaintService.searchNearby(complaint.latitude, complaint.longitude, 10)
      : Promise.resolve([]),
    {
      staleTime: COMPLAINT_STALE_TIME,
      enabled: !!complaint.latitude && !!complaint.longitude,
    },
  );

  const { data: categoryData } = useQuery(
    queryKeys.complaints.relatedCategory(complaint.category, complaint.id),
    () => complaintService.searchByCategory(complaint.category, complaint.id),
    { staleTime: COMPLAINT_STALE_TIME },
  );

  const { data: villageData } = useQuery(
    queryKeys.complaints.relatedVillage(complaint.village || '', complaint.id),
    () => complaint.village
      ? complaintService.searchByVillage(complaint.village, complaint.id)
      : Promise.resolve([]),
    {
      staleTime: COMPLAINT_STALE_TIME,
      enabled: !!complaint.village,
    },
  );

  const relatedComplaints = useMemo(() => {
    const all = new Map<string, Complaint>();
    const sources = [nearbyData, categoryData, villageData].filter(Boolean);
    for (const list of sources) {
      if (!list) continue;
      for (const c of list) {
        if (c.id !== complaint.id && !all.has(c.id)) {
          all.set(c.id, c);
        }
      }
    }
    return Array.from(all.values()).slice(0, 6);
  }, [nearbyData, categoryData, villageData, complaint.id]);

  if (relatedComplaints.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Related Complaints / संबंधित शिकायतें</h3>
      <div className="flex flex-col gap-2" role="list">
        {relatedComplaints.map((c) => (
          <Link
            key={c.id}
            href={`/complaints/${c.id}`}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            role="listitem"
          >
            <span className="text-lg" aria-hidden="true">{CATEGORY_ICONS[c.category] || '📋'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{c.title}</p>
              <p className="text-xs text-gray-400">{c.category} · {c.village || c.district || ''}</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {c.status === 'resolved' ? '✅' : c.status === 'pending' ? '⏳' : '🔄'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

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
import { useMemo } from 'react';
import type { Complaint } from '@/lib/services/complaintService';

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  road: { icon: '🛣️', color: '#795548' },
  water: { icon: '💧', color: '#1565C0' },
  electricity: { icon: '⚡', color: '#F57F17' },
  sanitation: { icon: '🚽', color: '#2E7D32' },
  drainage: { icon: '🌊', color: '#00838F' },
  streetlight: { icon: '💡', color: '#FF8F00' },
  garbage: { icon: '🗑️', color: '#4E342E' },
  other: { icon: '📋', color: '#6A1B9A' },
};

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: '#FFF3E0', text: '#E65100' },
  in_progress: { label: 'In Progress', bg: '#E3F2FD', text: '#0D47A1' },
  resolved: { label: 'Resolved', bg: '#E8F5E9', text: '#1B5E20' },
  rejected: { label: 'Rejected', bg: '#FFEBEE', text: '#B71C1C' },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: '#4CAF50' },
  medium: { label: 'Medium', color: '#FF9800' },
  high: { label: 'High', color: '#F44336' },
  urgent: { label: 'Urgent', color: '#B71C1C' },
};

interface ComplaintCardProps {
  complaint: Complaint;
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const cat = CATEGORY_META[complaint.category] || CATEGORY_META.other;
  const status = STATUS_META[complaint.status] || STATUS_META.pending;
  const priority = complaint.priority ? PRIORITY_META[complaint.priority] : null;

  const photoCount = useMemo(() => {
    if (complaint.photo_urls && Array.isArray(complaint.photo_urls)) return complaint.photo_urls.length;
    return complaint.photo_url ? 1 : 0;
  }, [complaint.photo_url, complaint.photo_urls]);

  const formattedDate = useMemo(() => {
    if (!complaint.created_at) return '';
    try {
      return new Date(complaint.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch {
      return complaint.created_at;
    }
  }, [complaint.created_at]);

  return (
    <Link
      href={`/complaints/${complaint.id}`}
      className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      aria-label={`Complaint: ${complaint.title}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: cat.color + '15' }} aria-hidden="true">
            {cat.icon}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm truncate">{complaint.title}</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 capitalize">{complaint.category}</span>
              {photoCount > 0 && (
                <span className="text-xs text-gray-300">· 📷{photoCount > 1 ? ` ${photoCount}` : ''}</span>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: status.bg, color: status.text }} role="status">
          {status.label}
        </span>
      </div>

      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{complaint.description}</p>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        {complaint.village && (
          <span className="flex items-center gap-1"><span aria-hidden="true">📍</span>{complaint.village}</span>
        )}
        {complaint.district && <span>{complaint.district}</span>}
        {priority && priority.label !== 'Medium' && (
          <span className="font-medium px-1.5 py-0.5 rounded" style={{ color: priority.color, backgroundColor: priority.color + '15' }}>
            {priority.label}
          </span>
        )}
        <span className="ml-auto">{formattedDate}</span>
      </div>
    </Link>
  );
}

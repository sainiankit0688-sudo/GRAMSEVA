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
import type { ComplaintUpdate } from '@/lib/services/complaintService';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: '#FFF3E0', text: '#E65100', dot: '#FF9800' },
  in_progress: { bg: '#E3F2FD', text: '#0D47A1', dot: '#2196F3' },
  resolved: { bg: '#E8F5E9', text: '#1B5E20', dot: '#4CAF50' },
  rejected: { bg: '#FFEBEE', text: '#B71C1C', dot: '#F44336' },
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending / प्रतीक्षा',
  in_progress: 'In Progress / प्रगति में',
  resolved: 'Resolved / समाधान',
  rejected: 'Rejected / अस्वीकृत',
};

interface ComplaintTimelineProps {
  updates: ComplaintUpdate[];
  currentStatus: string;
  createdAt?: string;
}

export default function ComplaintTimeline({ updates, currentStatus, createdAt }: ComplaintTimelineProps) {
  const sortedUpdates = useMemo(() => {
    return [...updates].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [updates]);

  const currentColor = STATUS_COLORS[currentStatus] || STATUS_COLORS.pending;

  function formatTime(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="relative" role="list" aria-label="Complaint timeline">
      {/* Current Status */}
      <div className="flex items-start gap-3 mb-4" role="listitem">
        <div className="flex flex-col items-center">
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentColor.dot }}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 -mt-0.5">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: currentColor.bg, color: currentColor.text }}
            role="status"
            aria-label={`Current status: ${STATUS_LABELS[currentStatus] || currentStatus}`}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentColor.dot }} />
            {STATUS_LABELS[currentStatus] || currentStatus}
          </div>
          <p className="text-xs text-gray-400 mt-1">Current Status / वर्तमान स्थिति</p>
        </div>
      </div>

      {/* Timeline Entries */}
      {sortedUpdates.length === 0 && (
        <div className="ml-2 border-l-2 border-gray-100 pl-6 pb-2">
          <p className="text-xs text-gray-400">
            Submitted on {createdAt ? formatTime(createdAt) : 'N/A'}
          </p>
          <p className="text-xs text-gray-300">No status updates yet</p>
        </div>
      )}

      {sortedUpdates.map((update) => {
        const color = STATUS_COLORS[update.new_status] || STATUS_COLORS.pending;
        return (
          <div key={update.id} className="flex items-start gap-3 mb-4" role="listitem">
            <div className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color.dot }}
                aria-hidden="true"
              />
              <div className="w-0.5 flex-1 bg-gray-100 min-h-[20px]" />
            </div>
            <div className="flex-1 -mt-0.5">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  {update.previous_status} → {update.new_status}
                </span>
              </div>
              {update.admin_remarks && (
                <p className="text-xs text-gray-600 mt-1">{update.admin_remarks}</p>
              )}
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span>{update.updated_by || 'Admin'}</span>
                <span>•</span>
                <time dateTime={update.created_at}>{formatTime(update.created_at)}</time>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

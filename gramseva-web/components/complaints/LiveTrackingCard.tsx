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
import type { Complaint, ComplaintUpdate } from '@/lib/services/complaintService';

const STATUS_STEPS: { key: string; label: string; labelHindi: string; icon: string }[] = [
  { key: 'pending', label: 'Submitted', labelHindi: 'दर्ज', icon: '📝' },
  { key: 'in_progress', label: 'In Progress', labelHindi: 'प्रगति में', icon: '🔧' },
  { key: 'resolved', label: 'Resolved', labelHindi: 'समाधान', icon: '✅' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: '#FFF3E0', text: '#E65100', dot: '#FF9800' },
  in_progress: { bg: '#E3F2FD', text: '#0D47A1', dot: '#2196F3' },
  resolved: { bg: '#E8F5E9', text: '#1B5E20', dot: '#4CAF50' },
  rejected: { bg: '#FFEBEE', text: '#B71C1C', dot: '#F44336' },
};

interface LiveTrackingCardProps {
  complaint: Complaint;
  updates: ComplaintUpdate[];
}

function getProgressPercent(status: string, updates: ComplaintUpdate[]): number {
  if (status === 'resolved') return 100;
  if (status === 'rejected') return 0;
  if (status === 'in_progress') {
    const updateCount = updates.filter((u) => u.new_status === 'in_progress').length;
    return Math.min(75, 40 + updateCount * 10);
  }
  return 15;
}

function getEstimatedTime(status: string, createdAt?: string): string | null {
  if (status === 'resolved' || status === 'rejected' || !createdAt) return null;
  const created = new Date(createdAt);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  if (status === 'pending' && daysSince > 7) return 'Delayed / विलंबित';
  if (status === 'pending') return `${7 - daysSince} day(s) est.`;
  if (status === 'in_progress' && daysSince > 14) return 'Extended / विस्तारित';
  if (status === 'in_progress') return `${14 - daysSince} day(s) est.`;
  return null;
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function LiveTrackingCard({ complaint, updates }: LiveTrackingCardProps) {
  const progress = useMemo(
    () => getProgressPercent(complaint.status, updates),
    [complaint.status, updates],
  );

  const estimated = useMemo(
    () => getEstimatedTime(complaint.status, complaint.created_at),
    [complaint.status, complaint.created_at],
  );

  const color = STATUS_COLORS[complaint.status] || STATUS_COLORS.pending;
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === complaint.status);
  const isRejected = complaint.status === 'rejected';
  const lastUpdate = updates[0];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Live Tracking / ट्रैकिंग</h3>
        {estimated && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
            {estimated}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Complaint progress: ${progress}%`}>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              backgroundColor: isRejected ? color.dot : progress === 100 ? color.dot : '#FF9800',
            }}
          />
        </div>
      </div>

      {/* Status Steps */}
      <div className="flex items-center justify-between mb-4" role="list" aria-label="Status steps">
        {STATUS_STEPS.map((step, i) => {
          const isActive = step.key === complaint.status;
          const isComplete = currentStepIndex > i || complaint.status === 'resolved';
          const stepColor = isComplete || isActive ? color.dot : '#D1D5DB';

          return (
            <div key={step.key} className="flex flex-col items-center flex-1" role="listitem">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 transition-colors"
                style={{ backgroundColor: stepColor + '20', color: stepColor }}
                aria-label={`${step.label}: ${isComplete ? 'complete' : isActive ? 'current' : 'pending'}`}
              >
                {isComplete && !isActive ? '✓' : step.icon}
              </div>
              <span className={`text-xs font-medium text-center ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.label}
              </span>
              <span className="text-xs text-gray-300">{step.labelHindi}</span>
            </div>
          );
        })}
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
          <span className="text-sm mt-0.5" aria-hidden="true">💬</span>
          <div>
            <p className="text-xs text-gray-600">
              {lastUpdate.admin_remarks || `Status changed to ${lastUpdate.new_status}`}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
              <span>{lastUpdate.updated_by || 'Admin'}</span>
              <span>·</span>
              <time dateTime={lastUpdate.created_at}>{formatTime(lastUpdate.created_at)}</time>
            </div>
          </div>
        </div>
      )}

      {!lastUpdate && (
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400">
            No officer updates yet / अभी तक कोई अपडेट नहीं
          </p>
        </div>
      )}
    </div>
  );
}

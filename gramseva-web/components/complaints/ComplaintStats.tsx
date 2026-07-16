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
import type { Complaint } from '@/lib/services/complaintService';

interface ComplaintStatsProps {
  complaints: Complaint[];
}

export default function ComplaintStats({ complaints }: ComplaintStatsProps) {
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;

    const resolvedWithDates = complaints.filter(
      (c) => c.status === 'resolved' && c.created_at && c.updated_at,
    );
    let avgDays: string | null = null;
    if (resolvedWithDates.length > 0) {
      const totalMs = resolvedWithDates.reduce((sum, c) => {
        return sum + (new Date(c.updated_at!).getTime() - new Date(c.created_at!).getTime());
      }, 0);
      const days = totalMs / (resolvedWithDates.length * 1000 * 60 * 60 * 24);
      avgDays = days < 1 ? '<1 day' : `${Math.round(days)} days`;
    }

    return [
      { label: 'Total', labelHindi: 'कुल', count: total, icon: '📋', color: '#5D4037', bgColor: '#EFEBE9' },
      { label: 'Pending', labelHindi: 'प्रतीक्षा', count: pending, icon: '⏳', color: '#E65100', bgColor: '#FFF3E0' },
      { label: 'In Progress', labelHindi: 'प्रगति', count: inProgress, icon: '🔄', color: '#0D47A1', bgColor: '#E3F2FD' },
      { label: 'Resolved', labelHindi: 'समाधान', count: resolved, icon: '✅', color: '#1B5E20', bgColor: '#E8F5E9' },
      { label: 'Avg Time', labelHindi: 'औसत समय', count: avgDays || 'N/A', icon: '⏱️', color: '#7B1FA2', bgColor: '#F3E5F5', isText: true },
    ];
  }, [complaints]);

  return (
    <div className="grid grid-cols-5 gap-2" role="group" aria-label="Complaint statistics">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-1 py-3 rounded-xl border border-gray-100"
          style={{ backgroundColor: stat.bgColor }} role="status" aria-label={`${stat.label}: ${stat.count}`}>
          <span className="text-lg" aria-hidden="true">{stat.icon}</span>
          {'isText' in stat && stat.isText ? (
            <span className="text-xs font-bold" style={{ color: stat.color }}>{stat.count}</span>
          ) : (
            <span className="text-lg font-bold" style={{ color: stat.color }}>{stat.count}</span>
          )}
          <span className="text-xs font-medium text-center leading-tight" style={{ color: stat.color }}>{stat.label}</span>
          <span className="text-xs text-gray-400 text-center leading-tight">{stat.labelHindi}</span>
        </div>
      ))}
    </div>
  );
}

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

interface ComplaintAnalyticsProps {
  complaints: Complaint[];
}

function formatAvgDays(days: number | null): string {
  if (days === null) return 'N/A';
  if (days < 1) return '< 1 day';
  if (days === 1) return '1 day';
  return `${Math.round(days)} days`;
}

function getMonthlyData(complaints: Complaint[]): { month: string; count: number }[] {
  const map = new Map<string, number>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, 0);
  }
  for (const c of complaints) {
    if (!c.created_at) continue;
    const d = new Date(c.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (map.has(key)) {
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  return Array.from(map.entries()).map(([month, count]) => ({ month, count }));
}

function getAvgResolutionDays(complaints: Complaint[]): number | null {
  const resolved = complaints.filter((c) => c.status === 'resolved' && c.created_at && c.updated_at);
  if (resolved.length === 0) return null;
  const totalDays = resolved.reduce((sum, c) => {
    const created = new Date(c.created_at!).getTime();
    const updated = new Date(c.updated_at!).getTime();
    return sum + (updated - created) / (1000 * 60 * 60 * 24);
  }, 0);
  return totalDays / resolved.length;
}

export default function ComplaintAnalytics({ complaints }: ComplaintAnalyticsProps) {
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    const rejected = complaints.filter((c) => c.status === 'rejected').length;
    const avgDays = getAvgResolutionDays(complaints);
    const monthly = getMonthlyData(complaints);
    const maxMonthly = Math.max(...monthly.map((m) => m.count), 1);
    return { total, pending, inProgress, resolved, rejected, avgDays, monthly, maxMonthly };
  }, [complaints]);

  if (complaints.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Analytics / विश्लेषण</h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total', count: stats.total, color: '#5D4037', bg: '#EFEBE9' },
          { label: 'Pending', count: stats.pending, color: '#E65100', bg: '#FFF3E0' },
          { label: 'Resolved', count: stats.resolved, color: '#1B5E20', bg: '#E8F5E9' },
          { label: 'Rejected', count: stats.rejected, color: '#B71C1C', bg: '#FFEBEE' },
        ].map((s) => (
          <div key={s.label} className="text-center py-2 rounded-xl" style={{ backgroundColor: s.bg }}>
            <span className="text-lg font-bold" style={{ color: s.color }}>{s.count}</span>
            <p className="text-xs" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Avg Resolution */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">Avg Resolution Time</span>
        <span className="text-sm font-bold text-gray-700">{formatAvgDays(stats.avgDays)}</span>
      </div>

      {/* Monthly Chart (CSS Bar) */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Monthly Complaints (last 6 months)</p>
        <div className="flex items-end gap-1.5 h-24" role="img" aria-label="Monthly complaints bar chart">
          {stats.monthly.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500 font-medium">{m.count}</span>
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${Math.max(4, (m.count / stats.maxMonthly) * 80)}px`,
                  backgroundColor: m.count > 0 ? '#FF9800' : '#E0E0E0',
                }}
              />
              <span className="text-xs text-gray-400">
                {m.month.split('-')[1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

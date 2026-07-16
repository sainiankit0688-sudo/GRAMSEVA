/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

import type { ComplaintAnalytics } from '@/lib/services/analyticsService';

interface DashboardChartsProps {
  complaints: Pick<ComplaintAnalytics, 'byStatus' | 'byCategory'>;
}

export default function DashboardCharts({ complaints }: DashboardChartsProps) {
  const maxStatus = Math.max(...complaints.byStatus.map((s) => s.count), 1);

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-400',
    in_progress: 'bg-indigo-400',
    resolved: 'bg-emerald-400',
    rejected: 'bg-red-400',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Complaint Status</h3>
        {complaints.byStatus.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No data yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {complaints.byStatus.map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-20 truncate">{statusLabels[item.status] || item.status}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${statusColors[item.status] || 'bg-gray-400'}`}
                    style={{ width: `${(item.count / maxStatus) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={item.count}
                    aria-valuemin={0}
                    aria-valuemax={maxStatus}
                    aria-label={`${item.status}: ${item.count}`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">By Category</h3>
        {complaints.byCategory.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No data yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {(() => {
              const maxCat = Math.max(...complaints.byCategory.map((c) => c.count), 1);
              return complaints.byCategory.slice(0, 6).map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20 truncate capitalize">{item.category}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-400 transition-all"
                      style={{ width: `${(item.count / maxCat) * 100}%` }}
                      role="progressbar"
                      aria-valuenow={item.count}
                      aria-valuemin={0}
                      aria-valuemax={maxCat}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.count}</span>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

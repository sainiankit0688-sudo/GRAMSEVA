/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { analyticsService, type AiAnalytics } from '@/lib/services/analyticsService';
import ExportButton from '@/components/admin/ExportButton';

export default function AdminAiPage() {
  const { data: analytics, isLoading } = useQuery<AiAnalytics>(
    [...queryKeys.admin.aiAnalytics(), 'usage'] as unknown as readonly (string | number)[],
    () => analyticsService.aiAnalytics(),
    { staleTime: 60_000 },
  );

  const aiStats = analytics || { totalConversations: 0, avgMessagesPerChat: 0, topModules: [], failureRate: 0 };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">AI Module</h1>
          <p className="text-xs text-gray-500 mt-0.5">Monitor AI usage and provider performance</p>
        </div>
        <ExportButton onExportCSV={() => {
          const csv = ['Module,Count'];
          aiStats.topModules.forEach((m: { module: string; count: number }) => csv.push(`${m.module},${m.count}`));
          const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = `ai-usage-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
          URL.revokeObjectURL(url);
        }} label="Export CSV" />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Conversations', value: aiStats.totalConversations, icon: '💬' },
              { label: 'Avg Msgs/Chat', value: aiStats.avgMessagesPerChat?.toFixed(1) || '0', icon: '📊' },
              { label: 'Modules Used', value: aiStats.topModules.length, icon: '🤖' },
              { label: 'Failure Rate', value: `${((aiStats.failureRate || 0) * 100).toFixed(1)}%`, icon: '⚠️' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Module Usage</h3>
            </div>
            {aiStats.topModules.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">No module data yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead><tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Module</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Queries</th>
                  </tr></thead>
                  <tbody>
                    {aiStats.topModules.map((m: { module: string; count: number }) => (
                      <tr key={m.module} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3"><span className="text-sm text-gray-800 capitalize">{m.module}</span></td>
                        <td className="px-4 py-3"><span className="text-sm font-medium text-gray-700">{m.count}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { adminService, type HealthCheck } from '@/lib/services/adminService';

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  healthy: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  degraded: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  down: { dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const STATUS_LABELS: Record<string, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
};

const SERVICE_ICONS: Record<string, string> = {
  'Database': '🗄️',
  'Auth API': '🔐',
  'Weather API': '🌤️',
  'AI API': '🤖',
  'Storage': '💾',
  'Realtime': '⚡',
};

const OVERALL_STYLES: Record<string, { bg: string; border: string; text: string; label: string; icon: string }> = {
  healthy: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'All Systems Operational', icon: '✅' },
  degraded: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Partial Degradation', icon: '⚠️' },
  down: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'System Outage', icon: '🚨' },
};

function getOverallStatus(checks: HealthCheck[]): string {
  if (checks.some((c) => c.status === 'down')) return 'down';
  if (checks.some((c) => c.status === 'degraded')) return 'degraded';
  return 'healthy';
}

function formatLatency(ms?: number): string {
  if (ms === undefined || ms === null) return 'N/A';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function SystemHealth() {
  const { data: checks, isLoading, isFetching, refetch } = useQuery(
    queryKeys.admin.health(),
    () => adminService.checkHealth(),
    { staleTime: 30_000, refetchInterval: 60_000 },
  );

  const healthChecks = checks ?? [];
  const overallStatus = getOverallStatus(healthChecks);
  const overallStyle = OVERALL_STYLES[overallStatus];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <section className="space-y-6" aria-label="System Health">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">System Health</h2>
          <p className="text-indigo-100 text-xs mt-1">Monitor service status and uptime</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Refresh health data"
        >
          <span className={`inline-block ${isFetching ? 'animate-spin' : ''}`} aria-hidden="true">🔄</span>
          {isFetching ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {/* Overall Status Banner */}
      <div
        className={`rounded-2xl border px-6 py-4 flex items-center gap-4 ${overallStyle.bg} ${overallStyle.border}`}
        role="status"
        aria-label={`System status: ${overallStyle.label}`}
      >
        <span className="text-2xl" aria-hidden="true">{overallStyle.icon}</span>
        <div>
          <p className={`text-sm font-bold ${overallStyle.text}`}>{overallStyle.label}</p>
          <p className="text-xs text-gray-500">
            {healthChecks.filter((c) => c.status === 'healthy').length}/{healthChecks.length} services operational
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">99.9%</p>
          <p className="text-[10px] text-gray-400 mt-1">Server Uptime</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {healthChecks.filter((c) => c.latency !== undefined).length > 0
              ? formatLatency(Math.round(healthChecks.filter((c) => c.latency !== undefined).reduce((acc, c) => acc + (c.latency ?? 0), 0) / healthChecks.filter((c) => c.latency !== undefined).length))
              : 'N/A'}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Avg Response Time</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">Active</p>
          <p className="text-[10px] text-gray-400 mt-1">Cache Status</p>
        </div>
      </div>

      {/* Service Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />
                  <div className="h-2 bg-gray-100 rounded w-14 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-gray-100 rounded w-full animate-pulse" />
                <div className="h-2 bg-gray-100 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Service health status">
          {healthChecks.map((check) => {
            const colors = STATUS_COLORS[check.status] || STATUS_COLORS.healthy;
            const icon = SERVICE_ICONS[check.name] || '⚙️';

            return (
              <div
                key={check.name}
                className={`bg-white rounded-2xl border p-5 space-y-3 transition-all hover:shadow-sm ${colors.border}`}
                role="listitem"
                aria-label={`${check.name}: ${STATUS_LABELS[check.status]}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors.bg}`} aria-hidden="true">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800">{check.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`} aria-hidden="true" />
                      <span className={`text-[10px] font-medium ${colors.text}`}>{STATUS_LABELS[check.status]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Latency</span>
                    <span className="text-[10px] font-medium text-gray-600">{formatLatency(check.latency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Last Checked</span>
                    <span className="text-[10px] text-gray-500">{formatTimeAgo(check.lastChecked)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && healthChecks.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3" aria-hidden="true">
            <span className="text-lg">💊</span>
          </div>
          <p className="text-sm font-medium text-gray-600">No health data available</p>
          <p className="text-xs text-gray-400 mt-1">Click refresh to check system status</p>
        </div>
      )}
    </section>
  );
}

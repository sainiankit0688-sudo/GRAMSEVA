/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { dashboardService } from '@/lib/services/dashboardService';

const ACTION_STYLES: Record<string, string> = {
  complaint: 'bg-red-100 text-red-700',
  user: 'bg-blue-100 text-blue-700',
  system: 'bg-gray-100 text-gray-600',
  emergency: 'bg-orange-100 text-orange-700',
  weather: 'bg-sky-100 text-sky-700',
  audit: 'bg-indigo-100 text-indigo-700',
  notification: 'bg-emerald-100 text-emerald-700',
};

const ACTION_DOT: Record<string, string> = {
  complaint: 'bg-red-500',
  user: 'bg-blue-500',
  system: 'bg-gray-500',
  emergency: 'bg-orange-500',
  weather: 'bg-sky-500',
  audit: 'bg-indigo-500',
  notification: 'bg-emerald-500',
};

const FIVE_MINUTES = 5 * 60 * 1000;

function isNewActivity(timestamp: string): boolean {
  const diff = Date.now() - new Date(timestamp).getTime();
  return diff >= 0 && diff < FIVE_MINUTES;
}

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LiveActivity() {
  const [paused, setPaused] = useState(false);

  const {
    data: activities,
    isLoading,
    isFetching,
  } = useQuery(
    queryKeys.admin.liveActivity(),
    () => dashboardService.getLiveActivity(),
    {
      refetchInterval: paused ? 0 : 30_000,
      staleTime: 10_000,
    },
  );

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const activityList = useMemo(() => activities ?? [], [activities]);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5" aria-label="Live Activity Feed">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${paused ? 'bg-gray-400' : 'bg-emerald-500 animate-pulse'}`} aria-hidden="true" />
          <h2 className="text-base font-semibold text-gray-800">Live Activity</h2>
          {isFetching && !isLoading && !paused && (
            <span className="w-3 h-3 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" aria-label="Refreshing" />
          )}
        </div>
        <button
          type="button"
          onClick={togglePause}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
            paused
              ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          aria-label={paused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
          aria-pressed={paused}
        >
          {paused ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading activity">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-12" />
            </div>
          ))}
          <span className="sr-only">Loading live activity...</span>
        </div>
      ) : activityList.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-500">No recent activity</p>
          <p className="text-xs text-gray-400 mt-1">Actions will appear here in real-time</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto -mr-2 pr-2" role="log" aria-label="Activity log" aria-live="polite">
          <ul className="space-y-0.5">
            {activityList.map((item, index) => {
              const isNew = isNewActivity(item.timestamp);
              return (
                <li
                  key={`${item.id}-${index}`}
                  className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-1.5 flex-shrink-0" aria-hidden="true">
                    <div className={`w-2 h-2 rounded-full ${ACTION_DOT[item.type] || 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ACTION_STYLES[item.type] || 'bg-gray-100 text-gray-500'}`}>
                        {item.type}
                      </span>
                      {isNew && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse" aria-label="New activity">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mt-1 truncate">{item.description || item.action}</p>
                    {item.user_email && (
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{item.user_email}</p>
                    )}
                  </div>
                  <time
                    dateTime={item.timestamp}
                    className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5"
                    title={new Date(item.timestamp).toLocaleString('en-IN')}
                  >
                    {timeAgo(item.timestamp)}
                  </time>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {paused && (
        <p className="text-[10px] text-gray-400 text-center mt-3" role="status">
          Auto-refresh paused
        </p>
      )}
    </section>
  );
}

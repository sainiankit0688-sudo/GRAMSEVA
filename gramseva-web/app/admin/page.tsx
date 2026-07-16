/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { dashboardService, type DashboardStats, type ActivityItem, type DashboardAnalytics } from '@/lib/services/dashboardService';
import DashboardCards from '@/components/admin/DashboardCards';
import DashboardCharts from '@/components/admin/DashboardCharts';
import ActivityTimeline from '@/components/admin/ActivityTimeline';
import QuickActions from '@/components/admin/QuickActions';
import GlobalSearch from '@/components/admin/GlobalSearch';

export default function AdminDashboardPage() {
  const router = useRouter();

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>(
    queryKeys.admin.dashboard(),
    () => dashboardService.getDashboard(),
    { staleTime: 300_000 },
  );

  const { data: activity, isLoading: activityLoading } = useQuery<ActivityItem[]>(
    queryKeys.admin.activity(),
    () => dashboardService.getRecentActivity(),
    { staleTime: 60_000 },
  );

  const { data: analytics } = useQuery<DashboardAnalytics>(
    [...queryKeys.admin.analytics(), 'overview'] as unknown as readonly (string | number)[],
    () => dashboardService.getAnalytics(),
    { staleTime: 300_000 },
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-xs text-gray-500 mt-0.5">Overview of all modules and activity</p>
      </div>

      <GlobalSearch />

      {statsError && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl">
          Failed to load dashboard. Please try refreshing.
        </div>
      )}

      <DashboardCards stats={stats || {
        totalUsers: 0, activeUsers: 0, totalComplaints: 0, pendingComplaints: 0,
        inProgressComplaints: 0, resolvedComplaints: 0, rejectedComplaints: 0,
        aiChats: 0, emergencyRequests: 0, weatherRequests: 0,
      }} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardCharts complaints={analytics?.complaints || { byStatus: [], byCategory: [], byMonth: [] }} />
        </div>
        <div>
          <ActivityTimeline activities={activity || []} isLoading={activityLoading} />
        </div>
      </div>

      <QuickActions onNavigate={(href) => router.push(href)} />
    </div>
  );
}

/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

import type { DashboardStats } from '@/lib/services/dashboardService';

interface DashboardCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

interface CardDef {
  label: string;
  value: number;
  icon: string;
  color: string;
}

const EMPTY_STATS: DashboardStats = {
  totalUsers: 0, activeUsers: 0, totalComplaints: 0, pendingComplaints: 0,
  inProgressComplaints: 0, resolvedComplaints: 0, rejectedComplaints: 0,
  aiChats: 0, emergencyRequests: 0, weatherRequests: 0,
};

export default function DashboardCards({ stats, isLoading }: DashboardCardsProps) {
  const s = stats || EMPTY_STATS;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" role="list" aria-label="Dashboard statistics">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-3 animate-pulse">
            <div className="h-2 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  const cards: CardDef[] = [
    { label: 'Total Users', value: s.totalUsers, icon: '👥', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { label: 'Active Users', value: s.activeUsers, icon: '✅', color: 'bg-green-50 text-green-700 border-green-100' },
    { label: 'Total Complaints', value: s.totalComplaints, icon: '📝', color: 'bg-purple-50 text-purple-700 border-purple-100' },
    { label: 'Pending', value: s.pendingComplaints, icon: '⏳', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { label: 'In Progress', value: s.inProgressComplaints, icon: '🔄', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: 'Resolved', value: s.resolvedComplaints, icon: '✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Rejected', value: s.rejectedComplaints, icon: '❌', color: 'bg-red-50 text-red-700 border-red-100' },
    { label: 'AI Chats', value: s.aiChats, icon: '🤖', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: 'Emergency', value: s.emergencyRequests, icon: '🚨', color: 'bg-red-50 text-red-700 border-red-100' },
    { label: 'Weather', value: s.weatherRequests, icon: '🌤️', color: 'bg-sky-50 text-sky-700 border-sky-100' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" role="list" aria-label="Dashboard statistics">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-3 ${card.color}`}
          role="listitem"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base" aria-hidden="true">{card.icon}</span>
            <span className="text-[10px] font-medium opacity-70">{card.label}</span>
          </div>
          <p className="text-xl font-bold">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

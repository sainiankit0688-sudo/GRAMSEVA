/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

import { authenticatedClient } from '@/lib/api/authenticatedClient';
import {
  TABLE_COMPLAINTS,
  TABLE_AUDIT_LOGS,
} from '@/lib/constants/api';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  rejectedComplaints: number;
  aiChats: number;
  emergencyRequests: number;
  weatherRequests: number;
}

export interface ActivityItem {
  id: string;
  type: 'complaint' | 'user' | 'system' | 'emergency' | 'weather' | 'audit' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  user_name?: string;
  user_email?: string;
  status?: string;
  [key: string]: unknown;
}

export type RecentActivity = ActivityItem;

export interface DailyActivity {
  date: string;
  complaints: number;
  users: number;
  aiChats: number;
}

export interface DashboardAnalytics {
  complaints: {
    byStatus: { status: string; count: number }[];
    byCategory: { category: string; count: number }[];
    byMonth: { month: string; count: number }[];
  };
}

async function getDashboard(): Promise<DashboardStats> {
  try {
    const { data: allComplaints } = await authenticatedClient.get<Record<string, unknown>[]>(
      `/${TABLE_COMPLAINTS}`,
      { params: { select: 'status', limit: 1000 } },
    );

    const complaintList = Array.isArray(allComplaints) ? allComplaints : [];
    const pending = complaintList.filter((c) => c.status === 'pending').length;
    const inProgress = complaintList.filter((c) => c.status === 'in_progress').length;
    const resolved = complaintList.filter((c) => c.status === 'resolved').length;
    const rejected = complaintList.filter((c) => c.status === 'rejected').length;

    return {
      totalUsers: 0,
      activeUsers: 0,
      totalComplaints: complaintList.length,
      pendingComplaints: pending,
      inProgressComplaints: inProgress,
      resolvedComplaints: resolved,
      rejectedComplaints: rejected,
      aiChats: 0,
      emergencyRequests: 0,
      weatherRequests: 0,
    };
  } catch {
    return {
      totalUsers: 0, activeUsers: 0, totalComplaints: 0, pendingComplaints: 0,
      inProgressComplaints: 0, resolvedComplaints: 0, rejectedComplaints: 0,
      aiChats: 0, emergencyRequests: 0, weatherRequests: 0,
    };
  }
}

async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  try {
    const { data } = await authenticatedClient.get<Record<string, unknown>[]>(
      `/${TABLE_COMPLAINTS}`,
      { params: { select: 'id,title,category,status,created_at,user_id', order: 'created_at.desc', limit } },
    );

    const list = Array.isArray(data) ? data : [];
    return list.map((item, i) => ({
      id: String(item.id || i),
      type: 'complaint' as const,
      title: String(item.title || 'New Complaint'),
      description: `${item.category || 'General'} — ${item.status || 'pending'}`,
      timestamp: String(item.created_at || new Date().toISOString()),
      status: String(item.status || 'pending'),
    }));
  } catch {
    return [];
  }
}

async function getAnalytics(): Promise<DashboardAnalytics> {
  try {
    const { data } = await authenticatedClient.get<Record<string, unknown>[]>(
      `/${TABLE_COMPLAINTS}`,
      { params: { select: 'status,category,created_at', limit: 1000 } },
    );
    const list = Array.isArray(data) ? data : [];
    const statusMap = new Map<string, number>();
    const catMap = new Map<string, number>();
    for (const item of list) {
      const s = String(item.status || 'unknown');
      statusMap.set(s, (statusMap.get(s) || 0) + 1);
      const c = String(item.category || 'general');
      catMap.set(c, (catMap.get(c) || 0) + 1);
    }
    return {
      complaints: {
        byStatus: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
        byCategory: Array.from(catMap.entries()).map(([category, count]) => ({ category, count })),
        byMonth: [],
      },
    };
  } catch {
    return { complaints: { byStatus: [], byCategory: [], byMonth: [] } };
  }
}

// ─── Realtime Activity (polling-based) ───────────────────────────────────────

export interface LiveActivityItem {
  id: string;
  type: string;
  action: string;
  description: string;
  user_email?: string;
  timestamp: string;
}

async function getLiveActivity(since?: string): Promise<LiveActivityItem[]> {
  try {
    const params: Record<string, string | number> = {
      select: 'id,action,user_id,created_at',
      order: 'created_at.desc',
      limit: 20,
    };
    if (since) params['created_at'] = `gt.${since}`;

    const { data } = await authenticatedClient.get<Record<string, unknown>[]>(
      `/${TABLE_AUDIT_LOGS}`,
      { params },
    );

    const list = Array.isArray(data) ? data : [];
    return list.map((item) => ({
      id: String(item.id || ''),
      type: String(item.action || 'unknown').split('.')[0],
      action: String(item.action || ''),
      description: String(item.details || item.action || ''),
      user_email: String(item.user_email || ''),
      timestamp: String(item.created_at || ''),
    }));
  } catch {
    return [];
  }
}

export const dashboardService = {
  getDashboard,
  getRecentActivity,
  getAnalytics,
  getLiveActivity,
} as const;

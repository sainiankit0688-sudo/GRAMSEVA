/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

import { authenticatedClient } from '@/lib/api/authenticatedClient';
import { TABLE_COMPLAINTS } from '@/lib/constants/api';

export interface ComplaintAnalytics {
  total: number;
  byStatus: { status: string; count: number }[];
  byCategory: { category: string; count: number }[];
  byDistrict: { district: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
}

export interface UserAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  byState: { state: string; count: number }[];
}

export interface WeatherAnalytics {
  totalRequests: number;
  cacheHitRate: number;
  topCities: { city: string; requests: number }[];
}

export interface EducationAnalytics {
  totalScholarships: number;
  totalCourses: number;
  totalColleges: number;
  popularCategories: { category: string; count: number }[];
}

export interface EmergencyAnalytics {
  totalContacts: number;
  totalHospitals: number;
  totalPolice: number;
  totalFire: number;
  helplineUsage: { category: string; count: number }[];
}

export interface AiAnalytics {
  totalConversations: number;
  avgMessagesPerChat: number;
  topModules: { module: string; count: number }[];
  failureRate: number;
}

export interface AdvancedAnalytics {
  complaints: ComplaintAnalytics;
  users: UserAnalytics;
  weather: WeatherAnalytics;
  education: EducationAnalytics;
  emergency: EmergencyAnalytics;
  ai: AiAnalytics;
  dailyTrend: { date: string; count: number }[];
}

async function complaintAnalytics(): Promise<ComplaintAnalytics> {
  try {
    const { data } = await authenticatedClient.get<Record<string, unknown>[]>(
      `/${TABLE_COMPLAINTS}`,
      { params: { select: 'status,category,district,created_at', limit: 1000 } },
    );

    const list = Array.isArray(data) ? data : [];
    const byStatus = new Map<string, number>();
    const byCategory = new Map<string, number>();
    const byDistrict = new Map<string, number>();

    for (const item of list) {
      const s = String(item.status || 'unknown');
      byStatus.set(s, (byStatus.get(s) || 0) + 1);
      const c = String(item.category || 'general');
      byCategory.set(c, (byCategory.get(c) || 0) + 1);
      const d = String(item.district || 'unknown');
      byDistrict.set(d, (byDistrict.get(d) || 0) + 1);
    }

    return {
      total: list.length,
      byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
      byCategory: Array.from(byCategory.entries()).map(([category, count]) => ({ category, count })),
      byDistrict: Array.from(byDistrict.entries()).map(([district, count]) => ({ district, count })),
      monthlyTrend: [],
    };
  } catch {
    return { total: 0, byStatus: [], byCategory: [], byDistrict: [], monthlyTrend: [] };
  }
}

async function userAnalytics(): Promise<UserAnalytics> {
  return { totalUsers: 0, newUsersThisMonth: 0, activeUsers: 0, byState: [] };
}

async function weatherAnalytics(): Promise<WeatherAnalytics> {
  return { totalRequests: 0, cacheHitRate: 0, topCities: [] };
}

async function educationAnalytics(): Promise<EducationAnalytics> {
  return { totalScholarships: 0, totalCourses: 0, totalColleges: 0, popularCategories: [] };
}

async function emergencyAnalytics(): Promise<EmergencyAnalytics> {
  return { totalContacts: 0, totalHospitals: 0, totalPolice: 0, totalFire: 0, helplineUsage: [] };
}

async function aiAnalytics(): Promise<AiAnalytics> {
  return { totalConversations: 0, avgMessagesPerChat: 0, topModules: [], failureRate: 0 };
}

async function advancedAnalytics(): Promise<AdvancedAnalytics> {
  const [complaints, users, weather, education, emergency, ai] = await Promise.all([
    complaintAnalytics(),
    userAnalytics(),
    weatherAnalytics(),
    educationAnalytics(),
    emergencyAnalytics(),
    aiAnalytics(),
  ]);
  return {
    complaints,
    users,
    weather,
    education,
    emergency,
    ai,
    dailyTrend: [],
  };
}

export const analyticsService = {
  complaintAnalytics,
  userAnalytics,
  weatherAnalytics,
  educationAnalytics,
  emergencyAnalytics,
  aiAnalytics,
  advancedAnalytics,
} as const;

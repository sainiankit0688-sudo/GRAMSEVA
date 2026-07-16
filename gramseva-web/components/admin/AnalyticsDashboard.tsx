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
import { analyticsService, type AdvancedAnalytics, type ComplaintAnalytics } from '@/lib/services/analyticsService';
import ExportButton from '@/components/admin/ExportButton';
import { jsPDF } from 'jspdf';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 'complaints' | 'modules' | 'export';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

interface BarRowProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS: readonly Tab[] = [
  { id: 'complaints', label: 'Complaints', icon: '📊' },
  { id: 'modules', label: 'Modules', icon: '📦' },
  { id: 'export', label: 'Export', icon: '📥' },
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-400',
  in_progress: 'bg-indigo-400',
  resolved: 'bg-emerald-400',
  rejected: 'bg-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const CATEGORY_COLORS = [
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-cyan-400',
  'bg-teal-400',
  'bg-orange-400',
  'bg-lime-400',
  'bg-rose-400',
];

const DISTRICT_COLORS = [
  'bg-indigo-400',
  'bg-violet-400',
  'bg-sky-400',
  'bg-emerald-400',
  'bg-amber-400',
  'bg-rose-400',
  'bg-teal-400',
  'bg-fuchsia-400',
  'bg-cyan-400',
  'bg-orange-400',
];

const EMPTY_ANALYTICS: AdvancedAnalytics = {
  complaints: { total: 0, byStatus: [], byCategory: [], byDistrict: [], monthlyTrend: [] },
  users: { totalUsers: 0, newUsersThisMonth: 0, activeUsers: 0, byState: [] },
  weather: { totalRequests: 0, cacheHitRate: 0, topCities: [] },
  education: { totalScholarships: 0, totalCourses: 0, totalColleges: 0, popularCategories: [] },
  emergency: { totalContacts: 0, totalHospitals: 0, totalPolice: 0, totalFire: 0, helplineUsage: [] },
  ai: { totalConversations: 0, avgMessagesPerChat: 0, topModules: [], failureRate: 0 },
  dailyTrend: [],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toCsvRow(fields: string[]): string {
  return fields
    .map((f) => {
      const escaped = f.replace(/"/g, '""');
      return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
        ? `"${escaped}"`
        : escaped;
    })
    .join(',');
}

function complaintToCsvRows(complaints: ComplaintAnalytics): string[] {
  const rows: string[] = [toCsvRow(['Type', 'Label', 'Count'])];
  for (const item of complaints.byStatus) {
    rows.push(toCsvRow(['Status', STATUS_LABELS[item.status] || item.status, String(item.count)]));
  }
  for (const item of complaints.byCategory) {
    rows.push(toCsvRow(['Category', item.category, String(item.count)]));
  }
  for (const item of complaints.byDistrict) {
    rows.push(toCsvRow(['District', item.district, String(item.count)]));
  }
  return rows;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function BarRow({ label, value, maxValue, color = 'bg-indigo-400' }: BarRowProps) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-24 truncate" title={label}>{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={`${label}: ${value}`}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 w-10 text-right">{value.toLocaleString()}</span>
    </div>
  );
}

function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${color}`} role="listitem">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <span className="text-xs font-medium opacity-70">{label}</span>
      </div>
      <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {subtitle && <p className="text-[10px] mt-1 opacity-60">{subtitle}</p>}
    </div>
  );
}

function BarChartSection({
  title,
  items,
  colorMap,
}: {
  title: string;
  items: { key: string; label: string; count: number }[];
  colorMap?: Record<string, string>;
}) {
  const maxVal = useMemo(() => Math.max(...items.map((i) => i.count), 1), [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
        <p className="text-xs text-gray-400 text-center py-6">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <BarRow
            key={item.key}
            label={item.label}
            value={item.count}
            maxValue={maxVal}
            color={colorMap?.[item.key] ?? CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Mini Sparkline ──────────────────────────────────────────────────────────

function MiniSparkline({ data }: { data: { date: string; count: number }[] }) {
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data]);

  if (data.length === 0) {
    return <span className="text-xs text-gray-400">No trend data</span>;
  }

  return (
    <div className="flex items-end gap-0.5 h-8" aria-label="Mini trend chart" role="img">
      {data.map((d) => {
        const h = maxVal > 0 ? (d.count / maxVal) * 100 : 0;
        return (
          <div
            key={d.date}
            className="flex-1 bg-indigo-300 rounded-t"
            style={{ height: `${Math.max(h, 4)}%` }}
            title={`${d.date}: ${d.count}`}
            aria-label={`${d.date}: ${d.count}`}
          />
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('complaints');

  const { data, isLoading, isFetching } = useQuery<AdvancedAnalytics>(
    queryKeys.admin.advancedAnalytics(),
    () => analyticsService.advancedAnalytics(),
    { staleTime: 5 * 60 * 1000 },
  );

  const analytics = data ?? EMPTY_ANALYTICS;

  // ─── Computed values ─────────────────────────────────────────────────────

  const statusBreakdown = useMemo(() => {
    return analytics.complaints.byStatus
      .map((s) => `${STATUS_LABELS[s.status] || s.status}: ${s.count}`)
      .join(' | ');
  }, [analytics.complaints.byStatus]);

  const topDistricts = useMemo(() => {
    return [...analytics.complaints.byDistrict]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((d, i) => ({ key: d.district, label: d.district, count: d.count, color: DISTRICT_COLORS[i % DISTRICT_COLORS.length] }));
  }, [analytics.complaints.byDistrict]);

  const categoryItems = useMemo(() => {
    return analytics.complaints.byCategory.map((c) => ({
      key: c.category,
      label: c.category.charAt(0).toUpperCase() + c.category.slice(1),
      count: c.count,
    }));
  }, [analytics.complaints.byCategory]);

  const statusItems = useMemo(() => {
    return analytics.complaints.byStatus.map((s) => ({
      key: s.status,
      label: STATUS_LABELS[s.status] || s.status,
      count: s.count,
      color: STATUS_COLORS[s.status] || 'bg-gray-400',
    }));
  }, [analytics.complaints.byStatus]);

  const districtColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    topDistricts.forEach((d) => { map[d.key] = d.color; });
    return map;
  }, [topDistricts]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleExportAllCSV = useCallback(() => {
    const rows = [
      toCsvRow(['GramSeva Advanced Analytics Export']),
      toCsvRow([]),
      toCsvRow(['=== Complaint Analytics ===']),
      toCsvRow(['Total Complaints', String(analytics.complaints.total)]),
      toCsvRow([]),
      ...complaintToCsvRows(analytics.complaints),
      toCsvRow([]),
      toCsvRow(['=== AI Analytics ===']),
      toCsvRow(['Total Conversations', String(analytics.ai.totalConversations)]),
      toCsvRow(['Avg Messages Per Chat', String(analytics.ai.avgMessagesPerChat)]),
      toCsvRow(['Failure Rate', `${(analytics.ai.failureRate * 100).toFixed(1)}%`]),
      toCsvRow([]),
      toCsvRow(['=== Emergency Analytics ===']),
      toCsvRow(['Total Contacts', String(analytics.emergency.totalContacts)]),
      toCsvRow(['Hospitals', String(analytics.emergency.totalHospitals)]),
      toCsvRow(['Police Stations', String(analytics.emergency.totalPolice)]),
      toCsvRow(['Fire Stations', String(analytics.emergency.totalFire)]),
      toCsvRow([]),
      toCsvRow(['=== Weather Analytics ===']),
      toCsvRow(['Total Requests', String(analytics.weather.totalRequests)]),
      toCsvRow(['Cache Hit Rate', `${(analytics.weather.cacheHitRate * 100).toFixed(1)}%`]),
      toCsvRow([]),
      toCsvRow(['=== Education Analytics ===']),
      toCsvRow(['Scholarships', String(analytics.education.totalScholarships)]),
      toCsvRow(['Courses', String(analytics.education.totalCourses)]),
      toCsvRow(['Colleges', String(analytics.education.totalColleges)]),
    ];
    downloadBlob(rows.join('\n'), 'gramseva-analytics-export.csv', 'text/csv;charset=utf-8;');
  }, [analytics]);

  const handleExportComplaintsCSV = useCallback(() => {
    const rows = [
      toCsvRow(['Status', 'Count']),
      ...analytics.complaints.byStatus.map((s) => toCsvRow([STATUS_LABELS[s.status] || s.status, String(s.count)])),
      toCsvRow([]),
      toCsvRow(['Category', 'Count']),
      ...analytics.complaints.byCategory.map((c) => toCsvRow([c.category, String(c.count)])),
      toCsvRow([]),
      toCsvRow(['District', 'Count']),
      ...analytics.complaints.byDistrict.map((d) => toCsvRow([d.district, String(d.count)])),
    ];
    downloadBlob(rows.join('\n'), 'gramseva-complaints.csv', 'text/csv;charset=utf-8;');
  }, [analytics.complaints]);

  const handleExportUsersCSV = useCallback(() => {
    const rows = [
      toCsvRow(['Metric', 'Value']),
      toCsvRow(['Total Users', String(analytics.users.totalUsers)]),
      toCsvRow(['New Users This Month', String(analytics.users.newUsersThisMonth)]),
      toCsvRow(['Active Users', String(analytics.users.activeUsers)]),
      toCsvRow([]),
      toCsvRow(['State', 'Count']),
      ...analytics.users.byState.map((s) => toCsvRow([s.state, String(s.count)])),
    ];
    downloadBlob(rows.join('\n'), 'gramseva-users.csv', 'text/csv;charset=utf-8;');
  }, [analytics.users]);

  const handleExportSchemesCSV = useCallback(() => {
    const rows = [
      toCsvRow(['Module', 'Metric', 'Value']),
      toCsvRow(['Education', 'Scholarships', String(analytics.education.totalScholarships)]),
      toCsvRow(['Education', 'Courses', String(analytics.education.totalCourses)]),
      toCsvRow(['Education', 'Colleges', String(analytics.education.totalColleges)]),
      toCsvRow(['Weather', 'Total Requests', String(analytics.weather.totalRequests)]),
      toCsvRow(['Weather', 'Cache Hit Rate', `${(analytics.weather.cacheHitRate * 100).toFixed(1)}%`]),
      toCsvRow(['Emergency', 'Total Contacts', String(analytics.emergency.totalContacts)]),
      toCsvRow(['AI', 'Total Conversations', String(analytics.ai.totalConversations)]),
    ];
    downloadBlob(rows.join('\n'), 'gramseva-schemes.csv', 'text/csv;charset=utf-8;');
  }, [analytics]);

  const handleExportAnalyticsPDF = useCallback(() => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(18);
    doc.text('GramSeva Advanced Analytics', margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
    y += 12;

    doc.setFontSize(14);
    doc.text('Complaint Analytics', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Total Complaints: ${analytics.complaints.total}`, margin, y);
    y += 6;
    for (const s of analytics.complaints.byStatus) {
      doc.text(`  ${STATUS_LABELS[s.status] || s.status}: ${s.count}`, margin, y);
      y += 5;
    }
    y += 4;
    for (const c of analytics.complaints.byCategory) {
      doc.text(`  ${c.category}: ${c.count}`, margin, y);
      y += 5;
    }
    y += 6;

    doc.setFontSize(14);
    doc.text('AI Analytics', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Conversations: ${analytics.ai.totalConversations}`, margin, y);
    y += 5;
    doc.text(`Avg Messages/Chat: ${analytics.ai.avgMessagesPerChat}`, margin, y);
    y += 5;
    doc.text(`Failure Rate: ${(analytics.ai.failureRate * 100).toFixed(1)}%`, margin, y);
    y += 8;

    doc.setFontSize(14);
    doc.text('Emergency Analytics', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Contacts: ${analytics.emergency.totalContacts}`, margin, y);
    y += 5;
    doc.text(`Hospitals: ${analytics.emergency.totalHospitals}`, margin, y);
    y += 5;
    doc.text(`Police: ${analytics.emergency.totalPolice}`, margin, y);
    y += 5;
    doc.text(`Fire: ${analytics.emergency.totalFire}`, margin, y);
    y += 8;

    doc.setFontSize(14);
    doc.text('Weather Analytics', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Requests: ${analytics.weather.totalRequests}`, margin, y);
    y += 5;
    doc.text(`Cache Hit Rate: ${(analytics.weather.cacheHitRate * 100).toFixed(1)}%`, margin, y);
    y += 8;

    doc.setFontSize(14);
    doc.text('Education Analytics', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Scholarships: ${analytics.education.totalScholarships}`, margin, y);
    y += 5;
    doc.text(`Courses: ${analytics.education.totalCourses}`, margin, y);
    y += 5;
    doc.text(`Colleges: ${analytics.education.totalColleges}`, margin, y);

    doc.save('gramseva-analytics.pdf');
  }, [analytics]);

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <section className="space-y-6" aria-label="Advanced Analytics Dashboard">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1A237E] to-[#3949AB] bg-clip-text text-transparent">
            Advanced Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive insights across all platform modules
          </p>
        </div>
        <ExportButton
          onExportCSV={handleExportAllCSV}
          label="Export All"
          disabled={isLoading}
        />
      </div>

      {/* STAT CARDS ROW */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="Loading statistics">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 animate-pulse">
              <div className="h-2 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-7 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="Key metrics">
          <StatCard
            label="Total Complaints"
            value={analytics.complaints.total}
            icon="📝"
            color="bg-purple-50 text-purple-700 border-purple-100"
            subtitle={statusBreakdown || 'No complaints'}
          />
          <StatCard
            label="Daily Trend (7d)"
            value={analytics.dailyTrend.reduce((sum, d) => sum + d.count, 0)}
            icon="📈"
            color="bg-indigo-50 text-indigo-700 border-indigo-100"
          />
          <StatCard
            label="Categories"
            value={analytics.complaints.byCategory.length}
            icon="🏷️"
            color="bg-sky-50 text-sky-700 border-sky-100"
            subtitle={analytics.complaints.byCategory.length > 0 ? analytics.complaints.byCategory[0].category : 'None'}
          />
          <StatCard
            label="Districts"
            value={analytics.complaints.byDistrict.length}
            icon="🗺️"
            color="bg-emerald-50 text-emerald-700 border-emerald-100"
            subtitle={analytics.complaints.byDistrict.length > 0 ? analytics.complaints.byDistrict[0].district : 'None'}
          />
        </div>
      )}

      {/* Mini Daily Trend */}
      {!isLoading && analytics.dailyTrend.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Last 7 Days</h3>
          <MiniSparkline data={analytics.dailyTrend.slice(-7)} />
        </div>
      )}

      {/* Fetching indicator */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-xs text-indigo-500" role="status" aria-live="polite">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" aria-hidden="true" />
          Refreshing data...
        </div>
      )}

      {/* TABS */}
      <div role="tablist" aria-label="Analytics sections" className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#1A237E] to-[#3949AB] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Complaints */}
      {activeTab === 'complaints' && (
        <div
          role="tabpanel"
          id="tabpanel-complaints"
          aria-labelledby="tab-complaints"
          className="space-y-4"
        >
          <BarChartSection
            title="Complaint Status Distribution"
            items={statusItems}
            colorMap={STATUS_COLORS}
          />

          <BarChartSection
            title="Complaints by Category"
            items={categoryItems}
          />

          <BarChartSection
            title="Complaints by District (Top 10)"
            items={topDistricts}
            colorMap={districtColorMap}
          />

          {analytics.complaints.monthlyTrend.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Trend</h3>
              <div className="flex flex-col gap-2">
                {analytics.complaints.monthlyTrend.map((item) => {
                  const maxMonth = Math.max(...analytics.complaints.monthlyTrend.map((m) => m.count), 1);
                  return (
                    <BarRow
                      key={item.month}
                      label={item.month}
                      value={item.count}
                      maxValue={maxMonth}
                      color="bg-indigo-400"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Modules */}
      {activeTab === 'modules' && (
        <div
          role="tabpanel"
          id="tabpanel-modules"
          aria-labelledby="tab-modules"
          className="space-y-4"
        >
          {/* AI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="AI usage statistics">
            <StatCard
              label="AI Conversations"
              value={analytics.ai.totalConversations}
              icon="🤖"
              color="bg-indigo-50 text-indigo-700 border-indigo-100"
            />
            <StatCard
              label="Avg Messages/Chat"
              value={analytics.ai.avgMessagesPerChat}
              icon="💬"
              color="bg-violet-50 text-violet-700 border-violet-100"
            />
            <StatCard
              label="AI Failure Rate"
              value={`${(analytics.ai.failureRate * 100).toFixed(1)}%`}
              icon="⚠️"
              color={analytics.ai.failureRate > 0.1 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}
            />
            <StatCard
              label="AI Top Modules"
              value={analytics.ai.topModules.length}
              icon="📦"
              color="bg-sky-50 text-sky-700 border-sky-100"
            />
          </div>

          {/* AI Top Modules Bar */}
          {analytics.ai.topModules.length > 0 && (
            <BarChartSection
              title="AI Module Usage"
              items={analytics.ai.topModules.map((m) => ({
                key: m.module,
                label: m.module,
                count: m.count,
              }))}
            />
          )}

          {/* Module Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list" aria-label="Module statistics">
            <StatCard
              label="Emergency Contacts"
              value={analytics.emergency.totalContacts}
              icon="🚨"
              color="bg-red-50 text-red-700 border-red-100"
            />
            <StatCard
              label="Weather Requests"
              value={analytics.weather.totalRequests}
              icon="🌤️"
              color="bg-amber-50 text-amber-700 border-amber-100"
              subtitle={`Cache hit: ${(analytics.weather.cacheHitRate * 100).toFixed(0)}%`}
            />
            <StatCard
              label="Education Resources"
              value={analytics.education.totalScholarships + analytics.education.totalCourses + analytics.education.totalColleges}
              icon="📚"
              color="bg-teal-50 text-teal-700 border-teal-100"
              subtitle={`${analytics.education.totalScholarships} scholarships, ${analytics.education.totalCourses} courses`}
            />
          </div>

          {/* Emergency Breakdown */}
          {(analytics.emergency.totalHospitals + analytics.emergency.totalPolice + analytics.emergency.totalFire) > 0 && (
            <BarChartSection
              title="Emergency Resources"
              items={[
                { key: 'hospitals', label: 'Hospitals', count: analytics.emergency.totalHospitals },
                { key: 'police', label: 'Police Stations', count: analytics.emergency.totalPolice },
                { key: 'fire', label: 'Fire Stations', count: analytics.emergency.totalFire },
              ]}
              colorMap={{ hospitals: 'bg-red-400', police: 'bg-blue-400', fire: 'bg-orange-400' }}
            />
          )}
        </div>
      )}

      {/* TAB: Export */}
      {activeTab === 'export' && (
        <div
          role="tabpanel"
          id="tabpanel-export"
          aria-labelledby="tab-export"
          className="space-y-4"
        >
          <p className="text-sm text-gray-500">
            Export platform data in CSV or PDF format for external analysis and reporting.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExportComplaintsCSV}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Export complaints data as CSV"
            >
              <span className="text-2xl" aria-hidden="true">📊</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Complaints CSV</p>
                <p className="text-xs text-gray-500">Status, category & district breakdowns</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportUsersCSV}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Export users data as CSV"
            >
              <span className="text-2xl" aria-hidden="true">👥</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Users CSV</p>
                <p className="text-xs text-gray-500">User counts and state distribution</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportSchemesCSV}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Export schemes data as CSV"
            >
              <span className="text-2xl" aria-hidden="true">📋</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Schemes CSV</p>
                <p className="text-xs text-gray-500">Education, weather, emergency & AI modules</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportAnalyticsPDF}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Export analytics report as PDF"
            >
              <span className="text-2xl" aria-hidden="true">📄</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Analytics PDF</p>
                <p className="text-xs text-gray-500">Full report with all module summaries</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

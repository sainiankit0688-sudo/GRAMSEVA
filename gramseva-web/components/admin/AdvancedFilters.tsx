/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

import { useState } from 'react';
import type { ComplaintStatus, ComplaintPriority } from '@/lib/services/complaintService';

const STATUSES: { value: ComplaintStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

const PRIORITIES: { value: ComplaintPriority | ''; label: string }[] = [
  { value: '', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const CATEGORIES = ['', 'road', 'water', 'electricity', 'drainage', 'sanitation', 'streetlight', 'other'].map((c) => ({
  value: c,
  label: c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All Categories',
}));

interface AdvancedFiltersProps {
  status: ComplaintStatus | '';
  priority: ComplaintPriority | '';
  category: string;
  district: string;
  dateFrom: string;
  dateTo: string;
  onStatusChange: (v: ComplaintStatus | '') => void;
  onPriorityChange: (v: ComplaintPriority | '') => void;
  onCategoryChange: (v: string) => void;
  onDistrictChange: (v: string) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onReset: () => void;
}

export default function AdvancedFilters({
  status, priority, category, district, dateFrom, dateTo,
  onStatusChange, onPriorityChange, onCategoryChange, onDistrictChange,
  onDateFromChange, onDateToChange, onReset,
}: AdvancedFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-2 py-1"
          aria-expanded={expanded}
        >
          <span>🔍</span>
          Filters
          <span className="text-[10px]">{expanded ? '▲' : '▼'}</span>
        </button>
        {(status || priority || category || district || dateFrom || dateTo) && (
          <button type="button" onClick={onReset} className="text-[10px] text-red-500 hover:text-red-600 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300">
            Clear All
          </button>
        )}
      </div>
      {expanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
          <select value={status} onChange={(e) => onStatusChange(e.target.value as ComplaintStatus | '')} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300" aria-label="Filter by status">
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={priority} onChange={(e) => onPriorityChange(e.target.value as ComplaintPriority | '')} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300" aria-label="Filter by priority">
            {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300" aria-label="Filter by category">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <input type="text" value={district} onChange={(e) => onDistrictChange(e.target.value)} placeholder="District" className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300" aria-label="Filter by district" />
          <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300" aria-label="Date from" />
          <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 outline-none focus:border-indigo-300" aria-label="Date to" />
        </div>
      )}
    </div>
  );
}

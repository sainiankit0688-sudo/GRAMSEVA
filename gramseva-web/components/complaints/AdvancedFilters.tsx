'use client';

/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useState, useCallback, useMemo } from 'react';

const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'road', label: 'Road' },
  { value: 'water', label: 'Water' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'drainage', label: 'Drainage' },
  { value: 'streetlight', label: 'Street Light' },
  { value: 'garbage', label: 'Garbage' },
  { value: 'other', label: 'Other' },
];

const PRIORITIES = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const SORT_OPTIONS = [
  { value: 'created_at.desc', label: 'Newest First' },
  { value: 'created_at.asc', label: 'Oldest First' },
  { value: 'updated_at.desc', label: 'Recently Updated' },
];

export interface AdvancedFiltersState {
  search: string;
  statuses: string[];
  categories: string[];
  priorities: string[];
  district: string;
  state: string;
  dateFrom: string;
  dateTo: string;
  sort: string;
}

interface AdvancedFiltersProps {
  filters: AdvancedFiltersState;
  onChange: (filters: AdvancedFiltersState) => void;
}

export default function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const activeCount = useMemo(() => {
    let c = 0;
    if (filters.statuses.length) c += filters.statuses.length;
    if (filters.categories.length) c += filters.categories.length;
    if (filters.priorities.length) c += filters.priorities.length;
    if (filters.district) c++;
    if (filters.state) c++;
    if (filters.dateFrom) c++;
    if (filters.dateTo) c++;
    if (filters.sort !== 'created_at.desc') c++;
    return c;
  }, [filters]);

  const toggleMulti = useCallback(
    (key: 'statuses' | 'categories' | 'priorities', value: string) => {
      const arr = filters[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      onChange({ ...filters, [key]: next });
    },
    [filters, onChange],
  );

  const clearAll = useCallback(() => {
    onChange({
      search: '',
      statuses: [],
      categories: [],
      priorities: [],
      district: '',
      state: '',
      dateFrom: '',
      dateTo: '',
      sort: 'created_at.desc',
    });
  }, [onChange]);

  const inputClass = 'w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 bg-gray-50 outline-none focus:border-amber-500';

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <label htmlFor="complaint-search" className="sr-only">Search complaints</label>
          <input
            id="complaint-search"
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search title, ID, village, district..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pl-9 text-sm bg-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true">🔍</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors relative ${
            expanded || activeCount > 0
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          aria-expanded={expanded}
        >
          ⚙ Filters
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-600 text-white rounded-full text-xs flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {expanded && (
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col gap-3">
          {/* Multi-select: Status */}
          <fieldset>
            <legend className="text-xs font-medium text-gray-500 mb-1.5">Status</legend>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.filter((s) => s.value).map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleMulti('statuses', s.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filters.statuses.includes(s.value)
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-pressed={filters.statuses.includes(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Multi-select: Category */}
          <fieldset>
            <legend className="text-xs font-medium text-gray-500 mb-1.5">Category</legend>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.filter((c) => c.value).map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggleMulti('categories', c.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filters.categories.includes(c.value)
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-pressed={filters.categories.includes(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Multi-select: Priority */}
          <fieldset>
            <legend className="text-xs font-medium text-gray-500 mb-1.5">Priority</legend>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITIES.filter((p) => p.value).map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => toggleMulti('priorities', p.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filters.priorities.includes(p.value)
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-pressed={filters.priorities.includes(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Location Filters */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filter-district" className="text-xs font-medium text-gray-500 mb-1 block">District</label>
              <input
                id="filter-district"
                type="text"
                value={filters.district}
                onChange={(e) => onChange({ ...filters, district: e.target.value })}
                placeholder="District"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="filter-state" className="text-xs font-medium text-gray-500 mb-1 block">State</label>
              <input
                id="filter-state"
                type="text"
                value={filters.state}
                onChange={(e) => onChange({ ...filters, state: e.target.value })}
                placeholder="State"
                className={inputClass}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filter-date-from" className="text-xs font-medium text-gray-500 mb-1 block">From</label>
              <input
                id="filter-date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="filter-date-to" className="text-xs font-medium text-gray-500 mb-1 block">To</label>
              <input
                id="filter-date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="filter-sort" className="text-xs font-medium text-gray-500 mb-1 block">Sort by</label>
            <select
              id="filter-sort"
              value={filters.sort}
              onChange={(e) => onChange({ ...filters, sort: e.target.value })}
              className={inputClass}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-amber-700 font-medium text-right hover:underline"
            >
              Clear all ({activeCount} active)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

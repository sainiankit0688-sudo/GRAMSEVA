/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { adminService, type GlobalSearchResult } from '@/lib/services/adminService';

const CATEGORY_COLORS: Record<string, string> = {
  complaint: 'bg-red-100 text-red-700',
  scheme: 'bg-indigo-100 text-indigo-700',
  education: 'bg-blue-100 text-blue-700',
  emergency: 'bg-orange-100 text-orange-700',
  weather: 'bg-sky-100 text-sky-700',
  faq: 'bg-emerald-100 text-emerald-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  complaint: 'Complaints',
  scheme: 'Schemes',
  education: 'Education',
  emergency: 'Emergency',
  weather: 'Weather',
  faq: 'FAQs',
};

const CATEGORY_ORDER = ['complaint', 'scheme', 'education', 'emergency', 'weather', 'faq'];

const MAX_PER_CATEGORY = 5;
const MAX_TOTAL = 30;

interface GroupedResults {
  type: string;
  label: string;
  items: GlobalSearchResult[];
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      setIsOpen(value.length >= 2);
    }, 300);
  }, []);

  const { data: results, isLoading } = useQuery(
    queryKeys.admin.globalSearch(debouncedQuery),
    () => adminService.globalSearch(debouncedQuery),
    {
      enabled: debouncedQuery.length >= 2,
      staleTime: 60_000,
    },
  );

  const grouped = useMemo<GroupedResults[]>(() => {
    if (!results) return [];
    const groups = new Map<string, GlobalSearchResult[]>();
    for (const r of results) {
      const existing = groups.get(r.type) ?? [];
      if (existing.length < MAX_PER_CATEGORY) {
        existing.push(r);
      }
      groups.set(r.type, existing);
    }
    const totalResults: GroupedResults[] = [];
    let total = 0;
    for (const type of CATEGORY_ORDER) {
      const items = groups.get(type);
      if (!items || items.length === 0) continue;
      const remaining = MAX_TOTAL - total;
      if (remaining <= 0) break;
      totalResults.push({ type, label: CATEGORY_LABELS[type] || type, items: items.slice(0, remaining) });
      total += items.length;
    }
    return totalResults;
  }, [results]);

  const flatItems = useMemo(() => {
    return grouped.flatMap((g) => g.items);
  }, [grouped]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && selectedIndex >= 0 && flatItems[selectedIndex]) {
        e.preventDefault();
        const item = flatItems[selectedIndex];
        window.location.href = item.url;
      } else if (e.key === 'Escape') {
        setQuery('');
        setDebouncedQuery('');
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
    },
    [flatItems, selectedIndex],
  );

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const showResults = isOpen && debouncedQuery.length >= 2;

  return (
    <div className="relative w-full" role="combobox" aria-expanded={showResults} aria-controls="global-search-list" aria-haspopup="listbox">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (debouncedQuery.length >= 2) setIsOpen(true); }}
          placeholder="Search across all modules..."
          className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-colors"
          aria-label="Global search"
          aria-autocomplete="list"
          aria-controls="global-search-list"
          role="searchbox"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDebouncedQuery('');
              setIsOpen(false);
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showResults && (
        <div
          ref={listRef}
          id="global-search-list"
          role="listbox"
          aria-label="Search results"
          className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-[28rem] overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 space-y-3" role="status" aria-label="Searching">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-4 w-16 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
              <span className="sr-only">Searching...</span>
            </div>
          ) : flatItems.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-sm text-gray-500">No results found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.type} role="group" aria-label={group.label}>
                <div className="px-3 py-1.5 border-b border-gray-50">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{group.label}</span>
                </div>
                {group.items.map((item) => {
                  const globalIdx = flatItems.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <a
                      key={`${item.type}-${item.id}`}
                      href={item.url}
                      data-index={globalIdx}
                      role="option"
                      aria-selected={isSelected}
                      className={`flex items-start gap-3 px-3 py-2.5 transition-colors ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                      onClick={(e) => { e.preventDefault(); window.location.href = item.url; }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                    >
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${CATEGORY_COLORS[item.type] || 'bg-gray-100 text-gray-500'}`}>
                        {CATEGORY_LABELS[item.type] || item.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}

      {showResults && (
        <button
          type="button"
          className="fixed inset-0 z-40"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

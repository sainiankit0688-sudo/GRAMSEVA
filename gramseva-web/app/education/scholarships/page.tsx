'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type Scholarship } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/education/BookmarkButton';
import NotificationButton from '@/components/education/NotificationButton';
import SmartBadges from '@/components/education/SmartBadges';
import ShareActions from '@/components/education/ShareActions';
import ProgressButtons from '@/components/education/ProgressButtons';
import ScholarshipEligibilityChecker from '@/components/education/ScholarshipEligibilityChecker';

const CATEGORIES = ['All', 'Central Govt', 'State Govt', 'Minority'];
const STATES = ['All', 'All India', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra'];
const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-green-100 text-green-700',
  Coming: 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-red-100 text-red-700',
};

const RECENT_SEARCHES_KEY = 'gs_edu_scholarship_searches';

function getRecentSearches(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function addRecentSearch(query: string): void {
  if (typeof localStorage === 'undefined' || !query.trim()) return;
  try {
    const existing = getRecentSearches().filter((s) => s !== query);
    const updated = [query, ...existing].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {}
}

function clearRecentSearches(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState('All');
  const [state, setState] = useState('All');
  const [showChecker, setShowChecker] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: scholarships, isLoading, error, refetch } = useQuery<Scholarship[]>(
    queryKeys.education.scholarships(category === 'All' ? undefined : category),
    () => educationService.getScholarships(category === 'All' ? undefined : category),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const filtered = useMemo(() => {
    if (!scholarships) return [];
    const q = debouncedSearch.toLowerCase();
    return scholarships.filter((s) => {
      const matchesSearch = !debouncedSearch || s.title.toLowerCase().includes(q) || s.titleHindi.includes(q);
      const matchesState = state === 'All' || s.state === state;
      return matchesSearch && matchesState;
    });
  }, [scholarships, debouncedSearch, state]);

  const suggestions = useMemo(() => {
    if (!scholarships || !search) return [];
    const q = search.toLowerCase();
    return scholarships
      .filter((s) => s.title.toLowerCase().includes(q) || s.titleHindi.includes(q))
      .slice(0, 5);
  }, [scholarships, search]);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  const handleSearchFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  const handleSelectSuggestion = useCallback((title: string) => {
    setSearch(title);
    setDebouncedSearch(title);
    addRecentSearch(title);
    setShowSuggestions(false);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (search.trim()) {
      addRecentSearch(search.trim());
    }
  }, [search]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Scholarships" titleHindi="छात्रवृत्ति" icon="🎓" gradient="linear-gradient(135deg, #2E7D32, #43A047)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'Scholarships' }]} />

      <div className="px-4 py-4 space-y-4">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              placeholder="Search scholarships... / छात्रवृत्ति खोजें..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Search scholarships"
              aria-autocomplete="list"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls="scholarship-suggestions"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">🔍</span>

              {showSuggestions && search && suggestions.length > 0 && (
              <ul id="scholarship-suggestions" className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden" role="listbox" aria-label="Search suggestions">
                {suggestions.map((s) => (
                  <li key={s.id} role="option" aria-selected={false}>
                    <button
                      onMouseDown={() => handleSelectSuggestion(s.title)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors focus:outline-none focus:bg-green-50"
                    >
                      <span className="mr-2" aria-hidden="true">{s.icon}</span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {showSuggestions && !search && recentSearches.length > 0 && (
              <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-2 text-[11px] text-gray-400 font-medium flex items-center justify-between">
                  <span>Recent Searches / हाल की खोज</span>
                  <button onClick={() => { clearRecentSearches(); setRecentSearches([]); }} className="text-red-500 hover:text-red-700 focus:outline-none" aria-label="Clear recent searches">
                    Clear
                  </button>
                </div>
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    onMouseDown={() => handleSelectSuggestion(q)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-green-50 transition-colors focus:outline-none"
                  >
                    🕐 {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowChecker(!showChecker)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 ${
              showChecker ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
            }`}
            aria-label="Toggle scholarship eligibility checker"
            aria-pressed={showChecker}
          >
            <span aria-hidden="true">🔍</span>
            Check Eligibility
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 ${
                category === c ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
              aria-pressed={category === c}
            >
              {c === 'All' ? 'All / सभी' : c}
            </button>
          ))}
          <div className="w-px h-6 bg-gray-200 self-center" />
          {STATES.map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 ${
                state === s ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
              aria-pressed={state === s}
            >
              {s === 'All' ? 'All / सभी' : s}
            </button>
          ))}
        </div>

        {/* Eligibility Checker */}
        {showChecker && <ScholarshipEligibilityChecker />}

        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading scholarships..." messageHindi="छात्रवृत्ति लोड हो रही हैं..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load scholarships'} messageHindi="छात्रवृत्ति लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            icon="🎓"
            title="No scholarships found"
            titleHindi="कोई छात्रवृत्ति नहीं मिली"
            description="Try adjusting your search or filters"
            descriptionHindi="अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें"
            action={search || category !== 'All' || state !== 'All' ? { label: 'Clear Filters / फ़िल्टर साफ़ करें', onClick: () => { setSearch(''); setDebouncedSearch(''); setCategory('All'); setState('All'); } } : undefined}
          />
        )}

        {/* List */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-4" aria-live="polite" aria-label="Scholarship results">
            {filtered.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={s.title}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: s.color + '20' }}>
                    <span aria-hidden="true">{s.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{s.title}</h3>
                        <p className="text-xs text-gray-500">{s.titleHindi}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0 items-start">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{s.category}</span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <SmartBadges item={{ id: s.id, deadline: s.deadline, status: s.status }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-green-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-500">Amount / राशि</p>
                    <p className="text-xs font-bold text-green-700">{s.amount}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-500">Deadline / अंतिम तिथि</p>
                    <p className="text-xs font-bold text-red-700">{s.deadline}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-2 mb-3">
                  <span aria-hidden="true">👥</span> {s.eligibility}
                </p>

                <div className="flex gap-2 mb-3">
                  <BookmarkButton itemId={s.id} />
                  <NotificationButton itemId={s.id} />
                </div>

                <ProgressButtons itemId={s.id} />

                <div className="mt-3">
                  <ShareActions title={s.title} itemId={s.id} />
                </div>

                <div className="flex gap-2 mt-3">
                  <a
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-white text-center transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: s.color }}
                    aria-label={`Apply for ${s.title}`}
                  >
                    Apply Now / आवेदन करें
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

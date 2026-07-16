'use client';

/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useQuery } from '@/hooks/useQuery';
import { schemeService, type Scheme } from '@/lib/services/schemeService';
import { queryKeys } from '@/lib/queryKeys';
import { SCHEME_STALE_TIME, DEFAULT_PAGE_SIZE } from '@/lib/constants/api';
import { schemeDisplayMeta } from '@/lib/scheme-display';
import { LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb, ShareButton } from '@/components/agriculture';
import SmartBadges from '@/components/government-schemes/SmartBadges';
import EligibilityChecker from '@/components/government-schemes/EligibilityChecker';

const CATEGORIES = [
  { key: 'all', label: 'All', labelHindi: 'सभी' },
  { key: 'agriculture', label: 'Agriculture', labelHindi: 'कृषि' },
  { key: 'education', label: 'Education', labelHindi: 'शिक्षा' },
  { key: 'health', label: 'Health', labelHindi: 'स्वास्थ्य' },
  { key: 'housing', label: 'Housing', labelHindi: 'आवास' },
  { key: 'finance', label: 'Finance', labelHindi: 'वित्त' },
  { key: 'social', label: 'Social Welfare', labelHindi: 'सामाजिक कल्याण' },
  { key: 'employment', label: 'Employment', labelHindi: 'रोजगार' },
  { key: 'energy', label: 'Energy', labelHindi: 'ऊर्जा' },
  { key: 'infrastructure', label: 'Infrastructure', labelHindi: 'बुनियादी ढांचा' },
];

const SORT_OPTIONS = [
  { key: 'name', label: 'Name', labelHindi: 'नाम' },
  { key: 'newest', label: 'Newest', labelHindi: 'नवीनतम' },
  { key: 'oldest', label: 'Oldest', labelHindi: 'पुराना' },
];

const INDIAN_STATES = [
  { value: '', label: 'All States', labelHindi: 'सभी राज्य' },
  { value: 'andhra pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west bengal', label: 'West Bengal' },
];

const OCCUPATION_OPTIONS = [
  { label: 'Any', value: '' },
  { label: 'Farmer', value: 'farmer' },
  { label: 'Student', value: 'student' },
  { label: 'Woman', value: 'woman' },
  { label: 'Senior Citizen', value: 'senior' },
  { label: 'SC', value: 'sc' },
  { label: 'ST', value: 'st' },
  { label: 'OBC', value: 'obc' },
  { label: 'Minority', value: 'minority' },
  { label: 'BPL', value: 'bpl' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Unemployed', value: 'unemployed' },
];
const INCOME_RANGES = [
  { label: 'Any Income', value: '' },
  { label: 'Below ₹50,000 (BPL)', value: '0-50000' },
  { label: '₹50,000 - ₹3,00,000', value: '50000-300000' },
  { label: '₹3,00,000 - ₹8,00,000', value: '300000-800000' },
  { label: 'Above ₹8,00,000', value: '800000+' },
];

const PAGE_SIZE = DEFAULT_PAGE_SIZE;

function enrichScheme(record: Scheme) {
  const meta = schemeDisplayMeta[record.id];
  return {
    ...record,
    title: meta?.title || record.id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    titleHindi: meta?.titleHindi || '',
    icon: meta?.icon || '📄',
    color: meta?.color || '#1565C0',
    isFeatured: meta?.featured || false,
  };
}

export default function GovernmentSchemesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('name');
  const [selectedState, setSelectedState] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const [selectedIncome, setSelectedIncome] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showEligibility, setShowEligibility] = useState(false);

  const {
    data: allSchemes,
    isLoading,
    error,
    refetch,
  } = useQuery<Scheme[]>(
    queryKeys.schemes.list(),
    () => schemeService.list(),
    { staleTime: SCHEME_STALE_TIME },
  );

  const enrichedSchemes = useMemo(() => {
    if (!allSchemes) return [];
    return allSchemes.map(enrichScheme);
  }, [allSchemes]);

  const filteredSchemes = useMemo(() => {
    let result = enrichedSchemes;

    if (activeCategory !== 'all') {
      result = result.filter((s) => {
        const searchable = [s.id, s.category, s.about, s.objective || ''].join(' ').toLowerCase();
        return searchable.includes(activeCategory);
      });
    }

    if (selectedState) {
      result = result.filter((s) => {
        const searchable = [s.about, s.objective || '', s.eligibility?.join(' ') || ''].join(' ').toLowerCase();
        return searchable.includes(selectedState);
      });
    }

    if (selectedOccupation) {
      result = result.filter((s) => {
        const searchable = [
          s.id, s.about, s.objective || '',
          ...(s.eligibility || []), ...(s.who_can_apply || [])
        ].join(' ').toLowerCase();
        const kw = selectedOccupation === 'farmer' ? ['kisan', 'farmer', 'agriculture', 'krishi']
          : selectedOccupation === 'student' ? ['student', 'scholarship', 'education', 'vidya']
          : selectedOccupation === 'woman' ? ['woman', 'female', 'mahila', 'matru', 'girl', 'beti']
          : selectedOccupation === 'senior' ? ['senior', 'aged', 'pension', 'vriddha']
          : selectedOccupation === 'disabled' ? ['disabled', 'disability', 'viklang']
          : selectedOccupation === 'unemployed' ? ['employment', 'unemployed', 'job', 'berojgar']
          : [selectedOccupation];
        return kw.some((k) => searchable.includes(k));
      });
    }

    if (searchInput.trim()) {
      const q = searchInput.toLowerCase().trim();
      result = result.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        s.titleHindi.toLowerCase().includes(q) ||
        s.about?.toLowerCase().includes(q) ||
        s.objective?.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      switch (activeSort) {
        case 'name': return a.title.localeCompare(b.title);
        case 'newest': return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'oldest': return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        default: return 0;
      }
    });

    return result;
  }, [enrichedSchemes, activeCategory, selectedState, selectedOccupation, searchInput, activeSort]);

  const paginatedSchemes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSchemes.slice(start, start + PAGE_SIZE);
  }, [filteredSchemes, page]);

  const totalPages = Math.max(1, Math.ceil(filteredSchemes.length / PAGE_SIZE));

  const popularSchemes = useMemo(() => {
    return enrichedSchemes.filter((s) => s.isFeatured);
  }, [enrichedSchemes]);

  const latestSchemes = useMemo(() => {
    return [...enrichedSchemes]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 4);
  }, [enrichedSchemes]);

  const centralSchemes = useMemo(() => {
    return enrichedSchemes.filter((s) =>
      s.id.includes('pm_') || s.id.includes('national') || s.id.includes('central'),
    ).slice(0, 4);
  }, [enrichedSchemes]);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat); setPage(1);
  }, []);

  const handleSearch = useCallback((val: string) => {
    setSearchInput(val); setPage(1);
  }, []);

  const handleStateChange = useCallback((val: string) => {
    setSelectedState(val); setPage(1);
  }, []);

  const activeFilterCount = [selectedState, selectedOccupation, selectedIncome].filter(Boolean).length;

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-8 text-white" style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl" aria-hidden="true">🏛️</span>
          <div>
            <h1 className="text-xl font-bold">Government Schemes</h1>
            <p className="text-blue-100 text-sm">सरकारी योजनाएं</p>
          </div>
        </div>
        <p className="text-blue-100 text-xs mt-1">Explore all government schemes in one place</p>
        <div className="relative mt-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search schemes / योजनाएं खोजें"
            aria-label="Search schemes"
            aria-describedby="search-description"
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
          />
          <span id="search-description" className="sr-only">Type to search government schemes by name, category or keywords</span>
          {searchInput && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Government Schemes' }]} />

      <div className="px-4 py-3">
        {/* Quick Stats */}
        {!isLoading && !error && enrichedSchemes.length > 0 && (
          <div className="flex gap-3 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }} role="status" aria-label="Scheme statistics">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex-shrink-0 text-center min-w-[90px]">
              <p className="text-2xl font-bold text-blue-600">{enrichedSchemes.length}</p>
              <p className="text-[10px] text-gray-500">Total</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex-shrink-0 text-center min-w-[90px]">
              <p className="text-2xl font-bold text-green-600">{popularSchemes.length}</p>
              <p className="text-[10px] text-gray-500">Popular</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex-shrink-0 text-center min-w-[90px]">
              <p className="text-2xl font-bold text-purple-600">{centralSchemes.length}</p>
              <p className="text-[10px] text-gray-500">Central</p>
            </div>
          </div>
        )}

        {/* Showcase Sections */}
        {page === 1 && !searchInput && activeCategory === 'all' && !selectedState && !selectedOccupation && !isLoading && !error && (
          <>
            {popularSchemes.length > 0 && (
              <section className="mb-6" aria-label="Popular schemes">
                <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <span className="text-lg" aria-hidden="true">⭐</span> Popular Schemes
                  <span className="text-xs text-gray-400 font-normal ml-1">लोकप्रिय योजनाएं</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {popularSchemes.map((scheme) => (
                    <Link
                      key={scheme.id}
                      href={`/government-schemes/${scheme.id}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow group focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2" style={{ backgroundColor: scheme.color + '20' }}>
                        {scheme.icon}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {scheme.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{scheme.titleHindi}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {latestSchemes.length > 0 && (
              <section className="mb-6" aria-label="Latest schemes">
                <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <span className="text-lg" aria-hidden="true">🆕</span> Latest Schemes
                  <span className="text-xs text-gray-400 font-normal ml-1">नवीनतम योजनाएं</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {latestSchemes.map((scheme) => (
                    <Link
                      key={scheme.id}
                      href={`/government-schemes/${scheme.id}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow group focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2" style={{ backgroundColor: scheme.color + '20' }}>
                        {scheme.icon}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {scheme.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{scheme.titleHindi}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {centralSchemes.length > 0 && (
              <section className="mb-6" aria-label="Central schemes">
                <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <span className="text-lg" aria-hidden="true">🏛️</span> Central Schemes
                  <span className="text-xs text-gray-400 font-normal ml-1">केंद्रीय योजनाएं</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {centralSchemes.map((scheme) => (
                    <Link
                      key={scheme.id}
                      href={`/government-schemes/${scheme.id}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow group focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2" style={{ backgroundColor: scheme.color + '20' }}>
                        {scheme.icon}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {scheme.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{scheme.titleHindi}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-2 overflow-x-auto flex-1 pb-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-full text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  activeCategory === cat.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                }`}
                aria-pressed={activeCategory === cat.key}
                aria-label={`Filter by ${cat.label}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              showFilters || activeFilterCount > 0 || activeSort !== 'name'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
            aria-controls="scheme-filters-panel"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>

          <button
            onClick={() => setShowEligibility(!showEligibility)}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle eligibility checker"
            aria-expanded={showEligibility}
            aria-controls="eligibility-checker-panel"
          >
            🔍 Check
          </button>
        </div>

        {/* Eligibility Checker (inline) */}
        {showEligibility && (
          <div id="eligibility-checker-panel" className="mb-4" role="region" aria-label="Eligibility checker">
            <EligibilityChecker />
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div id="scheme-filters-panel" role="region" aria-label="Scheme filters" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label htmlFor="state-filter" className="text-xs font-semibold text-gray-600 mb-1 block">
                  State / राज्य
                </label>
                <select
                  id="state-filter"
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Filter by state"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="occupation-filter" className="text-xs font-semibold text-gray-600 mb-1 block">
                  Occupation / Group / व्यवसाय
                </label>
                <select
                  id="occupation-filter"
                  value={selectedOccupation}
                  onChange={(e) => { setSelectedOccupation(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Filter by occupation or group"
                >
                  {OCCUPATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="income-filter" className="text-xs font-semibold text-gray-600 mb-1 block">
                  Income Range / आय सीमा
                </label>
                <select
                  id="income-filter"
                  value={selectedIncome}
                  onChange={(e) => { setSelectedIncome(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Filter by income range"
                >
                  {INCOME_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sort-filter" className="text-xs font-semibold text-gray-600 mb-1 block">
                  Sort By / क्रमबद्ध करें
                </label>
                <div className="flex gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setActiveSort(opt.key); setPage(1); }}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        activeSort === opt.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50'
                      }`}
                      aria-pressed={activeSort === opt.key}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <LoadingSpinner message="Loading schemes..." messageHindi="योजनाएं लोड हो रही हैं..." />
        )}

        {/* Error */}
        {error && !isLoading && (
          <ErrorAlert message={error.message} messageHindi="योजनाओं को लोड करने में विफल" onRetry={refetch} />
        )}

        {/* Scheme List */}
        {!isLoading && !error && paginatedSchemes.length > 0 && (
          <section aria-label="Scheme list" role="region" aria-live="polite">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500" role="status">
                {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} found
                {searchInput && ` for "${searchInput}"`}
                {activeCategory !== 'all' && ` in ${CATEGORIES.find((c) => c.key === activeCategory)?.label}`}
              </p>
              <ShareButton title="Government Schemes — GramSeva" text="Explore government schemes on GramSeva" />
            </div>

            <div className="space-y-3">
              {paginatedSchemes.map((scheme) => (
                <Link
                  key={scheme.id}
                  href={`/government-schemes/${scheme.id}`}
                  className="flex items-start gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: scheme.color + '20' }}
                  >
                    {scheme.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">
                          {scheme.title}
                          <SmartBadges scheme={{
                            id: scheme.id,
                            created_at: scheme.created_at,
                            updated_at: scheme.updated_at,
                            last_date: scheme.last_date,
                            isFeatured: scheme.isFeatured,
                          }} />
                        </h3>
                        {scheme.titleHindi && (
                          <p className="text-xs text-gray-400 mt-0.5">{scheme.titleHindi}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {scheme.about && (
                      <p className="text-xs text-gray-500 leading-relaxed mt-1.5 line-clamp-2">
                        {scheme.about}
                      </p>
                    )}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium capitalize">
                        {scheme.category}
                      </span>
                      {scheme.last_date && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">
                          Due: {scheme.last_date}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Previous page"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50'
                      }`}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={page === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Next page"
                >
                  Next →
                </button>
              </nav>
            )}
          </section>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredSchemes.length === 0 && (
          <EmptyState
            icon="🏛️"
            title={searchInput || activeCategory !== 'all' ? 'No schemes matching your filters' : 'No schemes found'}
            titleHindi="आपके फ़िल्टर से मेल खाने वाली कोई योजना नहीं"
            description={
              searchInput
                ? `No results for "${searchInput}". Try a different search term.`
                : 'No government schemes are currently available.'
            }
            action={
              searchInput || activeCategory !== 'all' || selectedState || selectedOccupation || selectedIncome
                ? { label: 'Clear Filters / फ़िल्टर साफ़ करें', onClick: () => { setSearchInput(''); setActiveCategory('all'); setSelectedState(''); setSelectedOccupation(''); setSelectedIncome(''); setPage(1); } }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { schemeService, type Scheme } from '@/lib/services/schemeService';
import { queryKeys } from '@/lib/queryKeys';
import { SCHEME_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb, ShareButton } from '@/components/agriculture';

// ─── Constants ────────────────────────────────────────────────────────────────

const agricultureKeywords = [
  'krishi', 'kisan', 'farm', 'agri', 'crop', 'fertilizer', 'irrigation',
  'sinchai', 'fasal', 'bima', 'kcc', 'credit', 'mandi', 'dairy',
  'livestock', 'poultry', 'fisheries', 'horticulture', 'organic',
  'seed', 'harvest', 'storage', 'food', 'nutrition',
];

const categories = [
  { key: 'all', label: 'All', labelHindi: 'सभी' },
  { key: 'income', label: 'Income Support', labelHindi: 'आय सहायता' },
  { key: 'insurance', label: 'Insurance', labelHindi: 'बीमा' },
  { key: 'credit', label: 'Credit', labelHindi: 'ऋण' },
  { key: 'infrastructure', label: 'Infrastructure', labelHindi: 'बुनियादी ढांचा' },
  { key: 'soil', label: 'Soil & Seeds', labelHindi: 'मिट्टी और बीज' },
  { key: 'market', label: 'Market Access', labelHindi: 'बाजार' },
];

const categoryKeywords: Record<string, string[]> = {
  income: ['pm kisan', 'income', 'support', 'kcc', 'credit'],
  insurance: ['bima', 'insurance', 'pmfby', 'crop insurance'],
  credit: ['credit', 'kcc', 'loan', 'karz', 'financ'],
  infrastructure: ['pmksy', 'kusum', 'irrigation', 'solar', 'pump', 'cold', 'storage'],
  soil: ['soil', 'health', 'seed', 'organic', 'fertilizer', 'manure'],
  market: ['mandi', 'market', 'enam', 'apmc', 'price', 'procurement'],
};

const schemeIcons: Record<string, { icon: string; color: string }> = {
  pm_kisan: { icon: '💰', color: '#2E7D32' },
  pmfby: { icon: '🛡️', color: '#1565C0' },
  kcc: { icon: '💳', color: '#6A1B9A' },
  pmksy: { icon: '💧', color: '#00695C' },
  soil_health: { icon: '🌱', color: '#F57F17' },
  enam: { icon: '📊', color: '#BF360C' },
  pm_kusum: { icon: '⚡', color: '#FF6F00' },
  rkvvy: { icon: '🚜', color: '#283593' },
};

const PAGE_SIZE = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function enrichScheme(record: Scheme) {
  const meta = schemeIcons[record.id] || { icon: '🏛️', color: '#2E7D32' };
  return {
    ...record,
    title: record.id
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    icon: meta.icon,
    color: meta.color,
  };
}

function isAgricultureRelated(record: Scheme): boolean {
  const searchable = [record.id, record.category, record.about]
    .join(' ')
    .toLowerCase();
  return agricultureKeywords.some((kw) => searchable.includes(kw));
}

function matchesCategory(record: Scheme, category: string): boolean {
  if (category === 'all') return true;
  const searchable = [record.id, record.category, record.about]
    .join(' ')
    .toLowerCase();
  return (categoryKeywords[category] || []).some((kw) => searchable.includes(kw));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgricultureSchemesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: schemes,
    isLoading,
    error,
    refetch,
  } = useQuery<Scheme[]>(
    queryKeys.schemes.list('agriculture'),
    () => schemeService.list({ category: 'agriculture' }),
    { staleTime: SCHEME_STALE_TIME },
  );

  const { data: allSchemes, isLoading: allLoading } = useQuery<Scheme[]>(
    queryKeys.schemes.list(),
    () => schemeService.list(),
    {
      staleTime: SCHEME_STALE_TIME,
      enabled: !isLoading && schemes !== undefined && schemes.length === 0,
    },
  );

  const enrichedSchemes = useMemo(() => {
    const source = schemes && schemes.length > 0 ? schemes : allSchemes || [];
    return source.filter(isAgricultureRelated).map(enrichScheme);
  }, [schemes, allSchemes]);

  const filteredSchemes = useMemo(() => {
    return enrichedSchemes.filter((s) => {
      const matchesSearch =
        !searchInput.trim() ||
        s.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        (s.about && s.about.toLowerCase().includes(searchInput.toLowerCase()));
      const matchesCat = matchesCategory(s, activeCategory);
      return matchesSearch && matchesCat;
    });
  }, [enrichedSchemes, searchInput, activeCategory]);

  const paginatedSchemes = useMemo(() => {
    return filteredSchemes.slice(0, PAGE_SIZE);
  }, [filteredSchemes]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const isLoadingAll = isLoading || allLoading;

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="Agriculture Schemes"
        titleHindi="कृषि योजनाएं"
        icon="🏛️"
        gradient="linear-gradient(135deg, #4A148C, #7B1FA2)"
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agriculture', href: '/agriculture' }, { label: 'Schemes' }]} />

      <div className="px-4 py-4">
        <div className="flex justify-end mb-3">
          <ShareButton title="Agriculture Schemes — GramSeva" text="Check out agriculture schemes on GramSeva" />
        </div>
        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search schemes / योजनाएं खोजें"
            aria-label="Search schemes"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-purple-200 transition-shadow"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat.key
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:border-purple-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoadingAll && (
          <LoadingSpinner message="Loading schemes..." messageHindi="योजनाएं लोड हो रही हैं..." />
        )}

        {/* Error */}
        {error && !isLoadingAll && (
          <ErrorAlert
            message={error.message}
            messageHindi="योजनाओं को लोड करने में विफल"
            onRetry={refetch}
          />
        )}

        {/* Schemes */}
        {!isLoadingAll && !error && filteredSchemes.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mb-3">
              {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} found
              {activeCategory !== 'all' && ` in ${categories.find((c) => c.key === activeCategory)?.label}`}
            </p>
            <div className="space-y-3">
              {paginatedSchemes.map((scheme) => {
                const isExpanded = expandedId === scheme.id;
                return (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleExpand(scheme.id)}
                      aria-expanded={isExpanded}
                      className="w-full text-left p-4 flex items-start gap-3"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: scheme.color + '20' }}
                      >
                        {scheme.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">
                          {scheme.title}
                        </h3>
                        {scheme.about && (
                          <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-2">
                            {scheme.about.substring(0, 120)}
                            {scheme.about.length > 120 ? '...' : ''}
                          </p>
                        )}
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                        {scheme.about && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-gray-600 mb-1">About / विवरण</h4>
                            <p className="text-xs text-gray-700 leading-relaxed">{scheme.about}</p>
                          </div>
                        )}

                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-600 mb-1">Eligibility / पात्रता</h4>
                          <ul className="text-xs text-gray-700 space-y-0.5">
                            <li>• All Indian farmers (individual / joint cultivator)</li>
                            <li>• Must have valid Aadhaar card</li>
                            <li>• Must have bank account linked to Aadhaar</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-600 mb-1">Benefits / लाभ</h4>
                          <ul className="text-xs text-gray-700 space-y-0.5">
                            <li>• Direct income support to farmer&apos;s bank account</li>
                            <li>• Three equal installments per year</li>
                            <li>• Covers input cost for crops</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-600 mb-1">Documents / दस्तावेज़</h4>
                          <ul className="text-xs text-gray-700 space-y-0.5">
                            <li>• Aadhaar card</li>
                            <li>• Bank passbook</li>
                            <li>• Land records (khasra / khatauni)</li>
                          </ul>
                        </div>

                        {/* Related Schemes */}
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-600 mb-1">Related / संबंधित योजनाएं</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {enrichedSchemes
                              .filter((s) => s.id !== scheme.id)
                              .slice(0, 3)
                              .map((rs) => (
                                <span
                                  key={rs.id}
                                  className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] rounded-full font-medium"
                                >
                                  {rs.icon} {rs.title}
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href="https://pmkisan.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 text-white text-center hover:bg-purple-700 transition-colors"
                          >
                            Apply / आवेदन
                          </a>
                          <a
                            href="tel:18001801551"
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            Help
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {filteredSchemes.length > PAGE_SIZE && paginatedSchemes.length < filteredSchemes.length && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 mb-2">
                  Showing {paginatedSchemes.length} of {filteredSchemes.length} schemes
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!isLoadingAll && !error && filteredSchemes.length === 0 && (
          <EmptyState
            icon="🏛️"
            title="No agriculture schemes found"
            titleHindi="कोई कृषि योजना नहीं मिली"
            description={searchInput ? 'Try a different search term or category' : undefined}
          />
        )}
      </div>
    </div>
  );
}

// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type Helpline } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/emergency/BookmarkButton';
import SmartBadges from '@/components/emergency/SmartBadges';
import ShareActions from '@/components/emergency/ShareActions';
import { useAdvancedSearch, useDebouncedSearch } from '@/components/emergency/useAdvancedSearch';

const CATEGORIES = ['All', 'Women', 'Child', 'Senior Citizen', 'Mental Health', 'Farmer', 'Cyber Crime', 'Railway', 'Electricity', 'Gas Leakage', 'Animal'];

const HELPLINE_BADGES: Record<string, { isNational?: boolean; isGovernment?: boolean; isMostUsed?: boolean; isVerified?: boolean }> = {
  women_1091: { isNational: true, isGovernment: true, isMostUsed: true },
  women_181: { isNational: true, isGovernment: true },
  child_1098: { isNational: true, isGovernment: true, isMostUsed: true },
  senior_14567: { isNational: true, isGovernment: true },
  mental_health: { isNational: true, isGovernment: true },
  farmer_kisan: { isNational: true, isGovernment: true, isMostUsed: true },
  cyber_1930: { isNational: true, isGovernment: true, isMostUsed: true },
  railway_139: { isNational: true, isGovernment: true },
  electricity_1912: { isNational: true, isGovernment: true },
  gas_1906: { isNational: true, isGovernment: true },
  animal_1962: { isNational: true, isGovernment: true },
};

export default function HelplinesPage() {
  const [category, setCategory] = useState('All');
  const { search, debouncedSearch, handleSearchChange } = useDebouncedSearch();

  const { data: helplines, isLoading, error, refetch } = useQuery<Helpline[]>(
    queryKeys.emergency.helplines(category === 'All' ? undefined : category),
    () => emergencyService.getHelplines(category === 'All' ? undefined : category),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const filtered = useAdvancedSearch({
    data: helplines ?? [],
    query: debouncedSearch,
    fields: ['title', 'titleHindi', 'number', 'category', 'description', 'descriptionHindi'],
    minQueryLength: 0,
  });

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Helplines" titleHindi="हेल्पलाइन" icon="☎️" gradient="linear-gradient(135deg, #6A1B9A, #8E24AA)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Emergency', href: '/emergency' }, { label: 'Helplines' }]} />

      <div className="px-4 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, number, or category... / नाम, नंबर या श्रेणी से खोजें..."
            className="flex-1 px-4 py-2.5 pl-10 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Search helplines"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: '12px center', backgroundSize: '16px' }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${category === c ? 'bg-purple-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'}`}
              aria-pressed={category === c}
            >
              {c === 'All' ? 'All / सभी' : c}
            </button>
          ))}
        </div>

        {isLoading && <LoadingSpinner message="Loading helplines..." messageHindi="हेल्पलाइन लोड हो रही हैं..." />}
        {!isLoading && error && <ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={handleRetry} />}

        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState icon="☎️" title="No helplines found" titleHindi="कोई हेल्पलाइन नहीं मिली" description="Try adjusting your search or category filter" descriptionHindi="अपनी खोज या श्रेणी फ़िल्टर समायोजित करें" />
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3" aria-live="polite" aria-label="Helplines list">
            {filtered.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={h.title}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-purple-100">
                    <span aria-hidden="true">{h.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{h.title}</h3>
                        <p className="text-xs text-gray-500">{h.titleHindi}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{h.category}</span>
                        <SmartBadges item={HELPLINE_BADGES[h.id] ?? { isGovernment: true, isVerified: true }} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{h.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.descriptionHindi}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <BookmarkButton itemId={`helpline_${h.id}`} />
                </div>

                <ShareActions title={h.title} number={h.number} category={h.category} />

                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${h.number}`}
                    className="flex-1 py-2.5 bg-purple-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                    aria-label={`Call ${h.title} at ${h.number}`}
                  >
                    📞 Call / कॉल करें
                  </a>
                </div>

                <div className="mt-2 bg-purple-50 rounded-xl p-2 text-center">
                  <span className="text-sm font-bold tracking-widest text-purple-700">{h.number}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

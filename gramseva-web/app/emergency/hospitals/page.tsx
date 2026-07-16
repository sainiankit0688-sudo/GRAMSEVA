// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type Hospital } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/emergency/BookmarkButton';
import SmartBadges from '@/components/emergency/SmartBadges';
import ShareActions from '@/components/emergency/ShareActions';
import { useAdvancedSearch, useDebouncedSearch } from '@/components/emergency/useAdvancedSearch';

const STATES = ['All', 'Delhi', 'Uttar Pradesh', 'Gujarat', 'Maharashtra', 'Telangana', 'Chandigarh', 'Puducherry', 'Tamil Nadu'];

export default function HospitalsPage() {
  const [state, setState] = useState('All');
  const { search, debouncedSearch, handleSearchChange } = useDebouncedSearch();

  const { data: hospitals, isLoading, error, refetch } = useQuery<Hospital[]>(
    queryKeys.emergency.hospitals(state === 'All' ? undefined : state),
    () => emergencyService.getHospitals(state === 'All' ? undefined : state),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const filtered = useAdvancedSearch({
    data: hospitals ?? [],
    query: debouncedSearch,
    fields: ['name', 'address', 'district', 'state', 'phone'],
    minQueryLength: 0,
  });

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Hospitals" titleHindi="अस्पताल" icon="🏥" gradient="linear-gradient(135deg, #2E7D32, #43A047)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Emergency', href: '/emergency' }, { label: 'Hospitals' }]} />

      <div className="px-4 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search hospitals... / अस्पताल खोजें..."
            className="flex-1 px-4 py-2.5 pl-10 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Search hospitals"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: '12px center', backgroundSize: '16px' }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 ${state === s ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'}`}
              aria-pressed={state === s}
            >
              {s === 'All' ? 'All / सभी' : s}
            </button>
          ))}
        </div>

        {isLoading && <LoadingSpinner message="Loading hospitals..." messageHindi="अस्पताल लोड हो रहे हैं..." />}
        {!isLoading && error && <ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={handleRetry} />}

        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState icon="🏥" title="No hospitals found" titleHindi="कोई अस्पताल नहीं मिला" description="Try adjusting your search or state filter" descriptionHindi="अपनी खोज या राज्य फ़िल्टर समायोजित करें" />
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3" aria-live="polite" aria-label="Hospitals list">
            {filtered.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={h.name}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-green-100">
                    <span aria-hidden="true">🏥</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm">{h.name}</h3>
                    <p className="text-xs text-gray-500">{h.address}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{h.district}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{h.state}</span>
                      <SmartBadges item={{ is24x7: h.is24x7, emergencyAvailable: h.emergencyAvailable }} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <BookmarkButton itemId={`hospital_${h.id}`} />
                </div>

                <ShareActions title={h.name} number={h.phone} category={h.state} />

                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${h.phone}`}
                    className="flex-1 py-2.5 bg-green-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                    aria-label={`Call ${h.name} at ${h.phone}`}
                  >
                    📞 Call / कॉल करें
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(h.name)}+${encodeURIComponent(h.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={`View ${h.name} on Google Maps`}
                  >
                    🗺️ Map / नक्शा
                  </a>
                </div>

                <div className="mt-2 bg-gray-50 rounded-xl p-2 text-center">
                  <span className="text-sm font-semibold text-gray-700">{h.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

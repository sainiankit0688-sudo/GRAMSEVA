// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type PoliceStation } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/emergency/BookmarkButton';
import SmartBadges from '@/components/emergency/SmartBadges';
import ShareActions from '@/components/emergency/ShareActions';

const DISTRICTS = ['All', 'Gorakhpur', 'Lucknow', 'Varanasi', 'Prayagraj', 'Gautam Buddha Nagar', 'Kanpur Nagar', 'Agra', 'Meerut', 'Patna', 'Bhopal'];

export default function PolicePage() {
  const [district, setDistrict] = useState('All');

  const { data: stations, isLoading, error, refetch } = useQuery<PoliceStation[]>(
    queryKeys.emergency.police(district === 'All' ? undefined : district),
    () => emergencyService.getPoliceStations(district === 'All' ? undefined : district),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Police Stations" titleHindi="पुलिस स्टेशन" icon="👮" gradient="linear-gradient(135deg, #1565C0, #1976D2)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Emergency', href: '/emergency' }, { label: 'Police' }]} />

      <div className="px-4 py-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {DISTRICTS.map((d) => (
            <button
              key={d}
              onClick={() => setDistrict(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${district === d ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
              aria-pressed={district === d}
            >
              {d === 'All' ? 'All / सभी' : d}
            </button>
          ))}
        </div>

        {isLoading && <LoadingSpinner message="Loading police stations..." messageHindi="पुलिस स्टेशन लोड हो रहे हैं..." />}
        {!isLoading && error && <ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={handleRetry} />}

        {!isLoading && !error && stations && stations.length === 0 && (
          <EmptyState icon="👮" title="No police stations found" titleHindi="कोई पुलिस स्टेशन नहीं मिला" />
        )}

        {!isLoading && !error && stations && stations.length > 0 && (
          <div className="flex flex-col gap-3" aria-live="polite" aria-label="Police stations list">
            {stations.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={s.name}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-blue-100">
                    <span aria-hidden="true">👮</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm">{s.name}</h3>
                    <p className="text-xs text-gray-500">{s.address}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full inline-block mt-1">{s.district}</span>
                    <SmartBadges item={{ isGovernment: true }} />
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <BookmarkButton itemId={`police_${s.id}`} />
                </div>

                <ShareActions title={s.name} number={s.phone} category={s.district} />

                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${s.phone}`}
                    className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={`Call ${s.name} at ${s.phone}`}
                  >
                    📞 Call / कॉल करें
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(s.name)}+${encodeURIComponent(s.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl text-center hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={`View on map`}
                  >
                    🗺️ Map
                  </a>
                </div>

                <div className="mt-2 bg-blue-50 rounded-xl p-2 text-center">
                  <span className="text-sm font-bold text-blue-700">{s.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type FireStation } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/emergency/BookmarkButton';
import SmartBadges from '@/components/emergency/SmartBadges';
import ShareActions from '@/components/emergency/ShareActions';

export default function FirePage() {
  const { data: stations, isLoading, error, refetch } = useQuery<FireStation[]>(
    queryKeys.emergency.fire(),
    () => emergencyService.getFireStations(),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Fire Brigade" titleHindi="दमकल" icon="🚒" gradient="linear-gradient(135deg, #E65100, #F57C00)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Emergency', href: '/emergency' }, { label: 'Fire Brigade' }]} />

      <div className="px-4 py-4 space-y-4">
        {isLoading && <LoadingSpinner message="Loading fire stations..." messageHindi="दमकल स्टेशन लोड हो रहे हैं..." />}
        {!isLoading && error && <ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={handleRetry} />}

        {!isLoading && !error && stations && stations.length === 0 && (
          <EmptyState icon="🚒" title="No fire stations found" titleHindi="कोई दमकल स्टेशन नहीं मिला" />
        )}

        {!isLoading && !error && stations && stations.length > 0 && (
          <div className="flex flex-col gap-3" aria-live="polite" aria-label="Fire stations list">
            {stations.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={s.name}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-orange-100">
                    <span aria-hidden="true">🚒</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm">{s.name}</h3>
                    <p className="text-xs text-gray-500">{s.address}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">📍 {s.coverageArea}</span>
                      <SmartBadges item={{ isGovernment: true, is24x7: true }} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <BookmarkButton itemId={`fire_${s.id}`} />
                </div>

                <ShareActions title={s.name} number={s.phone} category={s.coverageArea} />

                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${s.phone}`}
                    className="flex-1 py-2.5 bg-orange-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                    aria-label={`Call ${s.name} at ${s.phone}`}
                  >
                    📞 Call / कॉल करें
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(s.name)}+${encodeURIComponent(s.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded-xl text-center hover:bg-orange-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                    aria-label={`View on map`}
                  >
                    🗺️ Map
                  </a>
                </div>

                <div className="mt-2 bg-orange-50 rounded-xl p-2 text-center">
                  <span className="text-sm font-bold text-orange-700">{s.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2">
          <span aria-hidden="true">🔥</span>
          <p className="text-xs text-yellow-800">
            In case of fire, call 101 immediately. Evacuate the building, stay low to avoid smoke, and never use elevators.
            / आग लगने की स्थिति में तुरंत 101 पर कॉल करें। इमारत खाली करें, धुएं से बचने के लिए नीचे रहें, और कभी भी लिफ्ट का उपयोग न करें।
          </p>
        </div>
      </div>
    </div>
  );
}

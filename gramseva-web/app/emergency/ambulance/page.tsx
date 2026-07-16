// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type AmbulanceProvider } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/emergency/BookmarkButton';
import SmartBadges from '@/components/emergency/SmartBadges';
import ShareActions from '@/components/emergency/ShareActions';

const TYPES = ['All', 'Govt', 'Private', 'NGO'];
const TYPE_COLORS: Record<string, string> = {
  Govt: 'bg-green-100 text-green-700',
  Private: 'bg-blue-100 text-blue-700',
  NGO: 'bg-purple-100 text-purple-700',
};

export default function AmbulancePage() {
  const [type, setType] = useState('All');

  const { data: providers, isLoading, error, refetch } = useQuery<AmbulanceProvider[]>(
    queryKeys.emergency.ambulance(type === 'All' ? undefined : type),
    () => emergencyService.getAmbulanceProviders(type === 'All' ? undefined : type),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Ambulance Services" titleHindi="एम्बुलेंस सेवाएं" icon="🚑" gradient="linear-gradient(135deg, #C62828, #E53935)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Emergency', href: '/emergency' }, { label: 'Ambulance' }]} />

      <div className="px-4 py-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ${type === t ? 'bg-red-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'}`}
              aria-pressed={type === t}
            >
              {t === 'All' ? 'All / सभी' : t}
            </button>
          ))}
        </div>

        {isLoading && <LoadingSpinner message="Loading ambulance providers..." messageHindi="एम्बुलेंस सेवाएं लोड हो रही हैं..." />}
        {!isLoading && error && <ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={handleRetry} />}

        {!isLoading && !error && providers && providers.length === 0 && (
          <EmptyState icon="🚑" title="No providers found" titleHindi="कोई सेवा प्रदाता नहीं मिला" />
        )}

        {!isLoading && !error && providers && providers.length > 0 && (
          <div className="flex flex-col gap-3" aria-live="polite" aria-label="Ambulance providers list">
            {providers.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={p.name}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-red-100">
                    <span aria-hidden="true">🚑</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{p.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block mt-1 ${TYPE_COLORS[p.type]}`}>{p.type}</span>
                      </div>
                      <SmartBadges item={{ is24x7: p.is24x7, isGovernment: p.type === 'Govt' }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{p.description}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <BookmarkButton itemId={`ambulance_${p.id}`} />
                </div>

                <ShareActions title={p.name} number={p.number} category={p.type} />

                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${p.number}`}
                    className="flex-1 py-2.5 bg-red-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Call ${p.name} at ${p.number}`}
                  >
                    📞 Call / कॉल करें
                  </a>
                </div>

                <div className="mt-2 bg-red-50 rounded-xl p-2 text-center">
                  <span className="text-lg font-bold tracking-widest text-red-700">{p.number}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

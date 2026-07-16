// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type EmergencyContact } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/emergency/BookmarkButton';
import SmartBadges from '@/components/emergency/SmartBadges';
import ShareActions from '@/components/emergency/ShareActions';
import { useAdvancedSearch, useDebouncedSearch } from '@/components/emergency/useAdvancedSearch';

const CONTACT_BADGES = {
  '112': { isNational: true, isMostUsed: true },
  '100': { isNational: true, isMostUsed: true },
  '101': { isNational: true, isMostUsed: true },
  '108': { isNational: true, isMostUsed: true },
  '1098': { isNational: true },
  '1930': { isNational: true },
  '1078': { isNational: true },
  '1070': { isState: true },
  '181': { isNational: true },
};

export default function EmergencyContactsPage() {
  const { search, debouncedSearch, handleSearchChange } = useDebouncedSearch();

  const { data: contacts, isLoading, error, refetch } = useQuery<EmergencyContact[]>(
    queryKeys.emergency.contacts(),
    () => emergencyService.getEmergencyContacts(),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const filtered = useAdvancedSearch({
    data: contacts ?? [],
    query: debouncedSearch,
    fields: ['title', 'titleHindi', 'number', 'description', 'descriptionHindi'],
    minQueryLength: 0,
  });

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Emergency Contacts" titleHindi="आपातकालीन संपर्क" icon="📞" gradient="linear-gradient(135deg, #B71C1C, #C62828)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Emergency', href: '/emergency' }, { label: 'Emergency Contacts' }]} />

      <div className="px-4 py-4 space-y-4">
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name or number... / नाम या नंबर से खोजें..."
          className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Search emergency contacts"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: '12px center', backgroundSize: '16px' }}
        />

        {isLoading && <LoadingSpinner message="Loading contacts..." messageHindi="संपर्क लोड हो रहे हैं..." />}
        {!isLoading && error && <ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={handleRetry} />}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl" aria-hidden="true">📭</span>
            <p className="text-sm text-gray-600 mt-2">No contacts found / कोई संपर्क नहीं मिला</p>
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3" aria-live="polite" aria-label="Emergency contacts list">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={`${c.title}: ${c.number}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: c.color + '20' }}>
                    <span aria-hidden="true">{c.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{c.title}</h3>
                        <p className="text-xs text-gray-500">{c.titleHindi}</p>
                      </div>
                      <SmartBadges item={CONTACT_BADGES[c.id as keyof typeof CONTACT_BADGES] ?? {}} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{c.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.descriptionHindi}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <BookmarkButton itemId={`contact_${c.id}`} />
                </div>

                <ShareActions title={c.title} number={c.number} />

                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${c.number}`}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white text-center transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: c.color }}
                    aria-label={`Call ${c.title} at ${c.number}`}
                  >
                    📞 Call / कॉल करें
                  </a>
                </div>

                <div className="mt-2 bg-gray-50 rounded-xl p-2 text-center">
                  <span className="text-lg font-bold tracking-widest" style={{ color: c.color }}>{c.number}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

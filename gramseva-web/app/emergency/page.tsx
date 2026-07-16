// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type EmergencyContact } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert } from '@/components/agriculture';
import OfflineCards from '@/components/emergency/OfflineCards';
import FamilyEmergencyPlan from '@/components/emergency/FamilyEmergencyPlan';
import NearbyUpgrade from '@/components/emergency/NearbyUpgrade';

interface DashboardCard {
  title: string;
  titleHindi: string;
  icon: string;
  color: string;
  href: string;
  description: string;
}

const DASHBOARD_CARDS: DashboardCard[] = [
  { title: 'Emergency Contacts', titleHindi: 'आपातकालीन संपर्क', icon: '📞', color: '#B71C1C', href: '/emergency/emergency-contacts', description: '112, 100, 101, 102, 108 & more' },
  { title: 'Ambulance', titleHindi: 'एम्बुलेंस', icon: '🚑', color: '#C62828', href: '/emergency/ambulance', description: '108, 102, Private & NGO' },
  { title: 'Hospitals', titleHindi: 'अस्पताल', icon: '🏥', color: '#2E7D32', href: '/emergency/hospitals', description: 'Search hospitals near you' },
  { title: 'Police', titleHindi: 'पुलिस', icon: '👮', color: '#1565C0', href: '/emergency/police', description: 'Police stations directory' },
  { title: 'Fire Brigade', titleHindi: 'दमकल', icon: '🚒', color: '#E65100', href: '/emergency/fire', description: 'Fire stations & coverage' },
  { title: 'Disaster Management', titleHindi: 'आपदा प्रबंधन', icon: '🌪️', color: '#00695C', href: '/emergency/disaster', description: 'Flood, Fire, Earthquake & more' },
  { title: 'Helplines', titleHindi: 'हेल्पलाइन', icon: '☎️', color: '#6A1B9A', href: '/emergency/helplines', description: 'Women, Child, Mental Health & more' },
  { title: 'Nearby Services', titleHindi: 'नजदीकी सेवाएं', icon: '📍', color: '#00838F', href: '#nearby', description: 'Find nearby hospitals & police' },
];

export default function EmergencyDashboard() {
  const { data: contacts, isLoading, error, refetch } = useQuery<EmergencyContact[]>(
    queryKeys.emergency.contacts(),
    () => emergencyService.getEmergencyContacts(),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Emergency Services" titleHindi="आपातकालीन सेवाएं" icon="🚨" gradient="linear-gradient(135deg, #B71C1C, #C62828)">
        <p className="text-red-100 text-xs mt-2">Tap any number to call immediately / नंबर दबाएं और कॉल करें</p>
      </PageHeader>

      {isLoading && <LoadingSpinner message="Loading emergency contacts..." messageHindi="आपातकालीन संपर्क लोड हो रहे हैं..." />}
      {!isLoading && error && <div className="px-4 mt-4"><ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={handleRetry} /></div>}
      {!isLoading && !error && contacts && (
        <div className="px-4 mt-4">
          <div className="bg-red-600 rounded-2xl p-4 shadow-lg">
            <h2 className="text-white text-sm font-bold mb-3" id="quick-dial-heading">Quick Dial / त्वरित डायल</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="list" aria-labelledby="quick-dial-heading">
              {contacts.slice(0, 4).map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.number}`}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label={`Call ${c.title} at ${c.number}`}
                  role="listitem"
                >
                  <span className="text-2xl" aria-hidden="true">{c.icon}</span>
                  <p className="text-white text-xs font-semibold mt-1">{c.titleHindi}</p>
                  <p className="text-white text-lg font-bold mt-0.5">{c.number}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 mt-6 pb-8 space-y-4">
        <h2 className="text-base font-bold text-gray-800">Services / सेवाएं</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DASHBOARD_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label={`${card.title} — ${card.description}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: card.color + '15' }}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm">{card.title}</h3>
                  <p className="text-xs text-gray-500">{card.titleHindi}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{card.description}</p>
                </div>
                <span className="text-gray-300 text-lg flex-shrink-0" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Offline Cards */}
        <OfflineCards />

        {/* Family Emergency Plan */}
        <FamilyEmergencyPlan />

        {/* Nearby Services */}
        <div id="nearby" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <NearbyUpgrade />
        </div>

        {/* Safety Tip */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2">
          <span aria-hidden="true">⚠️</span>
          <p className="text-xs text-yellow-800">
            All helpline calls are free from any mobile/landline. In emergency, dial 112 for immediate assistance from police, fire, or ambulance.
            / सभी हेल्पलाइन कॉल किसी भी मोबाइल/लैंडलाइन से मुफ्त हैं। आपातकाल में, पुलिस, दमकल या एम्बुलेंस से तत्काल सहायता के लिए 112 डायल करें।
          </p>
        </div>
      </div>
    </div>
  );
}

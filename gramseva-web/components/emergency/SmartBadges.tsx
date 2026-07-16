// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useMemo } from 'react';

interface EmergencyBadge {
  label: string;
  labelHindi: string;
  variant: 'verified' | 'government' | 'emergency' | 'nearby' | 'most_used' | 'national' | 'state' | 'round_the_clock';
}

interface SmartBadgesProps {
  item: {
    is24x7?: boolean;
    emergencyAvailable?: boolean;
    type?: string;
    coverageArea?: string;
    category?: string;
    isVerified?: boolean;
    isGovernment?: boolean;
    isNational?: boolean;
    isState?: boolean;
    isMostUsed?: boolean;
  };
}

function getBadges(item: SmartBadgesProps['item']): EmergencyBadge[] {
  const badges: EmergencyBadge[] = [];

  if (item.is24x7) {
    badges.push({ label: '24×7', labelHindi: '24×7', variant: 'round_the_clock' });
  }

  if (item.emergencyAvailable) {
    badges.push({ label: 'Emergency', labelHindi: 'आपातकालीन', variant: 'emergency' });
  }

  if (item.isVerified) {
    badges.push({ label: 'Verified', labelHindi: 'सत्यापित', variant: 'verified' });
  }

  if (item.isGovernment || item.type === 'Govt') {
    badges.push({ label: 'Government', labelHindi: 'सरकारी', variant: 'government' });
  }

  if (item.isNational || item.category === 'National') {
    badges.push({ label: 'National', labelHindi: 'राष्ट्रीय', variant: 'national' });
  }

  if (item.isState || item.category === 'State') {
    badges.push({ label: 'State', labelHindi: 'राज्य', variant: 'state' });
  }

  if (item.isMostUsed) {
    badges.push({ label: 'Most Used', labelHindi: 'सबसे अधिक उपयोग', variant: 'most_used' });
  }

  return badges;
}

const VARIANT_STYLES: Record<EmergencyBadge['variant'], string> = {
  verified: 'bg-green-100 text-green-700',
  government: 'bg-blue-100 text-blue-700',
  emergency: 'bg-red-100 text-red-700',
  round_the_clock: 'bg-indigo-100 text-indigo-700',
  nearby: 'bg-teal-100 text-teal-700',
  most_used: 'bg-yellow-100 text-yellow-700',
  national: 'bg-purple-100 text-purple-700',
  state: 'bg-orange-100 text-orange-700',
};

export default function SmartBadges({ item }: SmartBadgesProps) {
  const badges = useMemo(() => getBadges(item), [item]);

  if (badges.length === 0) return null;

  return (
    <span className="inline-flex gap-1 flex-wrap" role="list" aria-label="Item badges">
      {badges.map((badge) => (
        <span
          key={badge.variant}
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${VARIANT_STYLES[badge.variant]}`}
          title={badge.labelHindi}
          role="listitem"
        >
          {badge.label}
        </span>
      ))}
    </span>
  );
}

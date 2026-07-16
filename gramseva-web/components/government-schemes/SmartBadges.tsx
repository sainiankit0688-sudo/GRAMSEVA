'use client';

/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';

interface SmartBadge {
  label: string;
  labelHindi: string;
  variant: 'new' | 'popular' | 'closing' | 'trending' | 'updated';
}

interface SmartBadgesProps {
  scheme: {
    id: string;
    created_at?: string;
    updated_at?: string;
    last_date?: string;
    isFeatured?: boolean;
  };
}

const MS_PER_DAY = 86400000;

function getBadges(scheme: SmartBadgesProps['scheme']): SmartBadge[] {
  const badges: SmartBadge[] = [];
  const now = Date.now();

  if (scheme.created_at) {
    const age = now - new Date(scheme.created_at).getTime();
    if (age < 14 * MS_PER_DAY) {
      badges.push({ label: 'New', labelHindi: 'नया', variant: 'new' });
    }
  }

  if (scheme.updated_at) {
    const age = now - new Date(scheme.updated_at).getTime();
    if (age < 7 * MS_PER_DAY) {
      badges.push({ label: 'Updated', labelHindi: 'अपडेटेड', variant: 'updated' });
    }
  }

  if (scheme.isFeatured) {
    badges.push({ label: 'Popular', labelHindi: 'लोकप्रिय', variant: 'popular' });
  }

  if (scheme.last_date && scheme.last_date.toLowerCase() !== 'no fixed last date (ongoing scheme)') {
    const dateMatch = scheme.last_date.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
    if (dateMatch) {
      const parts = dateMatch[3].length === 2 ? parseInt('20' + dateMatch[3], 10) : parseInt(dateMatch[3], 10);
      const lastDate = new Date(parts, parseInt(dateMatch[2], 10) - 1, parseInt(dateMatch[1], 10));
      const daysLeft = (lastDate.getTime() - now) / MS_PER_DAY;
      if (daysLeft < 0) {
        badges.push({ label: 'Closed', labelHindi: 'बंद', variant: 'closing' });
      } else if (daysLeft < 30) {
        badges.push({ label: 'Closing Soon', labelHindi: 'जल्द बंद', variant: 'closing' });
      }
    }
  }

  return badges;
}

const VARIANT_STYLES: Record<SmartBadge['variant'], string> = {
  new: 'bg-green-100 text-green-700',
  popular: 'bg-yellow-100 text-yellow-700',
  closing: 'bg-red-100 text-red-700',
  trending: 'bg-purple-100 text-purple-700',
  updated: 'bg-blue-100 text-blue-700',
};

export default function SmartBadges({ scheme }: SmartBadgesProps) {
  const badges = useMemo(() => getBadges(scheme), [scheme]);

  if (badges.length === 0) return null;

  return (
    <span className="inline-flex gap-1.5 flex-wrap">
      {badges.map((badge) => (
        <span
          key={badge.variant}
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${VARIANT_STYLES[badge.variant]}`}
          title={badge.labelHindi}
        >
          {badge.label}
        </span>
      ))}
    </span>
  );
}

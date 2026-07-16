'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';

interface SmartBadge {
  label: string;
  labelHindi: string;
  variant: 'new' | 'popular' | 'closing' | 'featured' | 'closed';
}

interface SmartBadgesProps {
  item: {
    id: string;
    deadline?: string;
    last_date?: string;
    status?: 'Open' | 'Coming' | 'Closed';
    isFeatured?: boolean;
    isPopular?: boolean;
  };
}

const MS_PER_DAY = 86400000;
const LAST_DATE_PASSED: SmartBadge = { label: 'Last Date Passed', labelHindi: 'अंतिम तिथि समाप्त', variant: 'closed' };
const CLOSING_SOON: SmartBadge = { label: 'Closing Soon', labelHindi: 'जल्द बंद', variant: 'closing' };

function pushDateBadge(badges: SmartBadge[], daysLeft: number): void {
  if (daysLeft < 0) {
    badges.push(LAST_DATE_PASSED);
  } else if (daysLeft < 30) {
    badges.push(CLOSING_SOON);
  }
}

function getBadges(item: SmartBadgesProps['item']): SmartBadge[] {
  const badges: SmartBadge[] = [];
  const now = Date.now();

  if (item.status === 'Closed') {
    badges.push(LAST_DATE_PASSED);
    return badges;
  }

  if (item.status === 'Coming') {
    badges.push({ label: 'Coming', labelHindi: 'आ रहा है', variant: 'new' });
  }

  if (item.isFeatured) {
    badges.push({ label: 'Featured', labelHindi: 'विशेष', variant: 'featured' });
  }

  if (item.isPopular) {
    badges.push({ label: 'Popular', labelHindi: 'लोकप्रिय', variant: 'popular' });
  }

  const dateStr = item.deadline || item.last_date;
  if (dateStr) {
    const parsed = new Date(dateStr.replace(/(\d{1,2})\s+(\w+)\s+(\d{4})/, '$1 $2 $3'));
    if (!isNaN(parsed.getTime())) {
      pushDateBadge(badges, (parsed.getTime() - now) / MS_PER_DAY);
    }
  }

  return badges;
}

const VARIANT_STYLES: Record<SmartBadge['variant'], string> = {
  new: 'bg-green-100 text-green-700',
  popular: 'bg-yellow-100 text-yellow-700',
  closing: 'bg-red-100 text-red-700',
  featured: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-500',
};

export default function SmartBadges({ item }: SmartBadgesProps) {
  const badges = useMemo(() => getBadges(item), [item]);

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

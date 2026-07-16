'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useProgress } from './useProgress';

interface ProgressButtonsProps {
  itemId: string;
}

export default function ProgressButtons({ itemId }: ProgressButtonsProps) {
  const { getProgress, toggleSaved, toggleCompletedReading, toggleApplied, toggleInterested } = useProgress();
  const p = getProgress(itemId);

  const buttons = [
    { key: 'saved' as const, label: 'Saved', labelActive: 'Saved', icon: '🔖', active: p?.saved ?? false, toggle: toggleSaved },
    { key: 'completedReading' as const, label: 'Mark Read', labelActive: 'Read', icon: '📖', active: p?.completedReading ?? false, toggle: toggleCompletedReading },
    { key: 'applied' as const, label: 'Applied', labelActive: 'Applied', icon: '✅', active: p?.applied ?? false, toggle: toggleApplied },
    { key: 'interested' as const, label: 'Interested', labelActive: 'Interested', icon: '⭐', active: p?.interested ?? false, toggle: toggleInterested },
  ];

  return (
    <div className="flex gap-1.5 flex-wrap">
      {buttons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => btn.toggle(itemId)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            btn.active
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
          aria-pressed={btn.active}
          aria-label={`${btn.active ? 'Mark not' : 'Mark as'} ${btn.label}`}
        >
          <span aria-hidden="true">{btn.icon}</span>
          {btn.active ? btn.labelActive : btn.label}
        </button>
      ))}
    </div>
  );
}

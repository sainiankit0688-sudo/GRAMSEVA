'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { UV_LEVELS } from './types';
import type { UvData } from './types';

interface UvIndexProps {
  data: UvData;
}

function getUvLevel(uv: number) {
  return UV_LEVELS.find((l) => uv >= l.range[0] && uv <= l.range[1]) ?? UV_LEVELS[0];
}

const PROTECTION_TIPS: Record<string, { tip: string; tipHindi: string }> = {
  Low: { tip: 'No protection needed', tipHindi: 'सुरक्षा की आवश्यकता नहीं' },
  Moderate: { tip: 'Wear sunglasses on bright days', tipHindi: 'तेज धूप में धूप का चश्मा पहनें' },
  High: { tip: 'Apply sunscreen SPF 30+, wear hat', tipHindi: 'SPF 30+ सनस्क्रीम लगाएं, टोपी पहनें' },
  'Very High': { tip: 'Avoid midday sun, seek shade', tipHindi: 'दोपहर की धूप से बचें, छाया में रहें' },
  Extreme: { tip: 'Stay indoors during midday', tipHindi: 'दोपहर में घर के अंदर रहें' },
};

export default function UvIndex({ data }: UvIndexProps) {
  if (!data || data.uv == null) {
    return (
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="UV Index">
        <h2 className="text-lg font-bold text-gray-800 mb-1">UV Index / यूवी सूचकांक</h2>
        <p className="text-sm text-gray-500">UV data unavailable / यूवी डेटा उपलब्ध नहीं</p>
      </section>
    );
  }

  const level = getUvLevel(data.uv);
  const tips = PROTECTION_TIPS[level.label] ?? PROTECTION_TIPS.Low;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="UV Index">
      <h2 className="text-lg font-bold text-gray-800 mb-1">UV Index / यूवी सूचकांक</h2>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{data.uv.toFixed(1)}</span>
        </div>
        <div>
          <p className={`text-base font-semibold ${level.color}`}>{level.label} / {level.labelHindi}</p>
          <p className="text-xs text-gray-500 mt-1">{tips.tip} / {tips.tipHindi}</p>
        </div>
      </div>
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min((data.uv / 15) * 100, 100)}%`,
            background: 'linear-gradient(90deg, #22c55e, #eab308, #ef4444, #a855f7)',
          }}
          role="progressbar"
          aria-valuenow={data.uv}
          aria-valuemin={0}
          aria-valuemax={15}
        />
      </div>
    </section>
  );
}

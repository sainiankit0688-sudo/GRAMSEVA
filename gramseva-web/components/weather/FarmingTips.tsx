'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';

const TIPS: Record<string, string[]> = {
  Clear: ['Sunny day – good for harvesting', 'Irrigate in morning/evening to minimize evaporation', 'Ideal for pesticide/fertilizer application'],
  Clouds: ['Overcast – good for transplanting seedlings', 'Moderate conditions for field work', 'Check for pest activity in humid weather'],
  Rain: ['Avoid pesticide spray during rain', 'Check field drainage to prevent waterlogging', 'Good time for sowing if rain is light'],
  Thunderstorm: ['Avoid open field work', 'Secure equipment and livestock', 'Check crops for damage after storm'],
  Drizzle: ['Light rain – minimal impact on spraying', 'Good moisture for dry fields', 'Monitor for fungal disease risk'],
  Haze: ['Reduced sunlight may slow photosynthesis', 'Delay irrigation if humidity is high', 'Use protective gear if spraying'],
  Fog: ['Delay spraying until fog lifts', 'Check for excess moisture on crops', 'Drive carefully on farm roads'],
  Mist: ['Good time for transplanting', 'Monitor for fungal growth', 'Ideal for nursery work'],
  Snow: ['Protect crops with covers', 'Avoid travel on farm roads', 'Check livestock shelter'],
};

interface FarmingTipsProps {
  weatherMain: string;
}

export default function FarmingTips({ weatherMain }: FarmingTipsProps) {
  const tips = useMemo(() => TIPS[weatherMain] || TIPS['Clear'], [weatherMain]);

  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-4" role="region" aria-label="Farming tips">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg" aria-hidden="true">🌾</span>
        <h3 className="text-sm font-bold text-green-800">Farming Tips / किसान सलाह</h3>
      </div>
      <ul className="space-y-1.5">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-green-700">
            <span className="text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

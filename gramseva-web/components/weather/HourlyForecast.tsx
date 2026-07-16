'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';
import type { ExtendedForecastItem } from './types';
import { WEATHER_EMOJI } from './types';

interface HourlyForecastProps {
  items: ExtendedForecastItem[];
}

export default function HourlyForecast({ items }: HourlyForecastProps) {
  const hourly = useMemo(() => items.slice(0, 8), [items]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4" role="region" aria-label="Hourly forecast">
      <h3 className="text-sm font-bold text-gray-800 mb-3">Hourly Forecast / प्रति घंटा पूर्वानुमान</h3>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {hourly.map((item, i) => {
          const main = item.description || 'Clear';
          const emoji = WEATHER_EMOJI[main] || '🌤️';
          const time = item.dt_txt
            ? new Date(item.dt_txt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : `+${i}h`;
          return (
            <div key={item.dt || i} className="flex flex-col items-center gap-1 min-w-[70px] py-2 px-1 rounded-xl bg-gray-50" role="group" aria-label={`${time}: ${Math.round(item.temperature)}°C`}>
              <span className="text-xs text-gray-500 font-medium">{time}</span>
              <span className="text-2xl" aria-hidden="true">{emoji}</span>
              <span className="text-sm font-bold text-gray-800">{Math.round(item.temperature)}°</span>
              {item.pop !== undefined && (
                <span className="text-[10px] text-blue-500">{Math.round(item.pop * 100)}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

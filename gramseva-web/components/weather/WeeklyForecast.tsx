'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';
import type { ExtendedForecastItem } from './types';
import { WEATHER_EMOJI } from './types';

interface WeeklyForecastProps {
  items: ExtendedForecastItem[];
}

export default function WeeklyForecast({ items }: WeeklyForecastProps) {
  const daily = useMemo(() => {
    const grouped: Record<string, ExtendedForecastItem[]> = {};
    for (const item of items) {
      const date = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    }
    return Object.entries(grouped).slice(0, 7).map(([date, entries]) => {
      const midday = entries.find((e) => e.dt_txt?.includes('12:00')) || entries[Math.floor(entries.length / 2)];
      const temps = entries.map((e) => e.temperature);
      return {
        date,
        dayName: new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        tempMax: Math.max(...temps),
        tempMin: Math.min(...temps),
        description: midday.description || 'Clear',
        pop: Math.max(...entries.map((e) => e.pop ?? 0)),
        icon: midday.description || 'Clear',
      };
    });
  }, [items]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4" role="region" aria-label="7-day forecast">
      <h3 className="text-sm font-bold text-gray-800 mb-3">7-Day Forecast / 7 दिन का पूर्वानुमान</h3>
      <div className="flex flex-col gap-1">
        {daily.map((day) => {
          const emoji = WEATHER_EMOJI[day.icon] || '🌤️';
          return (
            <div key={day.date} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0" role="group" aria-label={`${day.dayName}: ${day.description}, ${Math.round(day.tempMax)}°C`}>
              <span className="text-xs font-semibold text-gray-600 w-28">{day.dayName}</span>
              <span className="text-2xl w-8" aria-hidden="true">{emoji}</span>
              <span className="text-xs text-gray-500 capitalize flex-1 hidden sm:block">{day.description}</span>
              {day.pop > 0 && (
                <span className="text-[10px] text-blue-500 font-medium w-10 text-right">{Math.round(day.pop * 100)}%</span>
              )}
              <div className="flex items-center gap-2 text-right w-20 justify-end">
                <span className="text-sm font-bold text-gray-800">{Math.round(day.tempMax)}°</span>
                <span className="text-xs text-gray-400">{Math.round(day.tempMin)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

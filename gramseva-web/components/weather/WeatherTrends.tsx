'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';
import type { ExtendedForecastItem, TrendPoint } from './types';

interface WeatherTrendsProps {
  forecast: ExtendedForecastItem[];
}

export default function WeatherTrends({ forecast }: WeatherTrendsProps) {
  const trends = useMemo(() => buildTrends(forecast), [forecast]);

  if (trends.length === 0) return null;

  const maxTemp = Math.max(...trends.map((t) => t.temperature));
  const minTemp = Math.min(...trends.map((t) => t.temperature));
  const tempRange = maxTemp - minTemp || 1;

  const maxHumidity = Math.max(...trends.map((t) => t.humidity));
  const minHumidity = Math.min(...trends.map((t) => t.humidity));
  const humidityRange = maxHumidity - minHumidity || 1;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Weather Trends">
      <h2 className="text-lg font-bold text-gray-800 mb-3">24-Hour Trends / 24 घंटे का रुझान</h2>

      {/* Temperature Trend */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Temperature / तापमान</p>
        <div className="flex items-end gap-0.5 h-20">
          {trends.slice(0, 8).map((t, i) => {
            const height = ((t.temperature - minTemp) / tempRange) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center" title={`${t.temperature}°C`}>
                <div
                  className="w-full max-w-[24px] rounded-t-md transition-all duration-300"
                  style={{
                    height: `${Math.max(height, 5)}%`,
                    background: t.temperature >= 30 ? '#ef4444' : t.temperature >= 20 ? '#f59e0b' : '#3b82f6',
                  }}
                  role="img"
                  aria-label={`${t.time} ${t.temperature}°C`}
                />
                {i % 2 === 0 && <span className="text-[8px] text-gray-400 mt-0.5">{t.time}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Humidity Trend */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Humidity / आर्द्रता</p>
        <div className="flex items-end gap-0.5 h-16">
          {trends.slice(0, 8).map((t, i) => {
            const height = ((t.humidity - minHumidity) / humidityRange) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center" title={`${t.humidity}%`}>
                <div
                  className="w-full max-w-[24px] rounded-t-md transition-all duration-300"
                  style={{
                    height: `${Math.max(height, 5)}%`,
                    background: '#06b6d4',
                  }}
                  role="img"
                  aria-label={`${t.time} ${t.humidity}%`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Rain Probability Trend */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Rain Probability / बारिश की संभावना</p>
        <div className="flex items-end gap-0.5 h-12">
          {trends.slice(0, 8).map((t, i) => {
            const height = t.pop * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center" title={`${Math.round(t.pop * 100)}%`}>
                <div
                  className="w-full max-w-[24px] rounded-t-md transition-all duration-300"
                  style={{
                    height: `${Math.max(height, 5)}%`,
                    background: t.pop > 0.5 ? '#6366f1' : t.pop > 0.3 ? '#818cf8' : '#a5b4fc',
                  }}
                  role="img"
                  aria-label={`${t.time} ${Math.round(t.pop * 100)}%`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function buildTrends(forecast: ExtendedForecastItem[]): TrendPoint[] {
  return forecast.slice(0, 8).map((f) => ({
    time: f.dt_txt ? formatTime(f.dt_txt) : '',
    temperature: f.temperature,
    humidity: f.humidity,
    pop: f.pop ?? 0,
  }));
}

function formatTime(dtTxt: string): string {
  try {
    const date = new Date(dtTxt);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '';
  }
}

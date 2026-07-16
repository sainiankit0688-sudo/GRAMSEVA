'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import type { ExtendedWeatherData } from './types';
import { WEATHER_EMOJI } from './types';

interface CurrentWeatherProps {
  data: ExtendedWeatherData;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const mainWeather = data.description || 'Clear';
  const emoji = WEATHER_EMOJI[mainWeather] || '🌤️';

  const timezone = data.timezone ?? 0;
  const sunrise = data.sunrise ? formatUnix(data.sunrise, timezone) : '--';
  const sunset = data.sunset ? formatUnix(data.sunset, timezone) : '--';

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 text-white shadow-md" role="region" aria-label="Current weather">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{data.city}, {data.country}</h2>
          <p className="text-blue-100 text-sm capitalize">{mainWeather}</p>
        </div>
        <span className="text-5xl" aria-hidden="true">{emoji}</span>
      </div>
      <div className="mt-4">
        <span className="text-7xl font-thin">{Math.round(data.temperature)}°</span>
        <span className="text-2xl">C</span>
      </div>
      <div className="flex gap-4 mt-2 text-sm text-blue-100">
        {data.temp_max !== undefined && <span>↑ {Math.round(data.temp_max)}°</span>}
        {data.temp_min !== undefined && <span>↓ {Math.round(data.temp_min)}°</span>}
        <span>Feels like {Math.round(data.feels_like)}°C</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <StatItem icon="💧" value={`${data.humidity}%`} label="Humidity" labelHindi="नमी" />
        <StatItem icon="💨" value={`${data.wind_speed} m/s`} label="Wind" labelHindi="हवा" />
        {data.pressure && <StatItem icon="🔽" value={`${data.pressure} hPa`} label="Pressure" labelHindi="दबाव" />}
        {data.visibility && <StatItem icon="👁️" value={formatVisibility(data.visibility)} label="Visibility" labelHindi="दृश्यता" />}
        <StatItem icon="🌅" value={sunrise} label="Sunrise" labelHindi="सूर्योदय" />
        <StatItem icon="🌇" value={sunset} label="Sunset" labelHindi="सूर्यास्त" />
      </div>
    </div>
  );
}

function StatItem({ icon, value, label, labelHindi }: { icon: string; value: string; label: string; labelHindi: string }) {
  return (
    <div className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm" role="group" aria-label={label}>
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <p className="text-sm font-bold mt-0.5">{value}</p>
      <p className="text-[10px] text-blue-200 leading-tight">{labelHindi}</p>
    </div>
  );
}

function formatUnix(unix: number, tz: number): string {
  return new Date((unix + tz) * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

function formatVisibility(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}

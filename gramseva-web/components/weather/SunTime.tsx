'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

interface SunTimeProps {
  sunrise: number;
  sunset: number;
  timezone: number;
  currentDt: number;
}

function formatTime(unix: number, tz: number): string {
  const date = new Date((unix + tz) * 1000);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

export default function SunTime({ sunrise, sunset, timezone, currentDt }: SunTimeProps) {
  if (!sunrise || !sunset) {
    return (
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Sunrise and Sunset">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Sunrise & Sunset / सूर्योदय और सूर्यास्त</h2>
        <p className="text-sm text-gray-500">Data unavailable / डेटा उपलब्ध नहीं</p>
      </section>
    );
  }

  const daylightDuration = sunset - sunrise;
  const elapsed = currentDt - sunrise;
  const progress = Math.min(Math.max(elapsed / daylightDuration, 0), 1);

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Sunrise and Sunset">
      <h2 className="text-lg font-bold text-gray-800 mb-1">Sunrise & Sunset / सूर्योदय और सूर्यास्त</h2>

      <div className="relative h-20 mt-3 mb-2">
        <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24, #3b82f6, #1e3a5f)' }}>
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent to-transparent" />
        </div>
        <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,60 Q75,10 150,35 Q225,60 300,60" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <circle cx={150 + (progress - 0.5) * 200} cy={60 - Math.sin(progress * Math.PI) * 45} r="6" fill="#fbbf24" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-600 px-1">
        <span>🌅 {formatTime(sunrise, timezone)}</span>
        <span>Daylight / दिन: {Math.floor(daylightDuration / 3600)}h {Math.floor((daylightDuration % 3600) / 60)}m</span>
        <span>🌇 {formatTime(sunset, timezone)}</span>
      </div>

      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-500 transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Daylight progress: ${Math.round(progress * 100)}%`}
        />
      </div>
    </section>
  );
}

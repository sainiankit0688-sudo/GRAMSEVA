'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';
import type { ExtendedWeatherData, ExtendedForecastItem } from './types';

interface Alert {
  type: 'rain' | 'heat' | 'cold' | 'wind';
  icon: string;
  label: string;
  labelHindi: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

interface WeatherAlertsProps {
  current: ExtendedWeatherData;
  forecast: ExtendedForecastItem[];
}

export default function WeatherAlerts({ current, forecast }: WeatherAlertsProps) {
  const alerts = useMemo(() => {
    const result: Alert[] = [];
    const temp = current.temperature;

    if (temp >= 40) {
      result.push({ type: 'heat', icon: '🔥', label: 'Heat Alert', labelHindi: 'गर्मी अलर्ट', message: 'Extreme heat! Stay hydrated, avoid outdoor work 11am-4pm. Provide shade for livestock.', severity: 'danger' });
    } else if (temp >= 35) {
      result.push({ type: 'heat', icon: '☀️', label: 'Heat Advisory', labelHindi: 'गर्मी सलाह', message: 'High temperature. Irrigate crops in early morning. Ensure water for livestock.', severity: 'warning' });
    }

    if (temp <= 5) {
      result.push({ type: 'cold', icon: '🥶', label: 'Cold Alert', labelHindi: 'ठंड अलर्ट', message: 'Freezing temperatures! Protect crops with covers. Provide warm shelter for livestock.', severity: 'danger' });
    } else if (temp <= 10) {
      result.push({ type: 'cold', icon: '❄️', label: 'Cold Advisory', labelHindi: 'ठंड सलाह', message: 'Cold weather. Delay morning irrigation. Protect sensitive crops.', severity: 'warning' });
    }

    const wind = current.wind_speed;
    if (wind >= 15) {
      result.push({ type: 'wind', icon: '💨', label: 'Strong Wind Alert', labelHindi: 'तेज हवा अलर्ट', message: `Strong winds (${wind} m/s). Secure farm structures. Avoid pesticide spraying.`, severity: 'danger' });
    } else if (wind >= 10) {
      result.push({ type: 'wind', icon: '🌬️', label: 'Wind Advisory', labelHindi: 'हवा सलाह', message: `Moderate winds (${wind} m/s). Delay spraying if possible.`, severity: 'warning' });
    }

    const rainForecast = forecast.some((f) => (f.pop ?? 0) >= 0.5);
    if (rainForecast) {
      result.push({ type: 'rain', icon: '🌧️', label: 'Rain Expected', labelHindi: 'बारिश संभावित', message: 'Rain likely in next 24h. Delay irrigation. Prepare drainage. Store harvested produce.', severity: 'info' });
    }

    return result;
  }, [current, forecast]);

  if (alerts.length === 0) return null;

  const severityStyles: Record<string, string> = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="space-y-2" role="region" aria-label="Weather alerts">
      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
        <span aria-hidden="true">⚠️</span> Weather Alerts / मौसम अलर्ट
      </h3>
      {alerts.map((alert, i) => (
        <div key={i} className={`rounded-xl border p-3 ${severityStyles[alert.severity]}`} role="alert">
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0" aria-hidden="true">{alert.icon}</span>
            <div>
              <p className="text-xs font-bold">{alert.label} / {alert.labelHindi}</p>
              <p className="text-[11px] mt-0.5 opacity-80">{alert.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

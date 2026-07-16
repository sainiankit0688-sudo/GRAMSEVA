'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import type { ExtendedWeatherData } from './types';

interface WeatherWidgetsProps {
  data: ExtendedWeatherData;
}

function calcDewPoint(temp: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const gamma = (a * temp) / (b + temp) + Math.log(humidity / 100);
  return (b * gamma) / (a - gamma);
}

interface WidgetDef {
  label: string;
  labelHindi: string;
  value: string;
  icon: string;
}

export default function WeatherWidgets({ data }: WeatherWidgetsProps) {
  const widgets: WidgetDef[] = [];

  if (data.humidity != null) {
    widgets.push({
      label: 'Humidity',
      labelHindi: 'आर्द्रता',
      value: `${data.humidity}%`,
      icon: '💧',
    });
  }

  if (data.wind_speed != null) {
    widgets.push({
      label: 'Wind',
      labelHindi: 'हवा',
      value: `${data.wind_speed.toFixed(1)} m/s${data.wind_deg != null ? ` · ${degToCompass(data.wind_deg)}` : ''}`,
      icon: '💨',
    });
  }

  if (data.pressure != null) {
    widgets.push({
      label: 'Pressure',
      labelHindi: 'दबाव',
      value: `${data.pressure} hPa`,
      icon: '🔽',
    });
  }

  if (data.visibility != null) {
    const visKm = (data.visibility / 1000).toFixed(1);
    widgets.push({
      label: 'Visibility',
      labelHindi: 'दृश्यता',
      value: `${visKm} km`,
      icon: '👁️',
    });
  }

  if (data.clouds != null) {
    widgets.push({
      label: 'Cloud Cover',
      labelHindi: 'बादल',
      value: `${data.clouds}%`,
      icon: '☁️',
    });
  }

  if (data.humidity != null && data.temperature != null) {
    const dp = calcDewPoint(data.temperature, data.humidity);
    widgets.push({
      label: 'Dew Point',
      labelHindi: 'ओसांक',
      value: `${dp.toFixed(1)}°C`,
      icon: '🌊',
    });
  }

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Weather Details">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Weather Details / मौसम विवरण</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {widgets.map((w) => (
          <div key={w.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <span className="text-xl block mb-1" aria-hidden="true">{w.icon}</span>
            <p className="text-lg font-bold text-gray-800">{w.value}</p>
            <p className="text-[10px] text-gray-500">{w.label} / {w.labelHindi}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function degToCompass(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

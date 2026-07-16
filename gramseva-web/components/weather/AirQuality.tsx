'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import type { AirQualityData } from './types';
import { AQI_LEVELS } from './types';

interface AirQualityProps {
  data: AirQualityData;
}

function getLevel(aqi: number) {
  return AQI_LEVELS.find((l) => aqi >= l.range[0] && aqi <= l.range[1]) ?? AQI_LEVELS[0];
}

export default function AirQuality({ data }: AirQualityProps) {
  const level = getLevel(data.aqi);

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Air Quality Index">
      <h2 className="text-lg font-bold text-gray-800 mb-1">Air Quality / वायु गुणवत्ता</h2>
      <div className={`rounded-xl p-4 border ${level.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">AQI / वायु गुणवत्ता सूचकांक</span>
          <span className={`text-2xl font-bold ${level.color}`}>{data.aqi}</span>
        </div>
        <p className={`text-sm font-semibold ${level.color}`}>{level.label} / {level.labelHindi}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Pollutant label="PM2.5" value={`${data.pm25.toFixed(1)} µg/m³`} />
        <Pollutant label="PM10" value={`${data.pm10.toFixed(1)} µg/m³`} />
        <Pollutant label="CO" value={`${data.co.toFixed(1)} µg/m³`} />
        <Pollutant label="NO₂" value={`${data.no2.toFixed(1)} µg/m³`} />
        <Pollutant label="SO₂" value={`${data.so2.toFixed(1)} µg/m³`} />
        <Pollutant label="O₃" value={`${data.o3.toFixed(1)} µg/m³`} />
      </div>
    </section>
  );
}

function Pollutant({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

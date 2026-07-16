'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { weatherService } from '@/lib/services/weatherService';
import { WEATHER_STALE_TIME } from '@/lib/constants/api';
import type { ExtendedWeatherData } from './types';

const POPULAR_CITIES = ['Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Jaipur', 'Bhopal', 'Hyderabad', 'Bengaluru'];
const STORAGE_KEY = 'weather_recent_cities';
const MAX_RECENT = 5;

function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(cities: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    /* ignore */
  }
}

interface WeatherSearchProps {
  currentCity: string;
  onCitySelect: (city: string) => void;
  onRequestGeo: () => void;
  geoLoading: boolean;
  geoError: string | null;
}

export default function WeatherSearch({
  currentCity,
  onCitySelect,
  onRequestGeo,
  geoLoading,
  geoError,
}: WeatherSearchProps) {
  const [input, setInput] = useState(currentCity === 'My Location' ? '' : currentCity);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentCities, setRecentCities] = useState<string[]>(() => getRecent());
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: suggestedCity } = useQuery<ExtendedWeatherData>(
    input.length >= 2 ? queryKeys.weather.city(input) : ['weather', '__skip__'],
    input.length >= 2 ? () => weatherService.getCurrent({ city: input }) as Promise<ExtendedWeatherData> : async () => null as unknown as ExtendedWeatherData,
    { staleTime: WEATHER_STALE_TIME, enabled: input.length >= 2 },
  );

  // recentCities already initialized via useState lazy initializer

  const addRecent = useCallback((city: string) => {
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c !== city);
      const updated = [city, ...filtered].slice(0, MAX_RECENT);
      saveRecent(updated);
      return updated;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;
      addRecent(trimmed);
      onCitySelect(trimmed);
      setShowSuggestions(false);
      inputRef.current?.blur();
    },
    [input, addRecent, onCitySelect],
  );

  const selectCity = useCallback(
    (city: string) => {
      setInput(city);
      addRecent(city);
      onCitySelect(city);
      setShowSuggestions(false);
    },
    [addRecent, onCitySelect],
  );

  const clearHistory = useCallback(() => {
    setRecentCities([]);
    saveRecent([]);
  }, []);

  const suggestionCities = suggestedCity && input.toLowerCase() !== suggestedCity.city?.toLowerCase()
    ? [suggestedCity.city]
    : [];

  return (
    <div className="space-y-3">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative" role="search">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="search"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search city... / शहर खोजें..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm backdrop-blur-sm"
              aria-label="Search for a city"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" aria-hidden="true">🔍</span>
          </div>
          <button
            type="button"
            onClick={onRequestGeo}
            disabled={geoLoading}
            className="px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Use my location"
            title="Use my location / मेरा स्थान उपयोग करें"
          >
            <span className="text-lg" aria-hidden="true">{geoLoading ? '⏳' : '📍'}</span>
          </button>
        </div>

        {/* City Suggestions */}
        {showSuggestions && suggestionCities.length > 0 && input.length >= 2 && (
          <div className="absolute top-full left-0 right-16 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden" role="listbox">
            {suggestionCities.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={() => selectCity(c)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2 focus:outline-none focus:bg-blue-50"
                role="option"
                aria-selected={c === currentCity}
              >
                <span aria-hidden="true">📍</span> {c}
              </button>
            ))}
          </div>
        )}

        {geoError && (
          <p className="text-red-200 text-xs mt-1" role="alert">{geoError}</p>
        )}
      </form>

      {/* Popular Cities */}
      <div className="flex flex-wrap gap-1.5">
        {POPULAR_CITIES.map((c) => (
          <button
            key={c}
            onClick={() => selectCity(c)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
              c === currentCity ? 'bg-white/30 text-white' : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
            aria-label={`Show weather for ${c}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Recent Cities */}
      {recentCities.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-blue-200 font-medium">Recent / हाल ही में:</span>
          {recentCities.map((c) => (
            <button
              key={c}
              onClick={() => selectCity(c)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
                c === currentCity ? 'bg-white/30 text-white' : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              {c}
            </button>
          ))}
          <button
            onClick={clearHistory}
            className="text-[10px] text-blue-200 hover:text-white underline ml-1 focus:outline-none"
            aria-label="Clear recent search history"
          >
            Clear / साफ़ करें
          </button>
        </div>
      )}
    </div>
  );
}

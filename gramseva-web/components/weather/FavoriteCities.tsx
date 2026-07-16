'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useState, useCallback, useEffect } from 'react';
import type { FavoriteCity } from './types';

const STORAGE_KEY = 'gramseva_weather_favorites';
const MAX_FAVORITES = 10;

interface FavoriteCitiesProps {
  currentCity: string;
  onSelect: (city: string) => void;
}

function loadFavorites(): FavoriteCity[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteCity[]) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteCity[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    /* localStorage full — ignore */
  }
}

export default function FavoriteCities({ currentCity, onSelect }: FavoriteCitiesProps) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addCurrent = useCallback(() => {
    if (!currentCity || currentCity === 'My Location') return;
    setFavorites((prev) => {
      if (prev.some((f) => f.name === currentCity)) return prev;
      const updated = [...prev, { name: currentCity, addedAt: Date.now() }];
      if (updated.length > MAX_FAVORITES) updated.shift();
      return updated;
    });
  }, [currentCity]);

  const remove = useCallback((name: string) => {
    setFavorites((prev) => prev.filter((f) => f.name !== name));
  }, []);

  const isFavorite = favorites.some((f) => f.name === currentCity);

  if (favorites.length === 0 && currentCity === 'My Location') return null;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Favorite Cities">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800">Favorite Cities / पसंदीदा शहर</h2>
        {currentCity !== 'My Location' && (
          <button
            onClick={isFavorite ? () => remove(currentCity) : addCurrent}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isFavorite
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
            aria-label={isFavorite ? `Remove ${currentCity} from favorites` : `Add ${currentCity} to favorites`}
          >
            {isFavorite ? '★ Remove / हटाएं' : '☆ Add / जोड़ें'}
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-gray-500">No favorites yet. Add cities for quick switching. / अभी तक कोई पसंदीदा नहीं।</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {favorites.map((fav) => (
            <div
              key={fav.name}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                fav.name === currentCity
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <button
                onClick={() => onSelect(fav.name)}
                className="focus:outline-none"
                aria-label={`Switch to ${fav.name}`}
              >
                {fav.name}
              </button>
              <button
                onClick={() => remove(fav.name)}
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                aria-label={`Remove ${fav.name} from favorites`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

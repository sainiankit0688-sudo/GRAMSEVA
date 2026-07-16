/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { weatherService } from '@/lib/services/weatherService';
import type { AirQualityData, UvIndexData } from '@/lib/services/weatherService';
import { WEATHER_STALE_TIME, WEATHER_REFETCH_INTERVAL } from '@/lib/constants/api';
import { LoadingSpinner, ErrorAlert } from '@/components/agriculture';
import {
  CurrentWeather,
  HourlyForecast,
  WeeklyForecast,
  WeatherSearch,
  FarmingTips,
  WeatherAlerts,
  AirQuality,
  UvIndex,
  SunTime,
  WeatherWidgets,
  FavoriteCities,
  SmartAgricultureTips,
  SevereWeatherAlerts,
  WeatherTrends,
} from '@/components/weather';
import type {
  ExtendedWeatherData,
  ExtendedForecastItem,
  ExtendedForecast,
} from '@/components/weather';

interface RawMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface RawWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface RawWind {
  speed: number;
  deg: number;
}

interface RawSys {
  country: string;
  sunrise: number;
  sunset: number;
}

interface RawClouds {
  all: number;
}

interface RawCurrentResponse {
  name: string;
  main: RawMain;
  weather: RawWeather[];
  wind: RawWind;
  sys: RawSys;
  visibility: number;
  clouds: RawClouds;
  dt: number;
  timezone: number;
  cod: number;
  coord?: { lat: number; lon: number };
}

interface RawForecastItem {
  dt: number;
  main: RawMain;
  weather: RawWeather[];
  wind: RawWind;
  visibility: number;
  clouds: RawClouds;
  pop: number;
  dt_txt: string;
}

interface RawForecastResponse {
  list: RawForecastItem[];
  city: { name: string; country: string; timezone: number };
}

interface GeoState {
  loading: boolean;
  error: string | null;
  lat?: number;
  lon?: number;
}

const OFFLINE_CACHE_KEY = 'weather_last_data';
const OFFLINE_CACHE_TIME = 'weather_last_fetch';

function saveOfflineCache(current: ExtendedWeatherData, forecast: ExtendedForecast) {
  try {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify({ current, forecast }));
    localStorage.setItem(OFFLINE_CACHE_TIME, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function loadOfflineCache(): { current: ExtendedWeatherData; forecast: ExtendedForecast } | null {
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    const time = localStorage.getItem(OFFLINE_CACHE_TIME);
    if (!raw || !time) return null;
    const data = JSON.parse(raw) as { current: ExtendedWeatherData; forecast: ExtendedForecast };
    return data;
  } catch {
    return null;
  }
}

function getOfflineAge(): number | null {
  try {
    const time = localStorage.getItem(OFFLINE_CACHE_TIME);
    return time ? Date.now() - Number(time) : null;
  } catch {
    return null;
  }
}

export default function WeatherPage() {
  const [city, setCity] = useState('Delhi');
  const [useCoords, setUseCoords] = useState(false);
  const [geo, setGeo] = useState<GeoState>({ loading: false, error: null });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentQueryKey = useMemo(
    () => useCoords && geo.lat && geo.lon
      ? queryKeys.weather.coords(geo.lat, geo.lon)
      : queryKeys.weather.city(city),
    [city, useCoords, geo.lat, geo.lon],
  );

  const forecastQueryKey = useMemo(
    () => queryKeys.weather.forecast(city),
    [city],
  );

  const { data: rawCurrent, isLoading: currentLoading, error: currentError, refetch: refetchCurrent } = useQuery<ExtendedWeatherData>(
    currentQueryKey,
    useCoords && geo.lat && geo.lon
      ? () => weatherService.getCurrentByCoords({ lat: geo.lat!, lon: geo.lon! }) as Promise<ExtendedWeatherData>
      : () => weatherService.getCurrent({ city }) as Promise<ExtendedWeatherData>,
    { staleTime: WEATHER_STALE_TIME, refetchInterval: WEATHER_REFETCH_INTERVAL },
  );

  const current = useMemo(() => {
    if (!rawCurrent) return null;
    const parsed = parseCurrent(rawCurrent);
    return parsed;
  }, [rawCurrent]);

  const { data: rawForecast, isLoading: forecastLoading, error: forecastError, refetch: refetchForecast } = useQuery<ExtendedForecast>(
    forecastQueryKey,
    () => weatherService.getForecast({ city }) as Promise<ExtendedForecast>,
    { staleTime: WEATHER_STALE_TIME, refetchInterval: WEATHER_REFETCH_INTERVAL },
  );

  const forecast = useMemo(() => rawForecast ? parseForecast(rawForecast) : null, [rawForecast]);

  // Offline cache
  useEffect(() => {
    if (current && forecast) {
      saveOfflineCache(current, forecast);
    }
  }, [current, forecast]);

  const offlineCache = useMemo(() => {
    if (!isOnline && !current && !forecast) {
      return loadOfflineCache();
    }
    return null;
  }, [isOnline, current, forecast]);

  const displayCurrent = offlineCache?.current ?? current;
  const displayForecast = offlineCache?.forecast ?? forecast;
  const offlineAge = useMemo(() => getOfflineAge(), []);

  // AQI + UV queries (need coords)
  const rawCurrentObj = rawCurrent as unknown as RawCurrentResponse | null;
  const currentLat = useCoords ? geo.lat : rawCurrentObj?.coord?.lat;
  const currentLon = useCoords ? geo.lon : rawCurrentObj?.coord?.lon;
  const hasCoords = currentLat != null && currentLon != null;

  const aqiKey = useMemo(
    () => hasCoords ? queryKeys.weather.aqi(currentLat as number, currentLon as number) : ['weather', 'aqi', 'skip'],
    [hasCoords, currentLat, currentLon],
  );

  const { data: aqi } = useQuery<AirQualityData>(
    aqiKey,
    hasCoords
      ? () => weatherService.getAirQuality({ lat: currentLat as number, lon: currentLon as number })
      : async () => { throw new Error('No coords'); },
    { staleTime: WEATHER_STALE_TIME, enabled: hasCoords },
  );

  const uvKey = useMemo(
    () => hasCoords ? queryKeys.weather.uv(currentLat as number, currentLon as number) : ['weather', 'uv', 'skip'],
    [hasCoords, currentLat, currentLon],
  );

  const { data: uv } = useQuery<UvIndexData>(
    uvKey,
    hasCoords
      ? () => weatherService.getUvIndex({ lat: currentLat as number, lon: currentLon as number })
      : async () => { throw new Error('No coords'); },
    { staleTime: WEATHER_STALE_TIME, enabled: hasCoords },
  );

  const handleCitySelect = useCallback((newCity: string) => {
    setCity(newCity);
    setUseCoords(false);
  }, []);

  const requestGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo({ loading: false, error: 'Geolocation not supported / स्थान समर्थित नहीं' });
      return;
    }
    setGeo({ loading: true, error: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ loading: false, error: null, lat: pos.coords.latitude, lon: pos.coords.longitude });
        setUseCoords(true);
        setCity('My Location');
      },
      () => {
        setGeo({ loading: false, error: 'Location access denied. Showing default city. / स्थान अनुमति अस्वीकृत।' });
      },
      { timeout: 10000, enableHighAccuracy: false },
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!cancelled) {
            setGeo({ loading: false, error: null, lat: pos.coords.latitude, lon: pos.coords.longitude });
            setUseCoords(true);
            setCity('My Location');
          }
        },
        () => { if (!cancelled) setGeo({ loading: false, error: null }); },
        { timeout: 5000, enableHighAccuracy: false },
      );
    }
    return () => { cancelled = true; };
  }, []);

  const isLoading = currentLoading || forecastLoading;
  const error = currentError || forecastError;

  const isLoadingInitial = isLoading && !displayCurrent && !displayForecast;

  const mainWeather = displayCurrent?.description || 'Clear';

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #0277BD, #0288D1)' }}>
        <h1 className="text-xl font-bold text-white">Weather / मौसम</h1>
        <p className="text-blue-100 text-sm">Real-time weather, forecasts & farming tips</p>

        {/* Search + Location */}
        <div className="mt-4">
          <WeatherSearch
            currentCity={city}
            onCitySelect={handleCitySelect}
            onRequestGeo={requestGeo}
            geoLoading={geo.loading}
            geoError={geo.error}
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Offline banner */}
        {!isOnline && offlineCache && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-800" role="alert">
            <span className="font-semibold">Offline / ऑफलाइन:</span> Showing last updated weather
            {offlineAge ? ` (${Math.round(offlineAge / 60000)} min ago)` : ''}
          </div>
        )}

        {/* Loading */}
        {isLoadingInitial && !offlineCache && (
          <LoadingSpinner message="Fetching weather data..." messageHindi="मौसम डेटा लोड हो रहा है..." />
        )}

        {/* Error */}
        {!isLoadingInitial && error && !offlineCache && (
          <ErrorAlert
            message={error.message || 'Failed to load weather data'}
            messageHindi="मौसम डेटा लोड करने में विफल"
            onRetry={() => { refetchCurrent(); refetchForecast(); }}
          />
        )}

        {/* Weather Data */}
        {displayCurrent && !isLoadingInitial && (
          <>
            {/* Current Weather */}
            <CurrentWeather data={displayCurrent} />

            {/* AQI */}
            {aqi && <AirQuality data={aqi} />}

            {/* UV Index */}
            {uv && <UvIndex data={uv} />}

            {/* Sunrise / Sunset */}
            {displayCurrent.sunrise != null && displayCurrent.sunset != null && (
              <SunTime
                sunrise={displayCurrent.sunrise}
                sunset={displayCurrent.sunset}
                timezone={displayCurrent.timezone ?? 0}
                currentDt={displayCurrent.dt}
              />
            )}

            {/* Weather Widgets */}
            <WeatherWidgets data={displayCurrent} />

            {/* Favorite Cities */}
            <FavoriteCities currentCity={city} onSelect={handleCitySelect} />

            {/* Severe Weather Alerts */}
            {displayForecast && (
              <SevereWeatherAlerts current={displayCurrent} forecast={displayForecast.list} />
            )}

            {/* Weather Alerts (existing) */}
            {displayForecast && (
              <WeatherAlerts current={displayCurrent} forecast={displayForecast.list} />
            )}

            {/* Smart Agriculture Tips */}
            {displayForecast && (
              <SmartAgricultureTips current={displayCurrent} forecast={displayForecast.list} />
            )}

            {/* Hourly Forecast */}
            {displayForecast && displayForecast.list.length > 0 && (
              <HourlyForecast items={displayForecast.list} />
            )}

            {/* Weather Trends */}
            {displayForecast && displayForecast.list.length > 0 && (
              <WeatherTrends forecast={displayForecast.list} />
            )}

            {/* Farming Tips */}
            <FarmingTips weatherMain={mainWeather} />

            {/* 7-Day Forecast */}
            {displayForecast && displayForecast.list.length > 0 && (
              <WeeklyForecast items={displayForecast.list} />
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoadingInitial && !error && !displayCurrent && !offlineCache && (
          <div className="flex flex-col items-center gap-3 py-12 text-center px-4" role="status">
            <span className="text-4xl" aria-hidden="true">🌤️</span>
            <p className="text-sm font-semibold text-gray-700">No weather data available</p>
            <p className="text-xs text-gray-500">मौसम डेटा उपलब्ध नहीं</p>
            <button
              onClick={() => { refetchCurrent(); refetchForecast(); }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Retry / पुनः प्रयास करें
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function parseCurrent(raw: ExtendedWeatherData): ExtendedWeatherData {
  const r = raw as unknown as RawCurrentResponse;
  return {
    ...raw,
    temperature: r.main?.temp ?? raw.temperature ?? 0,
    feels_like: r.main?.feels_like ?? raw.feels_like ?? 0,
    humidity: r.main?.humidity ?? raw.humidity ?? 0,
    description: r.weather?.[0]?.main ?? raw.description ?? 'Clear',
    icon: r.weather?.[0]?.icon ?? raw.icon ?? '01d',
    wind_speed: r.wind?.speed ?? raw.wind_speed ?? 0,
    city: r.name ?? raw.city ?? 'Unknown',
    country: r.sys?.country ?? raw.country ?? '',
    dt: r.dt ?? raw.dt ?? 0,
    pressure: r.main?.pressure,
    visibility: r.visibility,
    temp_min: r.main?.temp_min,
    temp_max: r.main?.temp_max,
    sunrise: r.sys?.sunrise,
    sunset: r.sys?.sunset,
    wind_deg: r.wind?.deg,
    clouds: r.clouds?.all,
    timezone: r.timezone,
  };
}

function parseForecast(raw: ExtendedForecast): ExtendedForecast {
  const r = raw as unknown as RawForecastResponse;
  const list: ExtendedForecastItem[] = (r.list ?? []).map((item) => ({
    dt: item.dt,
    temperature: item.main?.temp ?? 0,
    feels_like: item.main?.feels_like ?? 0,
    humidity: item.main?.humidity ?? 0,
    description: item.weather?.[0]?.main ?? 'Clear',
    icon: item.weather?.[0]?.icon ?? '01d',
    wind_speed: item.wind?.speed ?? 0,
    pop: item.pop ?? 0,
    temp_min: item.main?.temp_min,
    temp_max: item.main?.temp_max,
    pressure: item.main?.pressure,
    visibility: item.visibility,
    wind_deg: item.wind?.deg,
    clouds: item.clouds?.all,
    dt_txt: item.dt_txt,
  }));
  return {
    city: r.city?.name ?? raw.city ?? 'Unknown',
    country: r.city?.country ?? raw.country ?? '',
    list,
  };
}

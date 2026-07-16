import { createApiClient } from '@/lib/api/client';
import { REQUEST_TIMEOUT, WEATHER_STALE_TIME } from '@/lib/constants/api';

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  city: string;
  country: string;
  dt: number;
  [key: string]: unknown;
}

export interface WeatherForecastItem {
  dt: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  pop: number;
  [key: string]: unknown;
}

export interface WeatherForecast {
  city: string;
  country: string;
  list: WeatherForecastItem[];
  [key: string]: unknown;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
}

export interface UvIndexData {
  uv: number;
}

export interface WeatherCityOptions {
  city: string;
  signal?: AbortSignal;
}

export interface WeatherCoordsOptions {
  lat: number;
  lon: number;
  signal?: AbortSignal;
}

const weatherClient = createApiClient({
  baseUrl: '',
  timeout: REQUEST_TIMEOUT,
  retries: 1,
});

async function getCurrent(options: WeatherCityOptions): Promise<WeatherData> {
  const params = new URLSearchParams({ q: options.city });
  const { data } = await weatherClient.get<WeatherData>(
    `/api/weather?${params.toString()}`,
    { signal: options.signal },
  );
  return data as WeatherData;
}

async function getCurrentByCoords(options: WeatherCoordsOptions): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: String(options.lat),
    lon: String(options.lon),
  });
  const { data } = await weatherClient.get<WeatherData>(
    `/api/weather?${params.toString()}`,
    { signal: options.signal },
  );
  return data as WeatherData;
}

async function getForecast(options: WeatherCityOptions): Promise<WeatherForecast> {
  const params = new URLSearchParams({ q: options.city, type: 'forecast' });
  const { data } = await weatherClient.get<WeatherForecast>(
    `/api/weather?${params.toString()}`,
    { signal: options.signal },
  );
  return data as WeatherForecast;
}

async function getForecastByCoords(
  options: WeatherCoordsOptions,
): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    lat: String(options.lat),
    lon: String(options.lon),
    type: 'forecast',
  });
  const { data } = await weatherClient.get<WeatherForecast>(
    `/api/weather?${params.toString()}`,
    { signal: options.signal },
  );
  return data as WeatherForecast;
}

interface RawAqiResponse {
  list: Array<{
    main: { aqi: number };
    components: { pm2_5: number; pm10: number; co: number; no2: number; so2: number; o3: number };
  }>;
}

interface RawUvResponse {
  value: number;
}

async function getAirQuality(options: WeatherCoordsOptions): Promise<AirQualityData> {
  const params = new URLSearchParams({
    lat: String(options.lat),
    lon: String(options.lon),
    type: 'aqi',
  });
  const { data } = await weatherClient.get<RawAqiResponse>(
    `/api/weather?${params.toString()}`,
    { signal: options.signal },
  );
  const entry = (data as RawAqiResponse).list?.[0];
  if (!entry) throw new Error('No AQI data available');
  return {
    aqi: entry.main.aqi,
    pm25: entry.components.pm2_5,
    pm10: entry.components.pm10,
    co: entry.components.co,
    no2: entry.components.no2,
    so2: entry.components.so2,
    o3: entry.components.o3,
  };
}

async function getUvIndex(options: WeatherCoordsOptions): Promise<UvIndexData> {
  const params = new URLSearchParams({
    lat: String(options.lat),
    lon: String(options.lon),
    type: 'uv',
  });
  try {
    const { data } = await weatherClient.get<RawUvResponse>(
      `/api/weather?${params.toString()}`,
      { signal: options.signal },
    );
    const uv = (data as RawUvResponse).value ?? 0;
    return { uv };
  } catch {
    return { uv: 0 };
  }
}

export const weatherService = {
  getCurrent,
  getCurrentByCoords,
  getForecast,
  getForecastByCoords,
  getAirQuality,
  getUvIndex,
  staleTime: WEATHER_STALE_TIME,
} as const;

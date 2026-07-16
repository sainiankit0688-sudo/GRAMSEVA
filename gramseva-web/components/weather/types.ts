/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import type { WeatherData as ServiceWeatherData, WeatherForecastItem as ServiceForecastItem, WeatherForecast as ServiceForecast } from '@/lib/services/weatherService';

export interface ExtendedWeatherData extends ServiceWeatherData {
  pressure?: number;
  visibility?: number;
  sunrise?: number;
  sunset?: number;
  temp_min?: number;
  temp_max?: number;
  wind_deg?: number;
  clouds?: number;
  rain?: { '1h'?: number; '3h'?: number };
  snow?: { '1h'?: number; '3h'?: number };
  timezone?: number;
}

export interface ExtendedForecastItem extends ServiceForecastItem {
  temp_min?: number;
  temp_max?: number;
  pressure?: number;
  visibility?: number;
  wind_deg?: number;
  clouds?: number;
  rain?: { '3h'?: number };
  snow?: { '3h'?: number };
  dt_txt?: string;
}

export interface ExtendedForecast extends ServiceForecast {
  list: ExtendedForecastItem[];
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

export interface UvData {
  uv: number;
}

export interface FavoriteCity {
  name: string;
  lat?: number;
  lon?: number;
  addedAt: number;
}

export interface SevereAlert {
  type: string;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  action: string;
  actionHindi: string;
}

export interface SmartTip {
  condition: string;
  tip: string;
  tipHindi: string;
  icon: string;
}

export interface TrendPoint {
  time: string;
  temperature: number;
  humidity: number;
  pop: number;
}

export const WEATHER_EMOJI: Record<string, string> = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '😶‍🌫️',
  Dust: '💨',
  Sand: '💨',
  Smoke: '🌁',
  Tornado: '🌪️',
  Squall: '💨',
};

export const UV_LEVELS = [
  { range: [0, 2], label: 'Low', labelHindi: 'कम', color: 'text-green-600' },
  { range: [3, 5], label: 'Moderate', labelHindi: 'मध्यम', color: 'text-yellow-600' },
  { range: [6, 7], label: 'High', labelHindi: 'उच्च', color: 'text-orange-600' },
  { range: [8, 10], label: 'Very High', labelHindi: 'बहुत उच्च', color: 'text-red-600' },
  { range: [11, 20], label: 'Extreme', labelHindi: 'अत्यधिक', color: 'text-purple-600' },
];

export const AQI_LEVELS = [
  { range: [1, 1], label: 'Good', labelHindi: 'अच्छा', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { range: [2, 2], label: 'Fair', labelHindi: 'ठीक', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  { range: [3, 3], label: 'Moderate', labelHindi: 'मध्यम', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  { range: [4, 4], label: 'Poor', labelHindi: 'खराब', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  { range: [5, 5], label: 'Very Poor', labelHindi: 'बहुत खराब', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
];

export const SEVERE_ALERT_RULES = {
  heatwave: { tempThreshold: 40, label: 'Heatwave', labelHindi: 'हीटवेव', icon: '🔥' },
  heavyRain: { popThreshold: 70, label: 'Heavy Rain', labelHindi: 'भारी बारिश', icon: '🌧️' },
  thunderstorm: { condition: 'Thunderstorm', label: 'Thunderstorm', labelHindi: 'तूफान', icon: '⛈️' },
  strongWind: { speedThreshold: 15, label: 'Strong Wind', labelHindi: 'तेज हवा', icon: '💨' },
  fog: { condition: 'Fog', label: 'Fog', labelHindi: 'कोहरा', icon: '🌫️' },
  coldWave: { tempThreshold: 5, label: 'Cold Wave', labelHindi: 'शीत लहर', icon: '🥶' },
};

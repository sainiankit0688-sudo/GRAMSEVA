/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

export { default as CurrentWeather } from './CurrentWeather';
export { default as HourlyForecast } from './HourlyForecast';
export { default as WeeklyForecast } from './WeeklyForecast';
export { default as WeatherSearch } from './WeatherSearch';
export { default as FarmingTips } from './FarmingTips';
export { default as WeatherAlerts } from './WeatherAlerts';
export { default as AirQuality } from './AirQuality';
export { default as UvIndex } from './UvIndex';
export { default as SunTime } from './SunTime';
export { default as WeatherWidgets } from './WeatherWidgets';
export { default as FavoriteCities } from './FavoriteCities';
export { default as SmartAgricultureTips } from './SmartAgricultureTips';
export { default as SevereWeatherAlerts } from './SevereWeatherAlerts';
export { default as WeatherTrends } from './WeatherTrends';

export type {
  ExtendedWeatherData,
  ExtendedForecastItem,
  ExtendedForecast,
  AirQualityData,
  UvData,
  FavoriteCity,
  SevereAlert,
  SmartTip,
  TrendPoint,
} from './types';

export {
  WEATHER_EMOJI,
  UV_LEVELS,
  AQI_LEVELS,
  SEVERE_ALERT_RULES,
} from './types';

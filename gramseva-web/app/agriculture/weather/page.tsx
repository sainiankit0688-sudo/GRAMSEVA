'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader,
  LoadingSpinner,
  ErrorAlert,
  BackButton,
  Breadcrumb,
  ShareButton,
} from '@/components/agriculture';
import { weatherService } from '@/lib/services/weatherService';
import type { WeatherAlert, FarmingAdvice } from '@/lib/agriculture/types';

// ─── Raw OpenWeatherMap types ─────────────────────────────────────────────────

interface RawWeatherMain {
  temp: number;
  feels_like: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}

interface RawWeatherItem {
  main: string;
  description: string;
  icon: string;
}

interface RawSys {
  country: string;
  sunrise: number;
  sunset: number;
}

interface RawWind {
  speed: number;
}

interface RawRain {
  '1h'?: number;
  '3h'?: number;
}

interface RawClouds {
  all: number;
}

interface RawWeatherResponse {
  name: string;
  sys: RawSys;
  main: RawWeatherMain;
  weather: RawWeatherItem[];
  wind: RawWind;
  rain?: RawRain;
  clouds?: RawClouds;
  visibility?: number;
  uv?: number;
  dt: number;
}

interface RawForecastItem {
  dt: number;
  main: RawWeatherMain;
  weather: RawWeatherItem[];
  wind: RawWind;
  pop: number;
  rain?: RawRain;
  dt_txt: string;
}

interface RawForecastResponse {
  list: RawForecastItem[];
  city: { name: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const weatherEmoji: Record<string, string> = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '😶‍🌫️',
};

function generateAlerts(w: RawWeatherResponse, forecast: RawForecastItem[]): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const temp = w.main?.temp || 0;
  const humidity = w.main?.humidity || 0;
  const windSpeed = w.wind?.speed || 0;

  // Heat
  if (temp > 40) {
    alerts.push({
      type: 'heat',
      severity: 'warning',
      message: `Extreme heat (${Math.round(temp)}°C) — irrigate crops early morning, avoid midday field work`,
      messageHindi: `अत्यधिक गर्मी (${Math.round(temp)}°C) — सुबह-सुबह सिंचाई करें, दोपहर में खेत का काम न करें`,
      icon: '🔥',
    });
  } else if (temp > 35) {
    alerts.push({
      type: 'heat',
      severity: 'advisory',
      message: `Hot weather (${Math.round(temp)}°C) — ensure adequate irrigation for crops`,
      messageHindi: `गर्म मौसम (${Math.round(temp)}°C) — फसलों को पर्याप्त सिंचाई सुनिश्चित करें`,
      icon: '🌡️',
    });
  }

  // Cold / Frost
  if (temp < 5) {
    alerts.push({
      type: 'cold',
      severity: 'warning',
      message: `Frost risk (${Math.round(temp)}°C) — cover sensitive crops, drain standing water`,
      messageHindi: `पाले का खतरा (${Math.round(temp)}°C) — संवेदनशील फसलों को ढकें, जमा पानी निकालें`,
      icon: '🥶',
    });
  }

  // Rain
  const hasRain = forecast.some((f) => f.pop > 0.6);
  if (hasRain) {
    alerts.push({
      type: 'rain',
      severity: 'advisory',
      message: 'Heavy rain expected — delay pesticide spray, prepare drainage',
      messageHindi: 'भारी बारिश की उम्मीद — कीटनाशक छिड़काव टालें, जल निकासी तैयार करें',
      icon: '🌧️',
    });
  }

  // Wind
  if (windSpeed > 10) {
    alerts.push({
      type: 'wind',
      severity: 'advisory',
      message: `Strong wind (${Math.round(windSpeed)} m/s) — secure tall crops, check stakes`,
      messageHindi: `तेज हवा (${Math.round(windSpeed)} m/s) — लंबी फसलों को सुरक्षित करें`,
      icon: '💨',
    });
  }

  // Humidity
  if (humidity > 85) {
    alerts.push({
      type: 'humidity',
      severity: 'info',
      message: 'High humidity — watch for fungal diseases, ensure good ventilation',
      messageHindi: 'अधिक नमी — कवक रोगों पर नजर रखें, अच्छा वायु संचार सुनिश्चित करें',
      icon: '💧',
    });
  }

  return alerts;
}

function generateFarmingAdvice(w: RawWeatherResponse, forecast: RawForecastItem[]): FarmingAdvice[] {
  const advice: FarmingAdvice[] = [];
  const main = w.weather?.[0]?.main || 'Clear';
  const temp = w.main?.temp || 0;
  const humidity = w.main?.humidity || 0;
  const rainChance = forecast.some((f) => f.pop > 0.5);

  // Weather-specific advice
  if (main === 'Clear') {
    advice.push({ category: 'Harvesting', categoryHindi: 'कटाई', tip: 'Good day for harvesting — crops will dry well in the sun', tipHindi: 'कटाई के लिए अच्छा दिन — फसल धूप में अच्छे से सूखेगी', icon: '🌾' });
    advice.push({ category: 'Irrigation', categoryHindi: 'सिंचाई', tip: 'Irrigate in early morning or evening to minimize evaporation', tipHindi: 'वाष्पीकरण कम करने के लिए सुबह या शाम को सिंचाई करें', icon: '💧' });
    advice.push({ category: 'Spraying', categoryHindi: 'छिड़काव', tip: 'Ideal conditions for pesticide and fertilizer application', tipHindi: 'कीटनाशक और उर्वरक छिड़काव के लिए आदर्श स्थिति', icon: '🧪' });
  } else if (main === 'Rain' || main === 'Drizzle') {
    advice.push({ category: 'Spraying', categoryHindi: 'छिड़काव', tip: 'Avoid pesticide spray — chemicals will wash away in rain', tipHindi: 'कीटनाशक छिड़काव से बचें — रसायन बारिश में धुल जाएंगे', icon: '🚫' });
    advice.push({ category: 'Drainage', categoryHindi: 'जल निकासी', tip: 'Check field drainage to prevent waterlogging', tipHindi: 'जलभराव रोकने के लिए खेत की जल निकासी जांचें', icon: '🌊' });
    if (!rainChance) {
      advice.push({ category: 'Sowing', categoryHindi: 'बुआई', tip: 'Good moisture for sowing — take advantage of light rain', tipHindi: 'बुआई के लिए अच्छी नमी — हल्की बारिश का फायदा उठाएं', icon: '🌱' });
    }
  } else if (main === 'Thunderstorm') {
    advice.push({ category: 'Safety', categoryHindi: 'सुरक्षा', tip: 'Avoid open field work — safety first during storms', tipHindi: 'तूफान के दौरान खेत का काम न करें — सुरक्षा पहले', icon: '⚡' });
    advice.push({ category: 'Livestock', categoryHindi: 'पशुधन', tip: 'Secure livestock and farming equipment', tipHindi: 'पशुओं और कृषि उपकरणों को सुरक्षित रखें', icon: '🐄' });
  } else if (main === 'Clouds') {
    advice.push({ category: 'Transplanting', categoryHindi: 'रोपाई', tip: 'Good conditions for transplanting seedlings', tipHindi: 'पौधों की रोपाई के लिए अच्छी स्थिति', icon: '🌿' });
    advice.push({ category: 'Field Work', categoryHindi: 'खेत का काम', tip: 'Moderate conditions — good for general field work', tipHindi: 'मध्यम स्थिति — सामान्य खेत के काम के लिए अच्छा', icon: '🚜' });
  }

  // Temperature-based advice
  if (temp > 35) {
    advice.push({ category: 'Heat Stress', categoryHindi: 'गर्म तनाव', tip: 'Provide shade for sensitive crops, increase irrigation frequency', tipHindi: 'संवेदनशील फसलों को छाया दें, सिंचाई की आवृत्ति बढ़ाएं', icon: '🌡️' });
  }
  if (temp < 10) {
    advice.push({ category: 'Cold Protection', categoryHindi: 'सर्दी से सुरक्षा', tip: 'Cover nurseries and sensitive crops at night', tipHindi: 'रात में नर्सरी और संवेदनशील फसलों को ढकें', icon: '🧣' });
  }

  // Humidity-based advice
  if (humidity > 80) {
    advice.push({ category: 'Disease Watch', categoryHindi: 'रोग निगरानी', tip: 'High humidity increases fungal disease risk — inspect crops regularly', tipHindi: 'अधिक नमी से कवक रोग का खतरा बढ़ता है — फसलों की नियमित जांच करें', icon: '🔍' });
  }

  // Rain forecast advice
  if (rainChance) {
    advice.push({ category: 'Planning', categoryHindi: 'योजना', tip: 'Rain expected — postpone fertilizer application and harvesting', tipHindi: 'बारिश की उम्मीद — उर्वरक डालना और कटाई टालें', icon: '📅' });
  }

  return advice;
}

const farmCities = [
  'Delhi', 'Lucknow', 'Patna', 'Jaipur', 'Indore', 'Bhopal', 'Hyderabad', 'Bengaluru',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FarmWeatherPage() {
  const [weather, setWeather] = useState<RawWeatherResponse | null>(null);
  const [forecast, setForecast] = useState<RawForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [advice, setAdvice] = useState<FarmingAdvice[]>([]);

  const fetchWeather = useCallback(async (searchCity?: string) => {
    if (!searchCity) return;
    setLoading(true);
    setError('');
    try {
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrent({ city: searchCity }),
        weatherService.getForecast({ city: searchCity }),
      ]);
      const rawWeather = currentData as unknown as RawWeatherResponse;
      const rawForecast = (forecastData as unknown as RawForecastResponse).list || [];

      setWeather(rawWeather);
      setForecast(rawForecast);
      setCity(rawWeather.name || searchCity);
      setAlerts(generateAlerts(rawWeather, rawForecast));
      setAdvice(generateFarmingAdvice(rawWeather, rawForecast));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (!cancelled) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            () => { if (!cancelled) fetchWeather('Delhi'); },
            () => { if (!cancelled) fetchWeather('Delhi'); },
          );
        } else {
          fetchWeather('Delhi');
        }
      }
    });
    return () => { cancelled = true; cancelAnimationFrame(id); };
  }, [fetchWeather]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) fetchWeather(searchInput.trim());
  };

  const mainWeather = weather?.weather?.[0]?.main || 'Clear';

  const formatTime = (unix: number) =>
    new Date(unix * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Group forecast by day
  const dailyForecast = forecast.reduce<Record<string, RawForecastItem[]>>((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
  const days = Object.entries(dailyForecast).slice(0, 5);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="Farm Weather"
        titleHindi="कृषि मौसम"
        icon="⛅"
        gradient="linear-gradient(135deg, #0277BD, #0288D1)"
      >
        <div className="flex items-center justify-between mt-2">
          <BackButton label="Back" className="text-white/80 hover:text-white" />
          <ShareButton title="Farm Weather — GramSeva" text="Check farm weather on GramSeva" className="bg-white/20 text-white border-white/30 hover:bg-white/30" />
        </div>
        <form onSubmit={handleSearch} className="mt-2 flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city / शहर खोजें"
            aria-label="Search city"
            className="flex-1 bg-white/20 placeholder-white/60 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-white/30 focus:border-white"
          />
          <button
            type="submit"
            aria-label="Search"
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            🔍
          </button>
        </form>
      </PageHeader>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agriculture', href: '/agriculture' }, { label: 'Weather' }]} />

      {/* Quick Cities */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {farmCities.map((c) => (
            <button
              key={c}
              onClick={() => fetchWeather(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${city === c
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {loading && <LoadingSpinner message="Fetching weather..." messageHindi="मौसम लोड हो रहा है..." />}
        {error && !loading && <ErrorAlert message={error} messageHindi="मौसम डेटा प्राप्त करने में विफल" onRetry={() => fetchWeather(city || 'Delhi')} />}

        {weather && !loading && (
          <>
            {/* Weather Alerts */}
            {alerts.length > 0 && (
              <div className="mb-4 space-y-2">
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-3 flex gap-2 items-start ${
                      alert.severity === 'warning'
                        ? 'bg-red-50 border border-red-200'
                        : alert.severity === 'advisory'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{alert.icon}</span>
                    <div>
                      <p className={`text-xs font-medium ${
                        alert.severity === 'warning' ? 'text-red-800' : alert.severity === 'advisory' ? 'text-yellow-800' : 'text-blue-800'
                      }`}>{alert.message}</p>
                      <p className={`text-xs mt-0.5 ${
                        alert.severity === 'warning' ? 'text-red-600' : alert.severity === 'advisory' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>{alert.messageHindi}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Current Weather */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 text-white shadow-md mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {weather.name}{weather.sys?.country ? `, ${weather.sys.country}` : ''}
                  </h2>
                  <p className="text-blue-100 text-sm capitalize">
                    {weather.weather?.[0]?.description || 'Clear'}
                  </p>
                </div>
                <span className="text-5xl">{weatherEmoji[mainWeather] || '🌤️'}</span>
              </div>
              <div className="mt-4">
                <span className="text-7xl font-thin">{Math.round(weather.main?.temp || 0)}°</span>
                <span className="text-2xl">C</span>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-blue-100">
                <span>↑ {Math.round(weather.main?.temp_max || 0)}° ↓ {Math.round(weather.main?.temp_min || 0)}°</span>
                <span>Feels like {Math.round(weather.main?.feels_like || 0)}°C</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
              {[
                { label: 'Humidity', labelHindi: 'नमी', value: `${weather.main?.humidity || 0}%`, icon: '💧' },
                { label: 'Wind', labelHindi: 'हवा', value: `${weather.wind?.speed || 0} m/s`, icon: '💨' },
                { label: 'Rain', labelHindi: 'बारिश', value: forecast.length > 0 ? `${Math.round((forecast[0]?.pop || 0) * 100)}%` : '--', icon: '🌧️' },
                { label: 'Clouds', labelHindi: 'बादल', value: `${weather.clouds?.all || 0}%`, icon: '☁️' },
                { label: 'Sunrise', labelHindi: 'सूर्योदय', value: weather.sys?.sunrise ? formatTime(weather.sys.sunrise) : '--', icon: '🌅' },
                { label: 'Sunset', labelHindi: 'सूर्यास्त', value: weather.sys?.sunset ? formatTime(weather.sys.sunset) : '--', icon: '🌇' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 text-center">
                  <span className="text-lg">{stat.icon}</span>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Farming Advice */}
            {advice.length > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
                <h3 className="font-bold text-green-800 text-sm mb-2">
                  🌾 Farming Advice / किसान सलाह
                </h3>
                <div className="space-y-2">
                  {advice.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0">{a.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-green-800">{a.category} / {a.categoryHindi}</p>
                        <p className="text-xs text-green-700">{a.tip}</p>
                        <p className="text-xs text-green-600">{a.tipHindi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5-Day Forecast */}
            {days.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">5-Day Forecast / 5 दिन का पूर्वानुमान</h3>
                <div className="flex flex-col gap-2">
                  {days.map(([date, items]) => {
                    const noon = items.find((i) => i.dt_txt.includes('12:00')) || items[Math.floor(items.length / 2)];
                    const maxTemp = Math.max(...items.map((i) => i.main.temp_max));
                    const minTemp = Math.min(...items.map((i) => i.main.temp_min));
                    const maxPop = Math.max(...items.map((i) => i.pop || 0));
                    const dayName = new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
                    const wMain = noon.weather[0]?.main || 'Clear';
                    return (
                      <div key={date} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-2xl w-8">{weatherEmoji[wMain] || '🌤️'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{dayName}</p>
                          <p className="text-xs text-gray-500 capitalize">{noon.weather[0]?.description || ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{Math.round(maxTemp)}°</p>
                          <p className="text-xs text-gray-400">{Math.round(minTemp)}°</p>
                          {maxPop > 0.1 && (
                            <p className="text-xs text-blue-500">💧 {Math.round(maxPop * 100)}%</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

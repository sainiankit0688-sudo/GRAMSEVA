'use client';

import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number; deg: number };
  visibility: number;
  clouds: { all: number };
}

interface ForecastItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
  dt_txt: string;
}

interface ForecastData {
  list: ForecastItem[];
  city: { name: string };
}

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
  Dust: '💨',
  Sand: '💨',
  Smoke: '🌁',
  Tornado: '🌪️',
};

const farmingTips: Record<string, string[]> = {
  Clear: ['Sunny day – good for harvesting', 'Irrigate in morning/evening to minimize evaporation', 'Ideal for pesticide/fertilizer application'],
  Clouds: ['Overcast – good for transplanting seedlings', 'Moderate conditions for field work', 'Check for pest activity in humid weather'],
  Rain: ['Avoid pesticide spray during rain', 'Check field drainage to prevent waterlogging', 'Good time for sowing if rain is light'],
  Thunderstorm: ['Avoid open field work', 'Secure equipment and livestock', 'Check crops for damage after storm'],
  Drizzle: ['Light rain – minimal impact on spraying', 'Good moisture for dry fields', 'Monitor for fungal disease risk'],
};

const popularCities = ['Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Jaipur', 'Bhopal', 'Hyderabad', 'Bengaluru'];

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchWeather = useCallback(async (searchCity?: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError('');
    try {
      let currentUrl: string;
      let forecastUrl: string;

      if (lat !== undefined && lon !== undefined) {
        currentUrl = `/api/weather?lat=${lat}&lon=${lon}&type=current`;
        forecastUrl = `/api/weather?lat=${lat}&lon=${lon}&type=forecast`;
      } else if (searchCity) {
        currentUrl = `/api/weather?city=${encodeURIComponent(searchCity)}&type=current`;
        forecastUrl = `/api/weather?city=${encodeURIComponent(searchCity)}&type=forecast`;
      } else {
        setLoading(false);
        return;
      }

      const [wRes, fRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
      if (!wRes.ok) throw new Error('City not found. Please try another city name.');
      const wData: WeatherData = await wRes.json();
      const fData: ForecastData = await fRes.json();
      setWeather(wData);
      setForecast(fData);
      setCity(wData.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(undefined, pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather('Delhi'),
      );
    } else {
      fetchWeather('Delhi');
    }
  }, [fetchWeather]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) fetchWeather(searchInput.trim());
  };

  // Group forecast by day
  const dailyForecast = forecast?.list.reduce<Record<string, ForecastItem[]>>((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const days = dailyForecast ? Object.entries(dailyForecast).slice(0, 5) : [];
  const mainWeather = weather?.weather[0]?.main || 'Clear';
  const tips = farmingTips[mainWeather] || farmingTips['Clear'];

  const formatTime = (unix: number) => {
    return new Date(unix * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #0277BD, #0288D1)' }}>
        <h1 className="text-xl font-bold text-white">Weather</h1>
        <p className="text-blue-100 text-sm">मौसम की जानकारी</p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-3 flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city / शहर खोजें"
            className="flex-1 bg-white/20 placeholder-white/60 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-white/30 focus:border-white"
          />
          <button type="submit" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            🔍
          </button>
        </form>
      </div>

      {/* Popular Cities */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => fetchWeather(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${city === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Fetching weather...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-start">
            <span className="text-xl">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {weather && !loading && (
          <>
            {/* Current Weather Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 text-white shadow-md mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
                  <p className="text-blue-100 text-sm capitalize">{weather.weather[0].description}</p>
                </div>
                <span className="text-5xl">{weatherEmoji[mainWeather] || '🌤️'}</span>
              </div>
              <div className="mt-4">
                <span className="text-7xl font-thin">{Math.round(weather.main.temp)}°</span>
                <span className="text-2xl">C</span>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-blue-100">
                <span>↑ {Math.round(weather.main.temp_max)}° ↓ {Math.round(weather.main.temp_min)}°</span>
                <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Humidity / नमी', value: `${weather.main.humidity}%`, icon: '💧' },
                { label: 'Wind / हवा', value: `${weather.wind.speed} m/s`, icon: '💨' },
                { label: 'Sunrise / सूर्योदय', value: formatTime(weather.sys.sunrise), icon: '🌅' },
                { label: 'Sunset / सूर्यास्त', value: formatTime(weather.sys.sunset), icon: '🌇' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-base font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Farming Tips */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
              <h3 className="font-bold text-green-800 text-sm mb-2">🌾 Farming Tips / किसान सलाह</h3>
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                  <span className="text-green-600 mt-0.5">•</span>
                  <p className="text-xs text-green-700">{tip}</p>
                </div>
              ))}
            </div>

            {/* 5-Day Forecast */}
            {days.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">5-Day Forecast / 5 दिन का पूर्वानुमान</h3>
                <div className="flex flex-col gap-2">
                  {days.map(([date, items]) => {
                    const noon = items.find((i) => i.dt_txt.includes('12:00')) || items[Math.floor(items.length / 2)];
                    const maxTemp = Math.max(...items.map((i) => i.main.temp_max));
                    const minTemp = Math.min(...items.map((i) => i.main.temp_min));
                    const dayName = new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
                    const wMain = noon.weather[0].main;
                    return (
                      <div key={date} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-2xl w-8">{weatherEmoji[wMain] || '🌤️'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{dayName}</p>
                          <p className="text-xs text-gray-500 capitalize">{noon.weather[0].description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{Math.round(maxTemp)}°</p>
                          <p className="text-xs text-gray-400">{Math.round(minTemp)}°</p>
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

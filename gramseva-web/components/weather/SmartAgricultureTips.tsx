'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';
import type { ExtendedWeatherData, ExtendedForecastItem, SmartTip } from './types';

interface SmartAgricultureTipsProps {
  current: ExtendedWeatherData;
  forecast: ExtendedForecastItem[];
}

export default function SmartAgricultureTips({ current, forecast }: SmartAgricultureTipsProps) {
  const tips = useMemo(() => generateTips(current, forecast), [current, forecast]);

  if (tips.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Smart Agriculture Recommendations">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        <span className="mr-1" aria-hidden="true">🌾</span>Smart Agri Tips / स्मार्ट कृषि सुझाव
      </h2>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">{tip.icon}</span>
            <div>
              <p className="text-sm font-semibold text-amber-900">{tip.condition}</p>
              <p className="text-xs text-amber-800 mt-0.5">{tip.tip}</p>
              <p className="text-xs text-amber-700 mt-0.5">{tip.tipHindi}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function generateTips(current: ExtendedWeatherData, forecast: ExtendedForecastItem[]): SmartTip[] {
  const tips: SmartTip[] = [];
  const maxPop = Math.max(...forecast.map((f) => f.pop ?? 0), 0);
  const temp = current.temperature;
  const humidity = current.humidity;
  const wind = current.wind_speed;

  if (maxPop < 0.2 && temp > 18 && temp < 35) {
    tips.push({
      condition: 'Irrigation / सिंचाई',
      tip: 'Suitable for irrigation. Low rain probability.',
      tipHindi: 'सिंचाई के लिए उपयुक्त। बारिश की संभावना कम।',
      icon: '💧',
    });
  }

  if ((maxPop > 0.5 || humidity > 80) && temp > 20) {
    tips.push({
      condition: 'Pesticide / कीटनाशक',
      tip: 'Avoid spraying pesticides. High rain/humidity reduces effectiveness.',
      tipHindi: 'कीटनाशक छिड़काव से बचें। उच्च नमी/बारिश प्रभाव कम करती है।',
      icon: '🚫',
    });
  }

  if (temp > 30 && humidity < 40 && wind < 5) {
    tips.push({
      condition: 'Harvesting / कटाई',
      tip: 'Harvest recommended. Dry, warm conditions are ideal.',
      tipHindi: 'कटाई की सिफारिश की जाती है। शुष्क, गर्म परिस्थितियां आदर्श हैं।',
      icon: '🌾',
    });
  }

  if (maxPop > 0.6 && temp > 25) {
    tips.push({
      condition: 'Disease Risk / रोग जोखिम',
      tip: 'High disease risk. Monitor crops for fungal infections.',
      tipHindi: 'उच्च रोग जोखिम। फफूंद संक्रमण के लिए फसलों की निगरानी करें।',
      icon: '⚠️',
    });
  }

  if (temp >= 35) {
    tips.push({
      condition: 'Heat Stress / गर्मी का तनाव',
      tip: 'Heat stress risk. Provide shade and increase irrigation.',
      tipHindi: 'गर्मी के तनाव का खतरा। छाया प्रदान करें और सिंचाई बढ़ाएं।',
      icon: '🔥',
    });
  }

  if (temp <= 10) {
    tips.push({
      condition: 'Cold Stress / ठंड का तनाव',
      tip: 'Cold stress risk. Use crop covers or mulch for protection.',
      tipHindi: 'ठंड के तनाव का खतरा। सुरक्षा के लिए फसल आवरण या मल्च का उपयोग करें।',
      icon: '🥶',
    });
  }

  if (wind > 10) {
    tips.push({
      condition: 'Wind / हवा',
      tip: 'Strong winds detected. Secure tall plants and irrigation systems.',
      tipHindi: 'तेज हवाएं। लंबे पौधों और सिंचाई प्रणालियों को सुरक्षित करें।',
      icon: '💨',
    });
  }

  return tips;
}

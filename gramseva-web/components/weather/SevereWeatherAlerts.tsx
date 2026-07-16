'use client';

/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import { useMemo } from 'react';
import type { ExtendedWeatherData, ExtendedForecastItem, SevereAlert } from './types';
import { SEVERE_ALERT_RULES } from './types';

interface SevereWeatherAlertsProps {
  current: ExtendedWeatherData;
  forecast: ExtendedForecastItem[];
}

const ALERT_MESSAGES: Record<string, { title: string; titleHindi: string; message: string; messageHindi: string; action: string; actionHindi: string; severity: 'info' | 'warning' | 'danger' }> = {
  Heatwave: {
    title: 'Heatwave Alert',
    titleHindi: 'हीटवेव अलर्ट',
    message: 'Extreme heat conditions. Stay hydrated and avoid outdoor activity.',
    messageHindi: 'अत्यधिक गर्मी की स्थिति। हाइड्रेटेड रहें और बाहरी गतिविधि से बचें।',
    action: 'Stay indoors, drink water',
    actionHindi: 'घर के अंदर रहें, पानी पिएं',
    severity: 'danger',
  },
  'Heavy Rain': {
    title: 'Heavy Rain Alert',
    titleHindi: 'भारी बारिश अलर्ट',
    message: 'Heavy rainfall expected. Avoid low-lying areas and check drainage.',
    messageHindi: 'भारी वर्षा की संभावना। निचले इलाकों से बचें और जल निकासी की जांच करें।',
    action: 'Avoid travel, check drainage',
    actionHindi: 'यात्रा से बचें, जल निकासी जांचें',
    severity: 'warning',
  },
  Thunderstorm: {
    title: 'Thunderstorm Alert',
    titleHindi: 'तूफान अलर्ट',
    message: 'Thunderstorms expected. Seek shelter and avoid open areas.',
    messageHindi: 'तूफान की संभावना। आश्रय लें और खुले क्षेत्रों से बचें।',
    action: 'Seek shelter indoors',
    actionHindi: 'घर के अंदर आश्रय लें',
    severity: 'danger',
  },
  'Strong Wind': {
    title: 'Strong Wind Alert',
    titleHindi: 'तेज हवा अलर्ट',
    message: 'Strong winds expected. Secure loose objects and avoid travel.',
    messageHindi: 'तेज हवाओं की संभावना। ढीली वस्तुओं को सुरक्षित करें और यात्रा से बचें।',
    action: 'Secure objects, stay indoors',
    actionHindi: 'वस्तुओं को सुरक्षित करें, घर में रहें',
    severity: 'warning',
  },
  Fog: {
    title: 'Fog Alert',
    titleHindi: 'कोहरा अलर्ट',
    message: 'Dense fog expected. Drive with caution and use fog lights.',
    messageHindi: 'घने कोहरे की संभावना। सावधानी से ड्राइव करें और फॉग लाइट का उपयोग करें।',
    action: 'Drive slowly, use fog lights',
    actionHindi: 'धीरे चलाएं, फॉग लाइट का उपयोग करें',
    severity: 'info',
  },
  'Cold Wave': {
    title: 'Cold Wave Alert',
    titleHindi: 'शीत लहर अलर्ट',
    message: 'Extreme cold conditions. Wear warm clothing and check on vulnerable people.',
    messageHindi: 'अत्यधिक ठंड की स्थिति। गर्म कपड़े पहनें और कमजोर लोगों की जांच करें।',
    action: 'Stay warm, check elderly',
    actionHindi: 'गर्म रहें, बुजुर्गों की जांच करें',
    severity: 'warning',
  },
};

export default function SevereWeatherAlerts({ current, forecast }: SevereWeatherAlertsProps) {
  const alerts = useMemo(() => detectAlerts(current, forecast), [current, forecast]);

  if (alerts.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" aria-label="Severe Weather Alerts">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Severe Weather / गंभीर मौसम</h2>
      <div className="space-y-2">
        {alerts.map((alert, i) => {
          const styles = {
            info: 'bg-blue-50 border-blue-200 text-blue-900',
            warning: 'bg-orange-50 border-orange-200 text-orange-900',
            danger: 'bg-red-50 border-red-200 text-red-900',
          };
          const badgeStyles = {
            info: 'bg-blue-200 text-blue-800',
            warning: 'bg-orange-200 text-orange-800',
            danger: 'bg-red-200 text-red-800',
          };

          return (
            <div key={i} className={`border rounded-xl px-4 py-3 ${styles[alert.severity]}`} role="alert">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeStyles[alert.severity]}`}>
                  {alert.severity}
                </span>
                <h3 className="font-semibold text-sm">{alert.title}</h3>
              </div>
              <p className="text-xs mt-1">{alert.message}</p>
              <p className="text-xs mt-0.5 opacity-80">{alert.messageHindi}</p>
              <p className="text-xs font-medium mt-1.5">✅ {alert.action}</p>
              <p className="text-xs opacity-80">{alert.actionHindi}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function detectAlerts(current: ExtendedWeatherData, forecast: ExtendedForecastItem[]): SevereAlert[] {
  const alerts: SevereAlert[] = [];
  const maxPop = Math.max(...forecast.map((f) => f.pop ?? 0), 0);
  const temp = current.temperature;
  const wind = current.wind_speed;
  const desc = current.description;

  if (temp >= SEVERE_ALERT_RULES.heatwave.tempThreshold) {
    const msg = ALERT_MESSAGES.Heatwave;
    alerts.push({ ...msg, type: 'heatwave', severity: msg.severity as 'info' | 'warning' | 'danger' });
  }

  if (maxPop >= SEVERE_ALERT_RULES.heavyRain.popThreshold / 100) {
    const msg = ALERT_MESSAGES['Heavy Rain'];
    alerts.push({ ...msg, type: 'heavyRain', severity: msg.severity as 'info' | 'warning' | 'danger' });
  }

  if (desc === SEVERE_ALERT_RULES.thunderstorm.condition) {
    const msg = ALERT_MESSAGES.Thunderstorm;
    alerts.push({ ...msg, type: 'thunderstorm', severity: msg.severity as 'info' | 'warning' | 'danger' });
  }

  if (wind >= SEVERE_ALERT_RULES.strongWind.speedThreshold) {
    const msg = ALERT_MESSAGES['Strong Wind'];
    alerts.push({ ...msg, type: 'strongWind', severity: msg.severity as 'info' | 'warning' | 'danger' });
  }

  if (desc === SEVERE_ALERT_RULES.fog.condition) {
    const msg = ALERT_MESSAGES.Fog;
    alerts.push({ ...msg, type: 'fog', severity: msg.severity as 'info' | 'warning' | 'danger' });
  }

  if (temp <= SEVERE_ALERT_RULES.coldWave.tempThreshold) {
    const msg = ALERT_MESSAGES['Cold Wave'];
    alerts.push({ ...msg, type: 'coldWave', severity: msg.severity as 'info' | 'warning' | 'danger' });
  }

  return alerts;
}

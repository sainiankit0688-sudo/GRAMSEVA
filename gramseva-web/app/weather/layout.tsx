/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weather | GramSeva',
  description: 'Current weather, hourly and 7-day forecast, farming tips, and weather alerts for Indian cities. Real-time temperature, humidity, wind speed, and more. / भारतीय शहरों के लिए वर्तमान मौसम, प्रति घंटा और 7 दिन का पूर्वानुमान, किसान सलाह और मौसम अलर्ट।',
  openGraph: {
    title: 'Weather | GramSeva',
    description: 'Current weather, hourly & 7-day forecast, farming tips, and weather alerts for Indian cities.',
    type: 'website',
    locale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weather | GramSeva',
    description: 'Current weather, hourly & 7-day forecast, farming tips, and weather alerts for Indian cities.',
  },
  alternates: {
    canonical: '/weather',
  },
};

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

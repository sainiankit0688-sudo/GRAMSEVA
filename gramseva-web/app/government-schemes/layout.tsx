/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Government Schemes | GramSeva',
  description: 'Explore all Indian government schemes in one place — agriculture, education, health, housing, finance, social welfare, employment, energy and infrastructure schemes with eligibility checker, bookmarking, and smart filters. / सभी सरकारी योजनाओं को एक जगह देखें — कृषि, शिक्षा, स्वास्थ्य, आवास, वित्त, सामाजिक कल्याण, रोजगार, ऊर्जा और बुनियादी ढांचा योजनाएं पात्रता जांच, बुकमार्क और स्मार्ट फिल्टर के साथ।',
  openGraph: {
    title: 'Government Schemes | GramSeva',
    description: 'Explore all Indian government schemes — agriculture, education, health, housing, finance, social welfare & more with eligibility checking and bookmarks.',
    type: 'website',
    locale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Schemes | GramSeva',
    description: 'Explore all Indian government schemes — agriculture, education, health, housing, finance, social welfare & more.',
  },
  alternates: {
    canonical: '/government-schemes',
  },
};

export default function GovernmentSchemesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

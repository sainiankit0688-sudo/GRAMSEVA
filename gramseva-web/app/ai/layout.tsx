/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GramSeva AI | ग्रामसेवा AI',
  description:
    'Ask GramSeva AI about agriculture, government schemes, weather, education, emergencies, and complaints. Get instant answers in Hindi and English.',
  keywords: ['AI', 'agriculture', 'government schemes', 'weather', 'GramSeva', 'chatbot', 'ग्रामसेवा AI'],
  openGraph: {
    title: 'GramSeva AI | ग्रामसेवा AI',
    description: 'Ask GramSeva AI about agriculture, schemes, weather, education & more.',
    type: 'website',
    siteName: 'GramSeva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GramSeva AI | ग्रामसेवा AI',
    description: 'Ask GramSeva AI about agriculture, schemes, weather, education & more.',
  },
  alternates: {
    canonical: '/ai',
  },
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'GramSeva AI',
            description: 'AI assistant for Indian villagers — agriculture, schemes, weather, education, emergencies.',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Web',
            url: '/ai',
          }),
        }}
      />
      {children}
    </section>
  );
}

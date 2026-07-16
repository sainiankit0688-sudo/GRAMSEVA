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
  title: 'GramSeva AI Chat | ग्रामसेवा AI चैट',
  description:
    'Chat with GramSeva AI assistant — get instant answers about agriculture, government schemes, weather, education, emergencies, and complaints in Hindi and English.',
  keywords: ['AI chat', 'GramSeva chatbot', 'village assistant', 'government schemes help', 'agriculture advice'],
  openGraph: {
    title: 'GramSeva AI Chat | ग्रामसेवा AI चैट',
    description: 'Chat with GramSeva AI for instant help with agriculture, schemes, weather & more.',
    type: 'website',
    siteName: 'GramSeva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GramSeva AI Chat | ग्रामसेवा AI चैट',
    description: 'Chat with GramSeva AI for instant help with agriculture, schemes, weather & more.',
  },
  alternates: {
    canonical: '/chat',
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Agriculture Services | GramSeva',
    template: '%s | GramSeva Agriculture',
  },
  description: 'Complete agriculture services for Indian farmers — crop information, fertilizer guide, weather, mandi prices, government schemes, soil health, and AI assistant. / भारतीय किसानों के लिए संपूर्ण कृषि सेवाएं।',
  openGraph: {
    title: 'Agriculture Services | GramSeva',
    description: 'Complete agriculture services for Indian farmers — crop info, weather, mandi prices, schemes & AI assistant.',
    type: 'website',
    locale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agriculture Services | GramSeva',
    description: 'Complete agriculture services for Indian farmers — crop info, weather, mandi prices, schemes & AI assistant.',
  },
  alternates: {
    canonical: '/agriculture',
  },
};

export default function AgricultureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

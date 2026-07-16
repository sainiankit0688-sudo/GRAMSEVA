// FROZEN — DO NOT MODIFY — Phase 3 Complete
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Services | GramSeva',
  description: 'Emergency services for India — police, fire, ambulance, hospitals, disaster management, helplines, and nearby emergency services. / भारत के लिए आपातकालीन सेवाएं — पुलिस, दमकल, एम्बुलेंस, अस्पताल, आपदा प्रबंधन, हेल्पलाइन और नजदीकी आपातकालीन सेवाएं।',
  openGraph: {
    title: 'Emergency Services | GramSeva',
    description: 'Emergency services for India — police, fire, ambulance, hospitals, and more.',
    type: 'website',
    locale: 'hi_IN',
    siteName: 'GramSeva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emergency Services | GramSeva',
    description: 'Emergency services for India — police, fire, ambulance, hospitals, and more.',
  },
  alternates: {
    canonical: '/emergency',
  },
  other: {
    'og:image': '/og-emergency.png',
    'og:image:alt': 'GramSeva Emergency Module',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'GramSeva Emergency Services',
  description: 'Comprehensive emergency services directory for India including police, fire brigade, ambulance, hospitals, disaster management, helplines, and nearby emergency services.',
  inLanguage: ['en', 'hi'],
  about: {
    '@type': 'Thing',
    name: 'Emergency Services',
    sameAs: 'https://en.wikipedia.org/wiki/Emergency_services_in_India',
  },
  provider: {
    '@type': 'GovernmentOrganization',
    name: 'GramSeva',
  },
  mainEntity: [
    { '@type': 'WebPage', name: 'Emergency Contacts', description: 'Indian emergency numbers — 112, 100, 101, 102, 108, and more' },
    { '@type': 'WebPage', name: 'Hospitals', description: 'Searchable hospital directory across India' },
    { '@type': 'WebPage', name: 'Police Stations', description: 'Police station directory with contact and map' },
    { '@type': 'WebPage', name: 'Fire Brigade', description: 'Fire station directory with coverage areas' },
    { '@type': 'WebPage', name: 'Ambulance Services', description: 'Government, private, and NGO ambulance providers' },
    { '@type': 'WebPage', name: 'Disaster Management', description: 'Flood, fire, earthquake, heatwave, cold wave, lightning, cyclone safety' },
    { '@type': 'WebPage', name: 'Helplines', description: 'Women, child, senior citizen, mental health, farmer, and more helplines' },
  ],
};

import EmergencyShell from '@/components/emergency/EmergencyShell';

export default function EmergencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EmergencyShell>{children}</EmergencyShell>
    </>
  );
}

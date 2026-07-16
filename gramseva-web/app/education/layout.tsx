/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Education | GramSeva',
  description: 'Education resources for rural India — scholarships, competitive exams, free courses, study material, career guidance, skill development, college information, and FAQs. / ग्रामीण भारत के लिए शिक्षा संसाधन — छात्रवृत्ति, प्रतियोगी परीक्षाएं, मुफ्त पाठ्यक्रम, अध्ययन सामग्री, करियर मार्गदर्शन, कौशल विकास, कॉलेज की जानकारी और अक्सर पूछे जाने वाले प्रश्न।',
  openGraph: {
    title: 'Education | GramSeva',
    description: 'Education resources for rural India — scholarships, exams, courses, and more.',
    type: 'website',
    locale: 'hi_IN',
    siteName: 'GramSeva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education | GramSeva',
    description: 'Education resources for rural India — scholarships, exams, courses, and more.',
  },
  alternates: {
    canonical: '/education',
  },
  other: {
    'og:image': '/og-education.png',
    'og:image:alt': 'GramSeva Education Module',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'GramSeva Education Resources',
  description: 'Comprehensive education resources for rural India including scholarships, competitive exams, free courses, study material, career guidance, skill development, college information, and FAQs.',
  inLanguage: ['en', 'hi'],
  about: {
    '@type': 'Thing',
    name: 'Education',
    sameAs: 'https://en.wikipedia.org/wiki/Education_in_India',
  },
  provider: {
    '@type': 'GovernmentOrganization',
    name: 'GramSeva',
  },
  mainEntity: [
    { '@type': 'WebPage', name: 'Scholarships', description: 'Government scholarships for students' },
    { '@type': 'WebPage', name: 'Competitive Exams', description: 'UPSC, SSC, Railway, Banking, NEET, JEE' },
    { '@type': 'WebPage', name: 'Free Courses', description: 'Free online and offline courses' },
    { '@type': 'WebPage', name: 'Study Material', description: 'Free PDFs, notes and tutorials' },
    { '@type': 'WebPage', name: 'Career Guidance', description: 'Career paths and opportunities' },
    { '@type': 'WebPage', name: 'Skill Development', description: 'Vocational training with certification' },
    { '@type': 'WebPage', name: 'College Information', description: 'Colleges, universities and courses' },
  ],
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complaints Portal | GramSeva',
  description:
    'Submit and track complaints about public services in your village. Road, water, electricity, sanitation issues — report and get resolution.',
  keywords: ['complaints', 'grievance', 'public services', 'village', 'GramSeva', 'शिकायत'],
  openGraph: {
    title: 'Complaints Portal | GramSeva',
    description: 'Submit and track complaints about public services.',
    type: 'website',
    siteName: 'GramSeva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complaints Portal | GramSeva',
    description: 'Submit and track complaints about public services.',
  },
  alternates: {
    canonical: '/complaints',
  },
};

export default function ComplaintsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'GramSeva Complaints Portal',
            description: 'Submit and track complaints about public services.',
            url: '/complaints',
          }),
        }}
      />
      {children}
    </section>
  );
}

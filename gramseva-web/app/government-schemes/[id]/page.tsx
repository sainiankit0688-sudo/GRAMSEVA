/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import type { Metadata } from 'next';
import SchemeDetailClient from './SchemeDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const title = decodeURIComponent(id).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: `${title} — Scheme Details | GramSeva`,
    description: `Detailed information about ${title} government scheme including eligibility, benefits, application process, documents required, and FAQs. / ${title} सरकारी योजना की विस्तृत जानकारी — पात्रता, लाभ, आवेदन प्रक्रिया, आवश्यक दस्तावेज़ और सामान्य प्रश्न।`,
    openGraph: {
      title: `${title} — Government Scheme | GramSeva`,
      description: `Complete details of ${title} — eligibility, benefits, documents, application process & more.`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Government Scheme | GramSeva`,
      description: `Complete details of ${title} — eligibility, benefits, documents, application process & more.`,
    },
    alternates: {
      canonical: `/government-schemes/${id}`,
    },
  };
}

export default async function SchemeDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <SchemeDetailClient schemeId={id} />;
}

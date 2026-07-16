import type { Metadata } from 'next';
import CropDetailClient from './CropDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const title = decodeURIComponent(id).replace(/-/g, ' ');
  const description = `Detailed information about ${title} including growing conditions, fertilizer schedule, disease management, and more. / ${title} की विस्तृत जानकारी — उगाने की स्थिति, उर्वरक अनुसूची, रोग प्रबंधन और बहुत कुछ।`;
  return {
    title: `${title} - Crop Details`,
    description,
    openGraph: {
      title: `${title} — Crop Details | GramSeva`,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Crop Details | GramSeva`,
      description,
    },
    alternates: {
      canonical: `/agriculture/crops/${id}`,
    },
  };
}

export default async function CropDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CropDetailClient cropId={id} />;
}

'use client';

import Link from 'next/link';

interface SchemeCardProps {
  title: string;
  titleHindi: string;
  description: string;
  icon: string;
  color: string;
  link?: string;
  badge?: string;
}

export default function SchemeCard({
  title,
  titleHindi,
  description,
  icon,
  color,
  link,
  badge,
}: SchemeCardProps) {
  const cardContent = (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
    >
      {badge && (
        <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          {badge}
        </span>
      )}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: color + '20' }}
      >
        <span>{icon}</span>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-base leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{titleHindi}</p>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      <div
        className="text-sm font-semibold mt-auto flex items-center gap-1"
        style={{ color }}
      >
        अधिक जानें / Learn More
        <span>→</span>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{cardContent}</Link>;
  }
  return cardContent;
}

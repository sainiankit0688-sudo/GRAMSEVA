'use client';

/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { Reference } from '@/lib/ai/types';
import { MODULE_ICONS } from '@/lib/ai/prompts';

interface SourceReferencesProps {
  references: Reference[];
}

export default function SourceReferences({ references }: SourceReferencesProps) {
  if (references.length === 0) return null;

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100" role="list" aria-label="Source references">
      <p className="text-[10px] text-gray-400 font-medium mb-1">Sources / स्रोत</p>
      <div className="flex flex-wrap gap-1.5">
        {references.map((ref, i) => (
          <div
            key={`${ref.type}-${i}`}
            className="flex items-center gap-1 text-[10px] px-2 py-1 bg-white rounded-md border border-gray-100"
            role="listitem"
          >
            <span aria-hidden="true">{MODULE_ICONS[ref.type as keyof typeof MODULE_ICONS] || '📎'}</span>
            {ref.url ? (
              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-[#3949AB] hover:underline">
                {ref.title}
              </a>
            ) : (
              <span className="text-gray-600">{ref.title}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

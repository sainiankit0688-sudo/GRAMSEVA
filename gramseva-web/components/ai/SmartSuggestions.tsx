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

import type { SmartSuggestion } from '@/lib/ai/types';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onSelect: (text: string) => void;
}

export default function SmartSuggestions({ suggestions, onSelect }: SmartSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2 mb-3 ml-1" role="list" aria-label="Suggested follow-up questions">
      {suggestions.map((s) => (
        <button
          key={s.text}
          type="button"
          onClick={() => onSelect(s.text)}
          className="text-[11px] px-3 py-1.5 rounded-full border border-indigo-200 text-[#3949AB] bg-indigo-50 hover:bg-indigo-100 transition-colors"
          role="listitem"
        >
          {s.icon && <span className="mr-1" aria-hidden="true">{s.icon}</span>}
          {s.text}
        </button>
      ))}
    </div>
  );
}

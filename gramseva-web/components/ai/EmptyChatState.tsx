/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

/**
 * EmptyChatState — professional illustration with suggested prompts.
 */
'use client';

import { MODULE_ICONS } from '@/lib/ai/prompts';
import type { AiModule } from '@/lib/ai/types';

interface EmptyChatStateProps {
  module: AiModule;
  onSuggestion: (text: string) => void;
}

const SUGGESTIONS: Record<AiModule, string[]> = {
  general: ['What can you help me with?', 'Tell me about GramSeva services'],
  agriculture: ['Best crop for this season?', 'How to improve soil health?'],
  schemes: ['How to apply for PM-KISAN?', 'List available scholarships'],
  weather: ["Today's weather forecast?", 'Best time to sow wheat?'],
  education: ['Scholarship eligibility?', 'Career after 12th?'],
  emergency: ['Emergency helpline numbers', 'First aid for burns'],
  complaints: ['How to file a complaint?', 'Track my complaint status'],
};

export default function EmptyChatState({ module, onSuggestion }: EmptyChatStateProps) {
  const suggestions = SUGGESTIONS[module] || SUGGESTIONS.general;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1A237E] to-[#3949AB] flex items-center justify-center mb-4">
        <span className="text-4xl" aria-hidden="true">{MODULE_ICONS[module] || '🤖'}</span>
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">GramSeva AI</h2>
      <p className="text-sm text-gray-500 mb-6">ग्रामसेवा AI — How can I help you today?</p>

      <div className="flex flex-col gap-2 w-full max-w-sm" role="list" aria-label="Suggested prompts">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestion(s)}
            className="text-left px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
            role="listitem"
          >
            <span className="mr-2" aria-hidden="true">💡</span>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

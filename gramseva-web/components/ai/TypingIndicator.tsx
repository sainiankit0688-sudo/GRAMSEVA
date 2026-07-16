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
 * TypingIndicator — animated bouncing dots.
 */
'use client';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3" role="status" aria-label="AI is typing">
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <span className="sr-only">AI is typing...</span>
      </div>
    </div>
  );
}

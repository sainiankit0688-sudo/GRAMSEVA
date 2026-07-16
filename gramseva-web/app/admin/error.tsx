/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-5xl">⚠️</span>
        <h2 className="text-xl font-bold text-gray-800 mt-4">Admin Error</h2>
        <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">{error.message || 'Something went wrong.'}</p>
        <button onClick={reset} className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300">
          Try Again
        </button>
      </div>
    </div>
  );
}

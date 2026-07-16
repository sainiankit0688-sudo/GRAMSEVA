/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

'use client';

export default function WeatherError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-full bg-[#F5F5F5] flex items-center justify-center px-4" role="alert">
      <div className="text-center">
        <span className="text-6xl" aria-hidden="true">⛈️</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Weather Service Error</h1>
        <p className="text-sm text-gray-500 mt-2">मौसम सेवा में त्रुटि</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          {error.message || 'Failed to load weather data. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Try Again / पुनः प्रयास करें
        </button>
      </div>
    </div>
  );
}

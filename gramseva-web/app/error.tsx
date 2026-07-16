'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-full bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-6xl">⚠️</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Something went wrong</h1>
        <p className="text-sm text-gray-500 mt-2">कुछ गलत हो गया</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="mt-6 px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
        >
          Try Again / पुनः प्रयास करें
        </button>
      </div>
    </div>
  );
}

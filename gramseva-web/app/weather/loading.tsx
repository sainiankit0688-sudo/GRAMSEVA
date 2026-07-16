/**
 * Weather Module — FROZEN.
 * No further feature development. Bug fixes only.
 */

export default function WeatherLoading() {
  return (
    <div className="min-h-full bg-[#F5F5F5] animate-pulse">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #0277BD, #0288D1)' }}>
        <div className="h-6 bg-white/20 rounded w-32 mb-2" />
        <div className="h-3 bg-white/20 rounded w-24" />
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="h-10 bg-gray-200 rounded-xl" />
        <div className="h-8 bg-gray-200 rounded-full w-96" />
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-48 mb-3" />
          <div className="h-16 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

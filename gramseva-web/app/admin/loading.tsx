/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <div className="h-2 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-12" />
            <div className="h-1.5 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-24" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="flex-1 h-5 bg-gray-100 rounded-full" />
                <div className="h-3 bg-gray-200 rounded w-6" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

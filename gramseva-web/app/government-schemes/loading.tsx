/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

export default function GovernmentSchemesLoading() {
  return (
    <div className="min-h-full bg-[#F5F5F5] animate-pulse">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
        <div className="h-6 bg-white/20 rounded w-44 mb-2" />
        <div className="h-3 bg-white/20 rounded w-32" />
      </div>

      <div className="px-4 py-4">
        <div className="h-11 bg-gray-200 rounded-xl mb-4" />

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-20 flex-shrink-0" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                  <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                  <div className="h-2 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

export default function SchemeDetailLoading() {
  return (
    <div className="min-h-full bg-[#F5F5F5] animate-pulse">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
        <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/20 rounded w-1/2" />
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

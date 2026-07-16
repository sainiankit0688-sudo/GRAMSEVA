export default function EmergencyLoading() {
  return (
    <div className="min-h-full bg-[#F5F5F5] animate-pulse">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #B71C1C, #C62828)' }}>
        <div className="h-6 bg-white/20 rounded w-40 mb-2" />
        <div className="h-3 bg-white/20 rounded w-28" />
      </div>
      <div className="px-4 py-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

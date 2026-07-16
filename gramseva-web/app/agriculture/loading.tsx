export default function AgricultureLoading() {
  return (
    <div className="min-h-full bg-[#F5F5F5] animate-pulse">
      {/* Header */}
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <div className="h-6 bg-white/20 rounded w-32 mb-2" />
        <div className="h-3 bg-white/20 rounded w-24" />
      </div>

      {/* Cards Grid */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-28 mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-200" />
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-2 bg-gray-200 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

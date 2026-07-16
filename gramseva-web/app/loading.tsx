export default function Loading() {
  return (
    <div className="min-h-full bg-[#F5F5F5] animate-pulse">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <div className="h-3 bg-white/20 rounded w-28 mb-2" />
        <div className="h-6 bg-white/20 rounded w-40 mb-1" />
        <div className="h-3 bg-white/20 rounded w-52 mb-1" />
        <div className="h-2 bg-white/20 rounded w-44 mb-4" />
        <div className="flex gap-3">
          <div className="h-9 bg-white/20 rounded-full w-28" />
          <div className="h-9 bg-white/20 rounded-full w-24" />
        </div>
        <div className="h-11 bg-white/30 rounded-xl mt-4" />
      </div>

      <div className="px-4 -mt-3">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="h-2 bg-gray-200 rounded w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="h-5 bg-gray-200 rounded w-28 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-gray-200 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CropDetailLoading() {
  return (
    <div className="min-h-full bg-[#F5F5F5] animate-pulse">
      {/* Header */}
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <div className="h-4 bg-white/20 rounded w-16 mb-3" />
        <div className="h-6 bg-white/20 rounded w-40 mb-2" />
        <div className="h-3 bg-white/20 rounded w-24" />
      </div>

      {/* Image */}
      <div className="px-4 mt-4">
        <div className="w-full h-56 bg-gray-200 rounded-2xl" />
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

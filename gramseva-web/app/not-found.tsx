import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-full bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-6xl">🔍</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h1>
        <p className="text-sm text-gray-500 mt-2">पृष्ठ नहीं मिला</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
        >
          ← Back to Home / होम पर वापस जाएं
        </Link>
      </div>
    </div>
  );
}

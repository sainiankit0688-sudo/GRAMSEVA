'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useBookmarks } from './useBookmarks';

interface BookmarkButtonProps {
  itemId: string;
  className?: string;
  showLabel?: boolean;
}

export default function BookmarkButton({ itemId, className = '', showLabel = true }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(itemId);

  return (
    <button
      onClick={() => toggleBookmark(itemId)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${className} ${
        saved
          ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-200'
      }`}
      aria-label={saved ? 'Remove bookmark' : 'Bookmark this item'}
    >
      <svg className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {showLabel && (saved ? 'Saved' : 'Save')}
    </button>
  );
}

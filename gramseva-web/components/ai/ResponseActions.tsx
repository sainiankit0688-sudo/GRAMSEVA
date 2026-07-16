'use client';

/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useCallback } from 'react';
import type { Message, ReactionType } from '@/lib/ai/types';

interface ResponseActionsProps {
  message: Message;
  onCopy: (text: string) => void;
  onReaction: (messageId: string, reaction: ReactionType) => void;
  onRegenerate?: () => void;
}

export default function ResponseActions({ message, onCopy, onReaction, onRegenerate }: ResponseActionsProps) {
  const reactions = message.reactions || [];
  const isLiked = reactions.includes('like');
  const isDisliked = reactions.includes('dislike');
  const isBookmarked = reactions.includes('bookmark');

  const handleCopy = useCallback(() => {
    onCopy(message.content);
  }, [onCopy, message.content]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'GramSeva AI Response', text: message.content });
      } catch { /* User cancelled */ }
    } else {
      onCopy(message.content);
    }
  }, [message.content, onCopy]);

  return (
    <div className="flex items-center gap-1 mt-1.5 flex-wrap" role="group" aria-label="Message actions">
      <button type="button" onClick={handleCopy} className="text-[10px] text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded transition-colors" aria-label="Copy message" aria-pressed={false}>
        {isLiked ? '👍' : '📋'} Copy
      </button>
      <button type="button" onClick={handleShare} className="text-[10px] text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded transition-colors" aria-label="Share message">
        📤 Share
      </button>
      <button type="button" onClick={() => onReaction(message.id, 'like')} className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`} aria-label={isLiked ? 'Remove like' : 'Like'} aria-pressed={isLiked}>
        👍 Like
      </button>
      <button type="button" onClick={() => onReaction(message.id, 'dislike')} className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${isDisliked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`} aria-label={isDisliked ? 'Remove dislike' : 'Dislike'} aria-pressed={isDisliked}>
        👎
      </button>
      <button type="button" onClick={() => onReaction(message.id, 'bookmark')} className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${isBookmarked ? 'text-amber-600 bg-amber-50' : 'text-gray-400 hover:text-gray-600'}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'} aria-pressed={isBookmarked}>
        🔖
      </button>
      {onRegenerate && (
        <button type="button" onClick={onRegenerate} className="text-[10px] text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded transition-colors" aria-label="Regenerate response">
          🔄 Retry
        </button>
      )}
    </div>
  );
}

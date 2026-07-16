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

/**
 * ChatMessage — renders a single message bubble with actions, suggestions, references.
 */
import type { Message, ReactionType, SmartSuggestion } from '@/lib/ai/types';
import ResponseActions from './ResponseActions';
import SmartSuggestions from './SmartSuggestions';
import SourceReferences from './SourceReferences';

interface ChatMessageProps {
  message: Message;
  onCopy: (text: string) => void;
  onReaction: (messageId: string, reaction: ReactionType) => void;
  onRegenerate?: () => void;
  suggestions?: SmartSuggestion[];
  onSuggestionSelect?: (text: string) => void;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

export default function ChatMessage({ message, onCopy, onReaction, onRegenerate, suggestions, onSuggestionSelect }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isStreaming = message.status === 'streaming';
  const isLastAssistant = !isUser && message.status === 'sent';

  if (message.role === 'system') return null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`} role="listitem" aria-label={`${isUser ? 'You' : 'AI'}: ${message.content.slice(0, 80)}`}>
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl rounded-br-md'
              : isError
                ? 'bg-red-50 text-red-700 border border-red-200 rounded-2xl rounded-bl-md'
                : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-2xl rounded-bl-md'
          }`}
        >
          {message.content || (isStreaming ? '' : '...')}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 px-1">
          <time className="text-[10px] text-gray-400" dateTime={message.timestamp}>{formatTime(message.timestamp)}</time>
        </div>

        {!isUser && isLastAssistant && (
          <ResponseActions message={message} onCopy={onCopy} onReaction={onReaction} onRegenerate={onRegenerate} />
        )}

        {message.references && message.references.length > 0 && (
          <SourceReferences references={message.references} />
        )}

        {isLastAssistant && suggestions && suggestions.length > 0 && onSuggestionSelect && (
          <SmartSuggestions suggestions={suggestions} onSelect={onSuggestionSelect} />
        )}
      </div>
    </div>
  );
}

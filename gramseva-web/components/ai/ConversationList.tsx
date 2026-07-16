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
 * ConversationList — sidebar list of saved conversations with search & delete.
 */
'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Conversation, AiModule } from '@/lib/ai/types';
import { MODULE_ICONS } from '@/lib/ai/prompts';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  module?: AiModule;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return d.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

export default function ConversationList({ conversations, activeId, onSelect, onDelete, module }: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = module ? conversations.filter((c) => c.module === module) : conversations;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.messages.some((m) => m.content.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [conversations, search, module]);

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      onDelete(id);
    },
    [onDelete],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 pl-8 text-xs bg-gray-50 outline-none focus:border-[#3949AB]"
            aria-label="Search conversations"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true">🔍</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto" role="list" aria-label="Conversations">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No conversations yet</p>
        ) : (
          filtered.map((conv) => {
            const lastMsg = [...conv.messages].reverse().find((m) => m.role === 'assistant');
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                className={`w-full text-left px-3 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-2 ${
                  activeId === conv.id ? 'bg-indigo-50 border-l-2 border-l-[#3949AB]' : ''
                }`}
                role="listitem"
                aria-current={activeId === conv.id ? 'true' : undefined}
              >
                <span className="text-base mt-0.5 flex-shrink-0" aria-hidden="true">
                  {MODULE_ICONS[conv.module] || '🤖'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{conv.title}</p>
                  {lastMsg && (
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{lastMsg.content}</p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-0.5">{formatDate(conv.updatedAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="text-gray-300 hover:text-red-500 text-xs flex-shrink-0 mt-0.5 transition-colors"
                  aria-label={`Delete conversation: ${conv.title}`}
                >
                  ✕
                </button>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

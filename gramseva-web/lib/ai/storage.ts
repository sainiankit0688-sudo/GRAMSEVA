/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { Conversation, ConversationStorage } from './types';

const STORAGE_KEY = 'gs_ai_conversations';
const MAX_CONVERSATIONS = 50;
const MAX_MESSAGES_PER_CONVERSATION = 100;

function safeGet(key: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage full or unavailable
  }
}

function safeRemove(key: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export const conversationStorage: ConversationStorage = {
  getConversations(): Conversation[] {
    const raw = safeGet(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getConversation(id: string): Conversation | null {
    const conversations = this.getConversations();
    return conversations.find((c) => c.id === id) || null;
  },

  saveConversation(conv: Conversation): void {
    const conversations = this.getConversations();
    const existing = conversations.findIndex((c) => c.id === conv.id);

    const trimmed = {
      ...conv,
      messages: conv.messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
    };

    if (existing >= 0) {
      conversations[existing] = trimmed;
    } else {
      conversations.unshift(trimmed);
    }

    const limited = conversations.slice(0, MAX_CONVERSATIONS);
    safeSet(STORAGE_KEY, JSON.stringify(limited));
  },

  deleteConversation(id: string): void {
    const conversations = this.getConversations().filter((c) => c.id !== id);
    safeSet(STORAGE_KEY, JSON.stringify(conversations));
  },

  clearAll(): void {
    safeRemove(STORAGE_KEY);
  },
};

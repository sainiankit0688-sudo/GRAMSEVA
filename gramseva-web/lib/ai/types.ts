/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

export type AiModule = 'general' | 'agriculture' | 'schemes' | 'weather' | 'education' | 'emergency' | 'complaints';

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'streaming' | 'error' | 'stopped';

export type AiProviderName = 'groq' | 'gemini' | 'openai';

export type ExportFormat = 'pdf' | 'markdown' | 'text';

export type ReactionType = 'like' | 'dislike' | 'bookmark';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status: MessageStatus;
  reactions?: ReactionType[];
  references?: Reference[];
}

export interface Conversation {
  id: string;
  title: string;
  module: AiModule;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  data?: string;
}

export interface Reference {
  type: AiModule | 'provider';
  title: string;
  url?: string;
  description?: string;
}

export interface SmartSuggestion {
  text: string;
  icon?: string;
}

export interface RateLimitState {
  isLimited: boolean;
  remainingMs: number;
  retryAfter: number;
}

export interface AiProvider {
  name: AiProviderName;
  sendMessage(messages: Message[], module: AiModule): Promise<string>;
  streamMessage(
    messages: Message[],
    module: AiModule,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void>;
}

export interface ConversationStorage {
  getConversations(): Conversation[];
  getConversation(id: string): Conversation | null;
  saveConversation(conv: Conversation): void;
  deleteConversation(id: string): void;
  clearAll(): void;
}

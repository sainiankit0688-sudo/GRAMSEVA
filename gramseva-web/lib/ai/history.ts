/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { AiModule, Conversation, Message } from './types';
import { conversationStorage } from './storage';
import { getSystemPrompt } from './prompts';

export function createConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createMessage(role: Message['role'], content: string, status: Message['status'] = 'sent'): Message {
  return {
    id: createMessageId(),
    role,
    content,
    timestamp: new Date().toISOString(),
    status,
  };
}

export function startConversation(module: AiModule, firstMessage?: string): Conversation {
  const now = new Date().toISOString();
  const messages: Message[] = [];

  const systemMessage = createMessage('system', getSystemPrompt(module));
  messages.push(systemMessage);

  if (firstMessage) {
    messages.push(createMessage('user', firstMessage));
  }

  const title = firstMessage
    ? firstMessage.length > 50
      ? firstMessage.slice(0, 50) + '...'
      : firstMessage
    : 'New conversation';

  const conversation: Conversation = {
    id: createConversationId(),
    title,
    module,
    messages,
    createdAt: now,
    updatedAt: now,
  };

  conversationStorage.saveConversation(conversation);
  return conversation;
}

export function addMessageToConversation(
  conversationId: string,
  role: Message['role'],
  content: string,
  status: Message['status'] = 'sent',
): Conversation | null {
  const conv = conversationStorage.getConversation(conversationId);
  if (!conv) return null;

  const msg = createMessage(role, content, status);
  conv.messages.push(msg);
  conv.updatedAt = new Date().toISOString();

  if (role === 'user' && conv.messages.filter((m) => m.role === 'user').length === 1) {
    conv.title = content.length > 50 ? content.slice(0, 50) + '...' : content;
  }

  conversationStorage.saveConversation(conv);
  return conv;
}

export function updateLastAssistantMessage(
  conversationId: string,
  content: string,
  status: Message['status'] = 'sent',
): Conversation | null {
  const conv = conversationStorage.getConversation(conversationId);
  if (!conv) return null;

  for (let i = conv.messages.length - 1; i >= 0; i--) {
    if (conv.messages[i].role === 'assistant') {
      conv.messages[i].content = content;
      conv.messages[i].status = status;
      break;
    }
  }

  conv.updatedAt = new Date().toISOString();
  conversationStorage.saveConversation(conv);
  return conv;
}

export function getConversations(module?: AiModule): Conversation[] {
  const all = conversationStorage.getConversations();
  if (module) return all.filter((c) => c.module === module);
  return all;
}

export function getConversation(id: string): Conversation | null {
  return conversationStorage.getConversation(id);
}

export function deleteConversation(id: string): void {
  conversationStorage.deleteConversation(id);
}

/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

export type { AiModule, Message, MessageRole, MessageStatus, Conversation, AiProvider, AiProviderName, ConversationStorage, FileAttachment, Reference, SmartSuggestion, RateLimitState, ExportFormat, ReactionType } from './types';
export { getSystemPrompt, getModuleTitle, MODULE_ICONS, POPULAR_QUESTIONS, QUICK_ACTIONS } from './prompts';
export { conversationStorage } from './storage';
export {
  createConversationId,
  createMessageId,
  createMessage,
  startConversation,
  addMessageToConversation,
  updateLastAssistantMessage,
  getConversations,
  getConversation,
  deleteConversation,
} from './history';
export { sendMessageWithHistory, setActiveProvider, getActiveProvider } from './provider';
export { detectModule, getSmartSuggestions } from './context';
export { checkRateLimit, recordRequest, recordError, formatRetryTime } from './rateLimit';
export { exportConversation } from './export';

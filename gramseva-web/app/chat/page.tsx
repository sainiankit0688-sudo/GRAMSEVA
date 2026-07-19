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
 * Chat Page Phase 2 — multi-provider, context-aware, streaming, voice, file, export, suggestions.
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatMessage, ChatInput, TypingIndicator, EmptyChatState, ConversationList, ExportDialog, RateLimitNotice } from '@/components/ai';
import { getModuleTitle } from '@/lib/ai/prompts';
import { detectModule, getSmartSuggestions } from '@/lib/ai/context';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import {
  getConversations,
  getConversation,
  startConversation,
  addMessageToConversation,
  deleteConversation,
  createMessage,
} from '@/lib/ai/history';
import { sendMessageWithHistory } from '@/lib/ai/provider';
import { getActiveProvider, setActiveProvider } from '@/lib/ai/provider';
import { useGuestAiLimit } from '@/hooks/useGuestAiLimit';
import type { AiModule, AiProviderName, Conversation, Message, ReactionType } from '@/lib/ai/types';

const MODULE_OPTIONS: { module: AiModule; label: string; icon: string }[] = [
  { module: 'general', label: 'General', icon: '🤖' },
  { module: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { module: 'schemes', label: 'Schemes', icon: '📋' },
  { module: 'weather', label: 'Weather', icon: '🌤️' },
  { module: 'education', label: 'Education', icon: '📚' },
  { module: 'emergency', label: 'Emergency', icon: '🚨' },
  { module: 'complaints', label: 'Complaints', icon: '📝' },
];

const PROVIDER_OPTIONS = [
  { value: 'groq', label: 'Groq' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'openai', label: 'OpenAI' },
] as const;

function loadInitialConv(convId: string | null): { conv: Conversation | null; msgs: Message[]; module: AiModule } {
  if (convId) {
    const conv = getConversation(convId);
    if (conv) {
      return { conv, msgs: conv.messages.filter((m) => m.role !== 'system'), module: conv.module };
    }
  }
  return { conv: null, msgs: [], module: 'general' };
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const convId = searchParams.get('conv');
  const initial = useMemo(() => loadInitialConv(convId), [convId]);

  const [conversations, setConversations] = useState<Conversation[]>(() => getConversations());
  const [activeConv, setActiveConv] = useState<Conversation | null>(initial.conv);
  const [messages, setMessages] = useState<Message[]>(initial.msgs);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeModule, setActiveModule] = useState<AiModule>(initial.module);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [rateLimitState, setRateLimitState] = useState(() => checkRateLimit());
  const [reactions, setReactions] = useState<Record<string, ReactionType[]>>({});
  const [provider, setProvider] = useState(getActiveProvider);
  const { canSend, showLimitCard, consumeMessage } = useGuestAiLimit();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimitState(checkRateLimit());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleMessages = useMemo(() => messages.filter((m) => m.role === 'user' || m.role === 'assistant'), [messages]);

  const lastAssistantMsg = useMemo(() => {
    for (let i = visibleMessages.length - 1; i >= 0; i--) {
      if (visibleMessages[i].role === 'assistant' && visibleMessages[i].status === 'sent') return visibleMessages[i];
    }
    return null;
  }, [visibleMessages]);

  const suggestions = useMemo(() => {
    if (lastAssistantMsg?.content) return getSmartSuggestions(activeModule, lastAssistantMsg.content);
    return [];
  }, [lastAssistantMsg, activeModule]);

  const handleNewChat = useCallback(() => {
    setActiveConv(null);
    setMessages([]);
    setActiveModule('general');
    setReactions({});
    router.push('/chat');
  }, [router]);

  const handleModuleChange = useCallback((module: AiModule) => { setActiveModule(module); }, []);

  const handleProviderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value as AiProviderName;
    setActiveProvider(name);
    setProvider(name);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (!canSend) return;

    const detectedModule = detectModule(text, activeModule);
    if (detectedModule !== activeModule) setActiveModule(detectedModule);

    if (!consumeMessage()) return;

    const userMsg = createMessage('user', text, 'sent');
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setIsStreaming(true);

    let conv = activeConv;
    if (!conv) {
      conv = startConversation(detectedModule, text);
      setActiveConv(conv);
      setConversations(getConversations());
      router.replace(`/chat?conv=${conv.id}`, { scroll: false });
    } else {
      addMessageToConversation(conv.id, 'user', text, 'sent');
    }

    const assistantMsg = createMessage('assistant', '', 'streaming');
    setMessages([...updatedMessages, assistantMsg]);
    abortRef.current = new AbortController();

    try {
      await sendMessageWithHistory(
        conv.id, text, detectedModule,
        (fullText) => {
          setMessages((prev) => {
            const u = [...prev];
            const last = u[u.length - 1];
            if (last?.role === 'assistant') u[u.length - 1] = { ...last, content: fullText, status: 'streaming' };
            return u;
          });
        },
        abortRef.current.signal,
      );
      setMessages((prev) => {
        const u = [...prev];
        const last = u[u.length - 1];
        if (last?.role === 'assistant') u[u.length - 1] = { ...last, status: 'sent' };
        return u;
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : '';
      if (msg.startsWith('RATE_LIMITED:')) {
        const ms = parseInt(msg.split(':')[1], 10) || 10000;
        setRateLimitState({ isLimited: true, remainingMs: ms, retryAfter: ms });
      } else {
        setMessages((prev) => {
          const u = [...prev];
          const last = u[u.length - 1];
          if (last?.role === 'assistant') u[u.length - 1] = { ...last, content: 'Something went wrong. Please try again.', status: 'error' };
          return u;
        });
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setConversations(getConversations());
    }
  }, [activeConv, activeModule, isLoading, messages, router, canSend, consumeMessage]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setIsStreaming(false);
    setMessages((prev) => {
      const u = [...prev];
      const last = u[u.length - 1];
      if (last?.role === 'assistant' && last.status === 'streaming') u[u.length - 1] = { ...last, status: 'stopped' };
      return u;
    });
  }, []);

  const handleRetry = useCallback(() => {
    if (!visibleMessages.length) return;
    const lastUserMsg = [...visibleMessages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      setMessages((prev) => prev.filter((m) => m.id !== visibleMessages[visibleMessages.length - 1]?.id));
      handleSend(lastUserMsg.content);
    }
  }, [visibleMessages, handleSend]);

  const handleReaction = useCallback((messageId: string, reaction: ReactionType) => {
    setReactions((prev) => {
      const current = prev[messageId] || [];
      const next = current.includes(reaction) ? current.filter((r) => r !== reaction) : [...current, reaction];
      return { ...prev, [messageId]: next };
    });
  }, []);

  const handleCopyMessage = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  const handleClearChat = useCallback(() => {
    if (activeConv) { deleteConversation(activeConv.id); setConversations(getConversations()); }
    handleNewChat();
  }, [activeConv, handleNewChat]);

  const handleSelectConversation = useCallback((id: string) => { router.push(`/chat?conv=${id}`); setShowSidebar(false); }, [router]);
  const handleDeleteConversation = useCallback((id: string) => { deleteConversation(id); setConversations(getConversations()); }, []);

  const messagesWithReactions = useMemo(
    () => visibleMessages.map((m) => ({ ...m, reactions: reactions[m.id] || [] })),
    [visibleMessages, reactions],
  );

  const currentModule = MODULE_OPTIONS.find((m) => m.module === activeModule) || MODULE_OPTIONS[0];

  return (
    <div className="h-screen flex bg-[#F5F5F5]">
      {showExport && activeConv && <ExportDialog conversation={activeConv} onClose={() => setShowExport(false)} />}

      <aside className={`w-72 bg-white border-r border-gray-100 flex-col flex-shrink-0 ${showSidebar ? 'flex' : 'hidden'} lg:flex absolute lg:relative inset-0 z-40 lg:z-auto`} aria-label="Conversation sidebar">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Chats</h2>
          <button type="button" onClick={handleNewChat} className="text-xs font-medium text-[#3949AB] hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded">+ New</button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ConversationList conversations={conversations} activeId={activeConv?.id} onSelect={handleSelectConversation} onDelete={handleDeleteConversation} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gradient-to-r from-[#1A237E] to-[#3949AB] px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.push('/ai')} className="text-white/80 hover:text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded" aria-label="Back to AI dashboard">←</button>
            <span className="text-lg" aria-hidden="true">{currentModule.icon}</span>
            <h1 className="text-sm font-bold text-white">{getModuleTitle(activeModule)}</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <select value={activeModule} onChange={(e) => handleModuleChange(e.target.value as AiModule)} className="bg-white/20 text-white text-xs rounded-lg px-2 py-1.5 border border-white/30 outline-none focus:ring-2 focus:ring-white/50" aria-label="AI module">
              {MODULE_OPTIONS.map((m) => (<option key={m.module} value={m.module} className="text-gray-800">{m.icon} {m.label}</option>))}
            </select>
            <select value={provider} onChange={handleProviderChange} className="bg-white/20 text-white text-xs rounded-lg px-2 py-1.5 border border-white/30 outline-none focus:ring-2 focus:ring-white/50" aria-label="AI provider">
              {PROVIDER_OPTIONS.map((p) => (<option key={p.value} value={p.value} className="text-gray-800">{p.label}</option>))}
            </select>
            <button type="button" onClick={() => setShowExport(true)} className="text-white/70 hover:text-white text-xs px-1.5 focus:outline-none focus:ring-2 focus:ring-white/50 rounded" aria-label="Export conversation">📤</button>
            <button type="button" onClick={handleClearChat} className="text-white/70 hover:text-white text-xs px-1.5 focus:outline-none focus:ring-2 focus:ring-white/50 rounded" aria-label="Clear chat">Clear</button>
            <button type="button" onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden text-white/70 hover:text-white text-sm px-1.5 focus:outline-none focus:ring-2 focus:ring-white/50 rounded" aria-label="Toggle sidebar">☰</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4" role="log" aria-label="Chat messages" aria-live="polite">
          {rateLimitState.isLimited && (
            <div className="max-w-2xl mx-auto mb-3">
              <RateLimitNotice remainingMs={rateLimitState.remainingMs} />
            </div>
          )}
          {showLimitCard && (
            <div className="max-w-sm mx-auto my-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Daily AI Limit Reached</h3>
              <p className="text-sm text-gray-500 mb-4">आज की AI सीमा पूरी हो गई</p>
              <div className="bg-green-50 rounded-xl p-4 mb-4 text-left">
                <p className="text-sm font-semibold text-green-800 mb-2">Login to continue using GramSeva AI.</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-sm text-green-700">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Unlimited AI
                  </li>
                  <li className="flex items-center gap-2 text-sm text-green-700">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Conversation History
                  </li>
                  <li className="flex items-center gap-2 text-sm text-green-700">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Better Responses
                  </li>
                  <li className="flex items-center gap-2 text-sm text-green-700">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Saved Chats
                  </li>
                </ul>
              </div>
              <a href="/login" className="inline-block w-full py-3 rounded-xl text-white font-bold text-center transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
                Login / लॉगिन
              </a>
            </div>
          )}
          {!showLimitCard && messagesWithReactions.length === 0 && !isLoading ? (
            <EmptyChatState module={activeModule} onSuggestion={handleSend} />
          ) : (
            <div className="max-w-2xl mx-auto" role="list" aria-label="Messages">
              {messagesWithReactions.map((msg, i) => {
                const isLast = i === messagesWithReactions.length - 1 && msg.role === 'assistant' && msg.status === 'sent';
                return (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onCopy={handleCopyMessage}
                    onReaction={handleReaction}
                    onRegenerate={isLast ? handleRetry : undefined}
                    suggestions={isLast ? suggestions : undefined}
                    onSuggestionSelect={isLast ? handleSend : undefined}
                  />
                );
              })}
              {isLoading && messagesWithReactions[messagesWithReactions.length - 1]?.role !== 'assistant' && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto w-full">
          {!showLimitCard ? (
            <ChatInput onSend={handleSend} onStop={isStreaming ? handleStop : undefined} disabled={isLoading && !isStreaming} isStreaming={isStreaming} placeholder={`Ask ${currentModule.label} AI...`} />
          ) : (
            <div className="px-4 py-3 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-100">
              <a href="/login" className="text-green-700 font-semibold hover:underline">Login</a> to continue using AI
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

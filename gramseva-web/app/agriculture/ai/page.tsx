'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const agricultureQuickPrompts = [
  { label: 'Wheat best fertilizer schedule?', icon: '🌾' },
  { label: 'Rice paddy disease treatment', icon: '🌾' },
  { label: 'Organic farming kaise karein?', icon: '🌿' },
  { label: 'PM Kisan eligibility & apply', icon: '💰' },
  { label: 'Drip irrigation setup cost?', icon: '💧' },
  { label: 'Cotton pest IPM methods', icon: '🐛' },
  { label: 'Soil pH kaise test karein?', icon: '🌱' },
  { label: 'Best time to sell wheat in mandi?', icon: '📊' },
];

export default function AgricultureAiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'नमस्ते किसान भाई! 🙏\n\nमैं GramSeva Kisan AI हूं — आपका कृषि सहायक।\n\nमैं फसल, उर्वरक, कीटनाशक, सिंचाई, मौसम, मंडी भाव और सरकारी योजनाओं के बारे में मदद कर सकता हूं।\n\nHello farmer! I\'m your agriculture assistant. Ask me anything about crops, fertilizer, pest control, irrigation, weather, market prices, or government schemes — in Hindi or English!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    const userMessage: Message = { role: 'user', content: messageText };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/agriculture-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get response');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages([
                  ...newMessages,
                  { role: 'assistant', content: assistantContent },
                ]);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `⚠️ Error: ${errMsg}\n\nकृपया पुनः प्रयास करें। Please try again.`,
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const formatMessage = (content: string) => {
    return escapeHtml(content)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Header */}
      <div
        className="px-4 py-3 text-white flex items-center gap-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)' }}
      >
        <Link
          href="/agriculture"
          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
          aria-label="Back to Agriculture"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
          🌾
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base">Kisan AI</h1>
          <p className="text-green-100 text-xs">
            {isStreaming ? '✍️ Writing...' : '🟢 Online • Powered by Llama 3.3'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F5F5F5]">
        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-2 text-center">
              Farming quick questions / कृषि त्वरित प्रश्न
            </p>
            <div className="grid grid-cols-2 gap-2">
              {agricultureQuickPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => sendMessage(prompt.label)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-left text-xs text-gray-700 font-medium hover:bg-green-50 hover:border-green-200 transition-colors flex items-center gap-2"
                >
                  <span>{prompt.icon}</span>
                  <span className="leading-tight">{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1">
                🌾
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                ${
                  msg.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                }`}
              style={
                msg.role === 'user'
                  ? { background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }
                  : {}
              }
            >
              {msg.role === 'assistant' && msg.content === '' ? (
                <span className="flex gap-1 py-0.5" role="status" aria-label="Assistant is typing">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </span>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 focus-within:border-green-400 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="कृषि सवाल पूछें / Ask a farming question..."
              aria-label="Ask a farming question"
              rows={1}
              disabled={isStreaming}
              className="w-full bg-transparent px-4 py-3 text-sm text-gray-800 outline-none resize-none max-h-24"
              style={{ scrollbarWidth: 'none' }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            aria-label="Send message"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-1.5">
          Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

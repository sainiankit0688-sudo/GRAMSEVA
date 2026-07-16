'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const quickPrompts = [
  { label: 'PM Kisan eligibility?', icon: '🌾' },
  { label: 'Ayushman Bharat कैसे मिलेगा?', icon: '🏥' },
  { label: 'PMAY के लिए कैसे apply करें?', icon: '🏠' },
  { label: 'Kisan Credit Card kya hai?', icon: '💳' },
  { label: 'Weather and crop advice', icon: '⛅' },
  { label: 'Sarkari naukri ke bare mein', icon: '💼' },
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'नमस्ते! 🙏 मैं GramSeva AI हूं।\n\nमैं आपकी सरकारी योजनाओं, कृषि, स्वास्थ्य, शिक्षा और नौकरी से जुड़ी जानकारी में मदद कर सकता हूं।\n\nHello! I\'m GramSeva AI. Ask me anything about government schemes, agriculture, health, education, or jobs in Hindi or English!',
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

    // Add empty assistant message
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
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
      <div className="px-4 py-3 text-white flex items-center gap-3 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A237E, #3949AB)' }}>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
        <div>
          <h1 className="font-bold text-base">GramSeva AI</h1>
          <p className="text-blue-100 text-xs">
            {isStreaming ? '✍️ Typing...' : '🟢 Online • Powered by Llama 3.3'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F5F5F5]" role="log" aria-live="polite" aria-label="Chat messages">
        {/* Quick Prompts (only at start) */}
        {messages.length === 1 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-2 text-center">Quick questions / त्वरित प्रश्न</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => sendMessage(prompt.label)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-left text-xs text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-200 transition-colors flex items-center gap-2"
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
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                ${msg.role === 'user'
                  ? 'text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                }`}
              style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' } : {}}
            >
              {msg.role === 'assistant' && msg.content === '' ? (
                <span className="flex gap-1 py-0.5" role="status" aria-label="Assistant is typing">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
          <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="सवाल पूछें / Ask a question..."
              aria-label="Ask a question"
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
        <p className="text-xs text-gray-400 text-center mt-1.5">Press Enter to send • Shift+Enter for new line</p>
      </div>
    </div>
  );
}

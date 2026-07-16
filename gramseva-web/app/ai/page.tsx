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
 * AI Dashboard — Hero, Quick Actions, Recent Conversations, Popular Questions.
 */
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Breadcrumb } from '@/components/agriculture';
import { ConversationList } from '@/components/ai';
import { QUICK_ACTIONS, POPULAR_QUESTIONS } from '@/lib/ai/prompts';
import { getConversations, deleteConversation, startConversation } from '@/lib/ai/history';
import type { AiModule, Conversation } from '@/lib/ai/types';

export default function AiDashboardPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(() => getConversations());
  const [showHistory, setShowHistory] = useState(false);

  const recentConversations = useMemo(() => conversations.slice(0, 5), [conversations]);

  const handleQuickAction = useCallback(
    (module: AiModule, prompt: string) => {
      const conv = startConversation(module, prompt);
      setConversations(getConversations());
      router.push(`/chat?conv=${conv.id}`);
    },
    [router],
  );

  const handlePopularQuestion = useCallback(
    (question: string, module: AiModule) => {
      const conv = startConversation(module, question);
      setConversations(getConversations());
      router.push(`/chat?conv=${conv.id}`);
    },
    [router],
  );

  const handleSelectConversation = useCallback(
    (id: string) => {
      router.push(`/chat?conv=${id}`);
    },
    [router],
  );

  const handleDeleteConversation = useCallback((id: string) => {
    deleteConversation(id);
    setConversations(getConversations());
  }, []);

  const handleNewChat = useCallback(() => {
    router.push('/chat');
  }, [router]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <div className="relative">
        <PageHeader
          title="GramSeva AI"
          titleHindi="ग्रामसेवा AI"
          icon="🤖"
          gradient="linear-gradient(135deg, #1A237E, #3949AB)"
        >
          <p className="text-indigo-200 text-xs mt-1">
            Your intelligent assistant for rural India
          </p>
        </PageHeader>
      </div>

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'AI Assistant' },
      ]} />

      <div className="px-4 py-5 flex flex-col gap-5">

        {/* Hero CTA */}
        <div className="bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-2xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl" aria-hidden="true">🤖</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">GramSeva AI</h2>
          <p className="text-indigo-200 text-sm mb-1">ग्रामसेवा AI — आपका डिजिटल सहायक</p>
          <p className="text-indigo-300 text-xs mb-4">
            Ask anything about agriculture, government schemes, weather, education & more
          </p>
          <button
            type="button"
            onClick={handleNewChat}
            className="px-6 py-3 bg-white text-[#1A237E] font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Start New Chat / नई चैट शुरू करें
          </button>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.module}
                type="button"
                onClick={() => handleQuickAction(action.module, action.prompt)}
                className="flex flex-col items-center gap-1.5 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: action.color + '15' }}
                  aria-hidden="true"
                >
                  {action.icon}
                </span>
                <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                <span className="text-[10px] text-gray-400">{action.labelHindi}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Questions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Popular Questions</h3>
          <div className="flex flex-col gap-2">
            {POPULAR_QUESTIONS.map((q) => (
              <button
                key={q.question}
                type="button"
                onClick={() => handlePopularQuestion(q.question, q.module)}
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <span className="text-lg flex-shrink-0" aria-hidden="true">{q.icon}</span>
                <span className="text-sm text-gray-700">{q.question}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Recent Conversations</h3>
            {recentConversations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs font-medium text-[#3949AB] hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
                aria-expanded={showHistory}
              >
                {showHistory ? 'Hide' : 'View All'}
              </button>
            )}
          </div>

          {recentConversations.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <span className="text-3xl" aria-hidden="true">💬</span>
              <p className="text-sm text-gray-500 mt-2">No conversations yet</p>
              <p className="text-xs text-gray-400">Start a chat to see your history here</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ maxHeight: showHistory ? '500px' : '250px' }}>
              <ConversationList
                conversations={recentConversations}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
              />
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex gap-2">
          <span className="text-indigo-500 text-sm flex-shrink-0" aria-hidden="true">ℹ️</span>
          <p className="text-xs text-indigo-700">
            GramSeva AI provides general guidance. For official information, please verify with government sources.
            <span className="block text-indigo-500 mt-0.5">
              ग्रामसेवा AI सामान्य मार्गदर्शन प्रदान करता है।
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

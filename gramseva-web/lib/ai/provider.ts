/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { AiModule, AiProvider, AiProviderName, Message } from './types';
import { getSystemPrompt } from './prompts';
import { addMessageToConversation, updateLastAssistantMessage } from './history';
import { checkRateLimit, recordRequest, recordError } from './rateLimit';

function buildApiMessages(messages: Message[], module: AiModule) {
  return [
    { role: 'system', content: getSystemPrompt(module) },
    ...messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content })),
  ];
}

async function parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  onChunk: (chunk: string) => void,
): Promise<void> {
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch {
        // Skip malformed lines
      }
    }
  }
}

// ─── Groq Provider ─────────────────────────────────────────────────────────

class GroqProvider implements AiProvider {
  name: AiProviderName = 'groq';
  private apiUrl = '/api/chat';

  async sendMessage(messages: Message[], module: AiModule): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: buildApiMessages(messages, module) }),
    });
    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
    return response.text();
  }

  async streamMessage(
    messages: Message[], module: AiModule,
    onChunk: (chunk: string) => void, signal?: AbortSignal,
  ): Promise<void> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: buildApiMessages(messages, module) }),
      signal,
    });
    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response stream');
    await parseSSEStream(reader, new TextDecoder(), onChunk);
  }
}

// ─── Gemini Provider (architecture-ready) ──────────────────────────────────

class GeminiProvider implements AiProvider {
  name: AiProviderName = 'gemini';
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta';

  async sendMessage(messages: Message[], module: AiModule): Promise<string> {
    const apiKey = typeof window !== 'undefined' ? '' : '';
    if (!apiKey) throw new Error('Gemini API key not configured');
    const model = 'gemini-2.0-flash';
    const contents = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    const response = await fetch(
      `${this.apiUrl}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: getSystemPrompt(module) }] },
        }),
      },
    );
    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async streamMessage(
    messages: Message[], module: AiModule,
    onChunk: (chunk: string) => void, signal?: AbortSignal,
  ): Promise<void> {
    const full = await this.sendMessage(messages, module);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const words = full.split(' ');
    let acc = '';
    for (const word of words) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      acc += (acc ? ' ' : '') + word;
      onChunk(acc);
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

// ─── OpenAI Provider (architecture-ready) ──────────────────────────────────

class OpenAIProvider implements AiProvider {
  name: AiProviderName = 'openai';
  private apiUrl = 'https://api.openai.com/v1';

  async sendMessage(messages: Message[], module: AiModule): Promise<string> {
    const apiKey = typeof window !== 'undefined' ? '' : '';
    if (!apiKey) throw new Error('OpenAI API key not configured');
    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: buildApiMessages(messages, module),
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async streamMessage(
    messages: Message[], module: AiModule,
    onChunk: (chunk: string) => void, signal?: AbortSignal,
  ): Promise<void> {
    const apiKey = typeof window !== 'undefined' ? '' : '';
    if (!apiKey) throw new Error('OpenAI API key not configured');
    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: buildApiMessages(messages, module),
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
      }),
      signal,
    });
    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response stream');
    await parseSSEStream(reader, new TextDecoder(), onChunk);
  }
}

// ─── Provider Registry ─────────────────────────────────────────────────────

const PROVIDERS: Record<AiProviderName, AiProvider> = {
  groq: new GroqProvider(),
  gemini: new GeminiProvider(),
  openai: new OpenAIProvider(),
};

const FALLBACK_ORDER: AiProviderName[] = ['gemini', 'groq', 'openai'];

let activeProvider: AiProviderName = 'groq';

export function setActiveProvider(name: AiProviderName): void {
  activeProvider = name;
}

export function getActiveProvider(): AiProviderName {
  return activeProvider;
}

// ─── Resilient Send with Fallback ──────────────────────────────────────────

export async function sendMessageWithHistory(
  conversationId: string,
  userMessage: string,
  module: AiModule,
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const rateLimit = checkRateLimit();
  if (rateLimit.isLimited) {
    throw new Error(`RATE_LIMITED:${rateLimit.remainingMs}`);
  }

  const conv = addMessageToConversation(conversationId, 'user', userMessage, 'sent');
  if (!conv) throw new Error('Conversation not found');

  addMessageToConversation(conversationId, 'assistant', '', 'streaming');

  let fullResponse = '';
  const triedProviders = new Set<AiProviderName>();

  for (const providerName of FALLBACK_ORDER) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (triedProviders.has(providerName)) continue;
    triedProviders.add(providerName);

    const provider = PROVIDERS[providerName];
    try {
      recordRequest();
      if (onChunk) {
        await provider.streamMessage(conv.messages, module, (chunk) => {
          fullResponse += chunk;
          onChunk(fullResponse);
          updateLastAssistantMessage(conversationId, fullResponse, 'streaming');
        }, signal);
      } else {
        fullResponse = await provider.sendMessage(conv.messages, module);
      }
      updateLastAssistantMessage(conversationId, fullResponse, 'sent');
      return fullResponse;
    } catch (error) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      recordError();
      if (providerName === FALLBACK_ORDER[FALLBACK_ORDER.length - 1]) {
        const msg = error instanceof Error ? error.message : 'Failed to get response';
        updateLastAssistantMessage(conversationId, `Error: ${msg}`, 'error');
        throw error;
      }
      continue;
    }
  }

  throw new Error('All providers failed');
}

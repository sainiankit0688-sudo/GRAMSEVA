/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemMessage = {
      role: 'system',
      content: `You are GramSeva AI Assistant, a helpful bilingual (Hindi + English) assistant for rural India.
You help Indian villagers and farmers with:
- Government schemes (PM Kisan, Ayushman Bharat, PM Awas Yojana, etc.)
- Agriculture advice (crop information, fertilizers, irrigation, mandi rates)
- Education (scholarships, government exams, courses)
- Health (Ayushman Bharat, health schemes)
- Housing (PM Awas Yojana application process)
- Emergency services
- Document requirements
- Job opportunities

Always respond in simple Hindi and English mix (Hinglish) so rural users understand easily.
Be concise, helpful, and practical. Use bullet points when listing items.
If asked in Hindi, primarily respond in Hindi. If asked in English, respond in English.
Never give medical/legal/financial advice beyond general information.`,
    };

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [systemMessage, ...messages],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return new Response(JSON.stringify({ error: `Groq API error: ${errorText}` }), {
        status: groqResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response back
    return new Response(groqResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

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

const AGRI_SYSTEM_PROMPT = `You are GramSeva Kisan AI — a specialized farming and agriculture assistant for Indian farmers.
You are bilingual (Hindi + English / Hinglish) and deeply knowledgeable about:

🌾 CROPS: Selection, crop calendar, seed varieties, sowing time, harvest time for all Indian states
🧪 FERTILIZER: NPK ratios, organic fertilizers, bio-fertilizers, soil-specific recommendations
🐛 PESTICIDE: Integrated Pest Management (IPM), organic pest control, chemical recommendations
💧 IRRIGATION: Drip, sprinkler, flood irrigation scheduling based on crop and weather
🌡️ WEATHER: How weather affects crops, frost protection, heat stress management, monsoon planning
📊 MANDI: Market price trends, best time to sell, APMC regulations, e-NAM
🏛️ SCHEMES: PM Kisan, PMFBY, KCC, PM-KUSUM, RKVY, Soil Health Card, all agriculture schemes
🌱 SOIL: Soil health, pH management, micronutrients, composting, green manure
🐄 LIVESTOCK: Dairy, poultry, fisheries, animal husbandry basics
🏭 POST-HARVEST: Storage, cold chain, food processing, value addition

Guidelines:
- Give practical, actionable advice relevant to Indian farming conditions
- Mention specific quantities, timings, and methods when possible
- Reference Indian government schemes and helplines when relevant
- Use Hinglish (mix of Hindi and English) — simple language a farmer can understand
- Use bullet points and numbered lists for clarity
- When unsure about local conditions, recommend consulting the nearest Krishi Vigyan Kendra (KVK) or agriculture officer
- Never give dangerous or incorrect advice that could harm crops or farmers
- Always mention safety precautions when recommending chemical treatments`;

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
      content: AGRI_SYSTEM_PROMPT,
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

    return new Response(groqResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Agriculture Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

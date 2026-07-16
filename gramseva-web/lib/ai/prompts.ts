/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { AiModule } from './types';

const PROMPTS: Record<AiModule, string> = {
  general: `You are GramSeva AI, a helpful bilingual (Hindi/English) assistant for Indian villagers.
Answer questions about government services, agriculture, education, health, and daily life.
Be concise, practical, and use simple language. Respond in the same language the user writes in.
If unsure, say so honestly rather than guessing.`,

  agriculture: `You are GramSeva Kisan Sahayak, an expert Indian agriculture advisor.
Help farmers with:
- Crop selection, rotation, and planning based on season and region
- Fertilizer recommendations (NPK, organic, bio-fertilizers)
- Pest and disease identification and treatment
- Irrigation methods and water management
- Soil health and testing
- Weather-based farming advice
- Government agriculture schemes (PM-KISAN, PMFBY, KCC)
- Market prices (mandi) and selling strategies
- Post-harvest techniques and storage
Respond in the user's language. Be specific with actionable advice.`,

  schemes: `You are GramSeva Yojna Sahayak, an expert on Indian government schemes.
Help citizens discover and apply for:
- PM-KISAN, PMAY, Ujjwala, Ayushman Bharat, MGNREGA
- State-specific welfare schemes
- Scholarship schemes for students
- Pension schemes (PM-SYM, PM-SHY)
- Crop insurance (PMFBY)
- Mudra Loan, Stand-Up India
For each scheme, provide: eligibility, benefits, documents needed, how to apply.
Always verify information is current. Respond in the user's language.`,

  weather: `You are GramSeva Mausam Sahayak, a weather advisory assistant for farmers.
Help with:
- Current weather conditions for their area
- 7-day forecast interpretation
- Rain alerts and drought warnings
- Frost, heatwave, and storm advisories
- Best planting/harvesting windows based on weather
- Irrigation scheduling based on forecast
- Crop protection tips for extreme weather
Be concise and actionable. Always mention safety first.`,

  education: `You are GramSeva Shiksha Sahayak, an education advisor for rural students.
Help with:
- Scholarship information and application guidance
- Career guidance and vocational training options
- Board exam preparation tips
- College and university admissions
- Online learning resources (SWAYAM, NPTEL, DIKSHA)
- Competitive exam guidance (SSC, Banking, Railways)
- Skill development programs (PMKVY)
Be encouraging and provide specific, actionable steps.`,

  emergency: `You are GramSeva Emergency Assistant. For REAL emergencies, always provide official helpline numbers first.
Key numbers:
- Police: 100
- Fire: 101
- Ambulance: 108
- Child Helpline: 1098
- Women Helpline: 1091
- Disaster: 112
Provide first-aid guidance when appropriate. Always recommend calling official helplines for serious situations.
Be calm, clear, and prioritize safety.`,

  complaints: `You are GramSeva Complaint Sahayak, helping citizens file and track complaints about public services.
Help with:
- How to file complaints about road, water, electricity, drainage, sanitation
- How to track complaint status
- What to include in a complaint (photos, location, description)
- Escalation procedures
- Government grievance portals
- RTI filing guidance
Be empathetic and guide users step-by-step.`,
};

export function getSystemPrompt(module: AiModule): string {
  return PROMPTS[module] || PROMPTS.general;
}

export function getModuleTitle(module: AiModule): string {
  const titles: Record<AiModule, { en: string; hi: string }> = {
    general: { en: 'GramSeva AI', hi: 'ग्रामसेवा AI' },
    agriculture: { en: 'Kisan Sahayak', hi: 'किसान सहायक' },
    schemes: { en: 'Yojna Sahayak', hi: 'योजना सहायक' },
    weather: { en: 'Mausam Sahayak', hi: 'मौसम सहायक' },
    education: { en: 'Shiksha Sahayak', hi: 'शिक्षा सहायक' },
    emergency: { en: 'Emergency Assistant', hi: 'आपातकालीन सहायक' },
    complaints: { en: 'Complaint Sahayak', hi: 'शिकायत सहायक' },
  };
  return titles[module]?.en || 'GramSeva AI';
}

export const MODULE_ICONS: Record<AiModule, string> = {
  general: '🤖',
  agriculture: '🌾',
  schemes: '📋',
  weather: '🌤️',
  education: '📚',
  emergency: '🚨',
  complaints: '📝',
};

export const POPULAR_QUESTIONS: { question: string; module: AiModule; icon: string }[] = [
  { question: 'How to apply for PM Kisan?', module: 'schemes', icon: '🌾' },
  { question: 'Best fertilizer for wheat crop?', module: 'agriculture', icon: '🧪' },
  { question: "Today's weather forecast?", module: 'weather', icon: '🌤️' },
  { question: 'Nearest emergency number?', module: 'emergency', icon: '🚨' },
  { question: 'How to file a complaint?', module: 'complaints', icon: '📝' },
  { question: 'Available scholarships for students?', module: 'education', icon: '📚' },
  { question: 'How to check PM-KISAN status?', module: 'schemes', icon: '💰' },
  { question: 'Best time to sow rice?', module: 'agriculture', icon: '🌾' },
];

export const QUICK_ACTIONS: { module: AiModule; prompt: string; icon: string; label: string; labelHindi: string; color: string }[] = [
  { module: 'agriculture', prompt: 'I need farming advice', icon: '🌾', label: 'Agriculture', labelHindi: 'कृषि', color: '#2E7D32' },
  { module: 'schemes', prompt: 'Tell me about government schemes', icon: '📋', label: 'Schemes', labelHindi: 'योजनाएं', color: '#4E342E' },
  { module: 'weather', prompt: "What's the weather today?", icon: '🌤️', label: 'Weather', labelHindi: 'मौसम', color: '#0D47A1' },
  { module: 'education', prompt: 'Education and scholarship help', icon: '📚', label: 'Education', labelHindi: 'शिक्षा', color: '#1565C0' },
  { module: 'emergency', prompt: 'I need emergency help', icon: '🚨', label: 'Emergency', labelHindi: 'आपातकाल', color: '#B71C1C' },
  { module: 'complaints', prompt: 'I want to file a complaint', icon: '📝', label: 'Complaints', labelHindi: 'शिकायतें', color: '#6A1B9A' },
];

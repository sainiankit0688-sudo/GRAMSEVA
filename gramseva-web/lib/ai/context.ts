/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { AiModule, SmartSuggestion } from './types';

const SUGGESTION_MAP: Record<AiModule, Record<string, string[]>> = {
  general: {
    default: ['What services does GramSeva offer?', 'How to use GramSeva?'],
  },
  agriculture: {
    crop: ['Which crop is best this season?', 'Crop rotation tips'],
    fertilizer: ['Organic alternatives?', 'NPK dosage for wheat'],
    pest: ['Natural pest control?', 'Neem oil spray recipe'],
    soil: ['Soil testing labs nearby?', 'How to improve clay soil?'],
    irrigation: ['Drip irrigation setup cost?', 'Water-saving techniques'],
    default: ['Best fertilizer for wheat?', 'How to treat yellow leaves?', 'Irrigation methods?'],
  },
  schemes: {
    pmkisan: ['How to check PM-KISAN status?', 'Required documents?'],
    pmay: ['PMAY eligibility criteria?', 'How to apply online?'],
    ujjwala: ['Ujjwala 2.0 documents needed?', 'Eligibility?'],
    default: ['List all available schemes', 'How to apply for PM-KISAN?'],
  },
  weather: {
    rain: ['Will it rain tomorrow?', 'Best days for spraying?'],
    temperature: ['Frost warning?', 'Heatwave protection for crops'],
    default: ["Tomorrow's forecast?", 'Best time to sow wheat?'],
  },
  education: {
    scholarship: ['How to apply?', 'Last date for application?'],
    career: ['Best courses after 12th?', 'Government job options?'],
    default: ['Available scholarships?', 'Competitive exam preparation?'],
  },
  emergency: {
    health: ['First aid for burns?', 'Nearest hospital?'],
    disaster: ['Earthquake safety?', 'Flood evacuation steps'],
    default: ['Emergency helpline numbers', 'First aid basics'],
  },
  complaints: {
    filing: ['What photos to attach?', 'How to describe the issue?'],
    tracking: ['How to check status?', 'Escalation steps?'],
    default: ['How to file a complaint?', 'Track my complaint'],
  },
};

const KEYWORD_MODULE_MAP: [string[], AiModule, string][] = [
  [['crop', 'wheat', 'rice', 'fertilizer', 'pesticide', 'irrigation', 'soil', 'harvest', 'sowing', 'farming', 'kharif', 'rabi', 'leaves', 'yellow', 'disease', 'insect', 'manure', 'compost'], 'agriculture', 'default'],
  [['pm kisan', 'pm-kisan', 'pmay', 'ujjwala', 'ayushman', 'mgnrega', 'scholarship', 'pension', 'mudra', 'scheme', 'yojana', 'yojna', 'subsidy', 'benefit', 'eligibility'], 'schemes', 'default'],
  [['weather', 'rain', 'temperature', 'forecast', 'storm', 'flood', 'drought', 'heatwave', 'cold', 'wind', 'humidity', 'mausam', 'barish', 'cyclone'], 'weather', 'default'],
  [['study', 'exam', 'college', 'university', 'course', 'student', 'education', 'school', 'class', 'board', 'syllabus', 'admission', 'scholarship', 'shiksha'], 'education', 'default'],
  [['emergency', 'ambulance', 'fire', 'police', 'hospital', 'accident', 'injury', 'help', 'rescue', 'helpline', 'disaster', 'earthquake', 'flood emergency'], 'emergency', 'default'],
  [['complaint', 'grievance', 'report', 'issue', 'problem', 'road', 'water supply', 'electricity', 'drainage', 'garbage', 'streetlight', 'shikayat'], 'complaints', 'default'],
];

export function detectModule(text: string, currentModule: AiModule): AiModule {
  const lower = text.toLowerCase();

  for (const [keywords, module] of KEYWORD_MODULE_MAP) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return module;
    }
  }

  return currentModule;
}

export function getSmartSuggestions(module: AiModule, lastResponse: string): SmartSuggestion[] {
  const lower = lastResponse.toLowerCase();
  const moduleSuggestions = SUGGESTION_MAP[module] || SUGGESTION_MAP.general;

  for (const [keyword, suggestions] of Object.entries(moduleSuggestions)) {
    if (keyword === 'default') continue;
    if (lower.includes(keyword)) {
      return suggestions.map((text) => ({ text }));
    }
  }

  return (moduleSuggestions.default || SUGGESTION_MAP.general.default).map((text) => ({ text }));
}

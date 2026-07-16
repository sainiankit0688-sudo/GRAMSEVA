// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState } from 'react';

const OFFLINE_CACHE_KEY = 'gs_emergency_offline_cards';

interface OfflineCard {
  id: string;
  title: string;
  titleHindi: string;
  number: string;
  icon: string;
  color: string;
}

const DEFAULT_CARDS: OfflineCard[] = [
  { id: '112', title: 'Universal Emergency', titleHindi: 'सार्वभौमिक आपातकालीन', number: '112', icon: '🆘', color: '#B71C1C' },
  { id: '100', title: 'Police', titleHindi: 'पुलिस', number: '100', icon: '👮', color: '#1565C0' },
  { id: '101', title: 'Fire', titleHindi: 'दमकल', number: '101', icon: '🚒', color: '#E65100' },
  { id: '108', title: 'Emergency Medical', titleHindi: 'आपातकालीन चिकित्सा', number: '108', icon: '🚑', color: '#C62828' },
  { id: '1098', title: 'Child Helpline', titleHindi: 'बाल हेल्पलाइन', number: '1098', icon: '👶', color: '#F57F17' },
  { id: '181', title: 'Women Help', titleHindi: 'महिला सहायता', number: '181', icon: '👩‍⚖️', color: '#AD1457' },
  { id: '1078', title: 'Disaster Relief', titleHindi: 'आपदा राहत', number: '1078', icon: '⛈️', color: '#00695C' },
  { id: '1930', title: 'Cyber Crime', titleHindi: 'साइबर क्राइम', number: '1930', icon: '💻', color: '#00838F' },
];

function cacheCards(cards: OfflineCard[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify({ cards, cachedAt: Date.now() }));
  } catch {}
}

function getCachedCards(): OfflineCard[] | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem(OFFLINE_CACHE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.cards ?? null;
  } catch { return null; }
}

export default function OfflineCards() {
  const [cards] = useState<OfflineCard[]>(() => {
    const cached = getCachedCards() ?? DEFAULT_CARDS;
    cacheCards(cached);
    return cached;
  });
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">📶</span>
          <h3 className="text-sm font-bold text-gray-800">Offline Emergency Cards</h3>
          <p className="text-xs text-gray-500">/ ऑफ़लाइन कार्ड</p>
        </div>
        <button
          onClick={() => { cacheCards(cards); setShowHint(true); setTimeout(() => setShowHint(false), 2000); }}
          className="text-[10px] text-blue-600 hover:text-blue-700 focus:outline-none"
          aria-label="Refresh cache"
        >
          Refresh
        </button>
      </div>

      {showHint && (
        <p className="text-[10px] text-green-600 mb-2" role="alert">✓ Numbers cached for offline use / ऑफ़लाइन उपयोग के लिए कैश किया गया</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cards.map((card) => (
          <a
            key={card.id}
            href={`tel:${card.number}`}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-center transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400"
            style={{ backgroundColor: card.color + '08' }}
            aria-label={`Call ${card.title} at ${card.number}`}
          >
            <span className="text-xl" aria-hidden="true">{card.icon}</span>
            <p className="text-[10px] font-semibold text-gray-700 leading-tight">{card.titleHindi}</p>
            <span className="text-xs font-bold" style={{ color: card.color }}>{card.number}</span>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 mt-3 text-center">
        These numbers are cached in your browser. Available even without internet. / ये नंबर आपके ब्राउज़र में कैश किए गए हैं। बिना इंटरनेट के भी उपलब्ध।
      </p>
    </div>
  );
}

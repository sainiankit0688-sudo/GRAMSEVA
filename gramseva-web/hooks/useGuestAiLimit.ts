'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

const GUEST_DAILY_LIMIT = 20;
const GUEST_COUNT_KEY = 'gs_guest_ai_count';
const GUEST_DATE_KEY = 'gs_guest_ai_date';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getStoredCount(): { count: number; date: string } {
  if (typeof localStorage === 'undefined') return { count: 0, date: '' };
  try {
    const date = localStorage.getItem(GUEST_DATE_KEY) || '';
    const count = parseInt(localStorage.getItem(GUEST_COUNT_KEY) || '0', 10);
    return { count: date === todayStr() ? count : 0, date };
  } catch {
    return { count: 0, date: '' };
  }
}

export function useGuestAiLimit() {
  const { isGuest } = useAuth();
  const [remaining, setRemaining] = useState(() => {
    const stored = getStoredCount();
    return Math.max(0, GUEST_DAILY_LIMIT - stored.count);
  });

  const canSend = isGuest ? remaining > 0 : true;
  const showLimitCard = isGuest && remaining <= 0;

  const consumeMessage = useCallback(() => {
    if (!isGuest) return true;
    const stored = getStoredCount();
    if (stored.count >= GUEST_DAILY_LIMIT) {
      setRemaining(0);
      return false;
    }
    const today = todayStr();
    const newCount = stored.date === today ? stored.count + 1 : 1;
    try {
      localStorage.setItem(GUEST_COUNT_KEY, String(newCount));
      localStorage.setItem(GUEST_DATE_KEY, today);
    } catch { /* ignore */ }
    setRemaining(Math.max(0, GUEST_DAILY_LIMIT - newCount));
    return newCount <= GUEST_DAILY_LIMIT;
  }, [isGuest]);

  return { canSend, remaining, showLimitCard, consumeMessage, dailyLimit: GUEST_DAILY_LIMIT };
}

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

import { useState, useEffect } from 'react';
import { formatRetryTime } from '@/lib/ai/rateLimit';

interface RateLimitNoticeProps {
  remainingMs: number;
  onRetry?: () => void;
}

export default function RateLimitNotice({ remainingMs, onRetry }: RateLimitNoticeProps) {
  const [timeLeft, setTimeLeft] = useState(remainingMs);

  useEffect(() => {
    if (remainingMs <= 0) return;
    let remaining = remainingMs;
    const interval = setInterval(() => {
      remaining -= 1000;
      if (remaining <= 0) { clearInterval(interval); setTimeLeft(0); return; }
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingMs]);

  if (timeLeft <= 0 && !onRetry) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2" role="alert">
      <span className="text-amber-500" aria-hidden="true">⏱️</span>
      <div className="flex-1">
        <p className="text-xs font-medium text-amber-700">
          {timeLeft > 0 ? `Please wait ${formatRetryTime(timeLeft)} before sending again` : 'You can try again now'}
        </p>
      </div>
      {timeLeft <= 0 && onRetry && (
        <button type="button" onClick={onRetry} className="text-xs font-medium text-amber-700 hover:underline">
          Retry
        </button>
      )}
    </div>
  );
}

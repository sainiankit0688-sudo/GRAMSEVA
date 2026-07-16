/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import type { RateLimitState } from './types';

const RATE_LIMIT_KEY = 'gs_ai_rate_limit';
const COOLDOWN_MS = 10_000;
const MAX_REQUESTS_PER_MINUTE = 15;
const RETRY_BASE_DELAY_MS = 2_000;
const MAX_RETRY_DELAY_MS = 30_000;

interface RateLimitRecord {
  timestamps: number[];
  lastError: number;
  retryCount: number;
}

function getRecord(): RateLimitRecord {
  if (typeof localStorage === 'undefined') return { timestamps: [], lastError: 0, retryCount: 0 };
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { timestamps: [], lastError: 0, retryCount: 0 };
    return JSON.parse(raw);
  } catch {
    return { timestamps: [], lastError: 0, retryCount: 0 };
  }
}

function saveRecord(record: RateLimitRecord): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
  } catch {
    // Ignore
  }
}

export function checkRateLimit(): RateLimitState {
  const record = getRecord();
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  const recentTimestamps = record.timestamps.filter((t) => t > oneMinuteAgo);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldestInWindow = Math.min(...recentTimestamps);
    const remainingMs = oldestInWindow + 60_000 - now;
    return { isLimited: true, remainingMs: Math.max(0, remainingMs), retryAfter: 0 };
  }

  if (record.lastError > 0) {
    const elapsed = now - record.lastError;
    const retryDelay = Math.min(RETRY_BASE_DELAY_MS * Math.pow(2, record.retryCount), MAX_RETRY_DELAY_MS);
    if (elapsed < retryDelay) {
      return { isLimited: true, remainingMs: retryDelay - elapsed, retryAfter: retryDelay - elapsed };
    }
  }

  if (recentTimestamps.length > 0) {
    const lastTimestamp = Math.max(...recentTimestamps);
    if (now - lastTimestamp < COOLDOWN_MS) {
      return { isLimited: true, remainingMs: COOLDOWN_MS - (now - lastTimestamp), retryAfter: COOLDOWN_MS - (now - lastTimestamp) };
    }
  }

  return { isLimited: false, remainingMs: 0, retryAfter: 0 };
}

export function recordRequest(): void {
  const record = getRecord();
  record.timestamps.push(Date.now());
  record.retryCount = 0;
  const oneMinuteAgo = Date.now() - 60_000;
  record.timestamps = record.timestamps.filter((t) => t > oneMinuteAgo);
  saveRecord(record);
}

export function recordError(): void {
  const record = getRecord();
  record.lastError = Date.now();
  record.retryCount += 1;
  saveRecord(record);
}

export function formatRetryTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
}

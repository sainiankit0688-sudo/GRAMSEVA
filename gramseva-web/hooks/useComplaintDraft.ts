'use client';

/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { COMPLAINT_DRAFT_KEY, COMPLAINT_AUTOSAVE_INTERVAL } from '@/lib/constants/api';

export interface DraftData {
  category: string;
  title: string;
  description: string;
  address: string;
  village: string;
  block: string;
  district: string;
  state: string;
  pincode: string;
  priority: string;
  photoUrls: string[];
  step: number;
  savedAt: string;
}

function loadDraft(): DraftData | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COMPLAINT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

function saveDraft(data: DraftData): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(COMPLAINT_DRAFT_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

function clearDraft(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(COMPLAINT_DRAFT_KEY);
  } catch {
    // Ignore
  }
}

interface UseComplaintDraftOptions {
  autoSaveInterval?: number;
  onRestore?: (draft: DraftData) => void;
}

export function useComplaintDraft(options: UseComplaintDraftOptions = {}) {
  const { autoSaveInterval = COMPLAINT_AUTOSAVE_INTERVAL, onRestore } = options;
  const [savedDraft, setSavedDraft] = useState<DraftData | null>(() => loadDraft());
  const [lastSaved, setLastSaved] = useState<string | null>(() => loadDraft()?.savedAt ?? null);
  const dataRef = useRef<DraftData | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateData = useCallback((data: DraftData) => {
    dataRef.current = data;
  }, []);

  const saveNow = useCallback(() => {
    if (dataRef.current) {
      const withTimestamp = { ...dataRef.current, savedAt: new Date().toISOString() };
      saveDraft(withTimestamp);
      setLastSaved(withTimestamp.savedAt);
    }
  }, []);

  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft && onRestore) {
      onRestore(draft);
    }
    return draft;
  }, [onRestore]);

  const discardDraft = useCallback(() => {
    clearDraft();
    setSavedDraft(null);
    setLastSaved(null);
    dataRef.current = null;
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (dataRef.current) {
        const withTimestamp = { ...dataRef.current, savedAt: new Date().toISOString() };
        saveDraft(withTimestamp);
        setLastSaved(withTimestamp.savedAt);
      }
    }, autoSaveInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoSaveInterval]);

  return {
    savedDraft,
    lastSaved,
    updateData,
    saveNow,
    restoreDraft,
    discardDraft,
    hasSavedDraft: savedDraft !== null,
  };
}

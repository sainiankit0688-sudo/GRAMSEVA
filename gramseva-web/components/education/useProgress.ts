'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useCallback } from 'react';

const PROGRESS_KEY = 'gs_education_progress';

interface ProgressEntry {
  saved: boolean;
  completedReading: boolean;
  applied: boolean;
  interested: boolean;
  updatedAt: number;
}

type ProgressMap = Record<string, ProgressEntry>;

function getLocalProgress(): ProgressMap {
  if (typeof localStorage === 'undefined') return {};
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function setLocalProgress(map: ProgressMap): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

export function useProgress() {
  const [progressMap, setProgressMap] = useState<ProgressMap>(() => getLocalProgress());

  const getProgress = useCallback((itemId: string): ProgressEntry | undefined => {
    return progressMap[itemId];
  }, [progressMap]);

  const setProgress = useCallback((itemId: string, update: Partial<ProgressEntry>) => {
    setProgressMap((prev) => {
      const next = { ...prev, [itemId]: { ...prev[itemId], ...update, updatedAt: Date.now() } as ProgressEntry };
      setLocalProgress(next);
      return next;
    });
  }, []);

  const toggleSaved = useCallback((itemId: string) => {
    setProgressMap((prev) => {
      const current = prev[itemId];
      const next = { ...prev, [itemId]: { ...current, saved: !current?.saved, updatedAt: Date.now() } as ProgressEntry };
      setLocalProgress(next);
      return next;
    });
  }, []);

  const toggleCompletedReading = useCallback((itemId: string) => {
    setProgressMap((prev) => {
      const current = prev[itemId];
      const next = { ...prev, [itemId]: { ...current, completedReading: !current?.completedReading, updatedAt: Date.now() } as ProgressEntry };
      setLocalProgress(next);
      return next;
    });
  }, []);

  const toggleApplied = useCallback((itemId: string) => {
    setProgressMap((prev) => {
      const current = prev[itemId];
      const next = { ...prev, [itemId]: { ...current, applied: !current?.applied, updatedAt: Date.now() } as ProgressEntry };
      setLocalProgress(next);
      return next;
    });
  }, []);

  const toggleInterested = useCallback((itemId: string) => {
    setProgressMap((prev) => {
      const current = prev[itemId];
      const next = { ...prev, [itemId]: { ...current, interested: !current?.interested, updatedAt: Date.now() } as ProgressEntry };
      setLocalProgress(next);
      return next;
    });
  }, []);

  const stats = {
    saved: Object.values(progressMap).filter((e) => e.saved).length,
    completedReading: Object.values(progressMap).filter((e) => e.completedReading).length,
    applied: Object.values(progressMap).filter((e) => e.applied).length,
    interested: Object.values(progressMap).filter((e) => e.interested).length,
  };

  return { progressMap, getProgress, setProgress, toggleSaved, toggleCompletedReading, toggleApplied, toggleInterested, stats };
}

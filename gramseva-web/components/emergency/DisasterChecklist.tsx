// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback, useEffect } from 'react';

const CHECKLIST_STORAGE_KEY = 'gs_emergency_checklists';

interface ChecklistState {
  [disasterId: string]: string[];
}

function loadChecklists(): ChecklistState {
  if (typeof localStorage === 'undefined') return {};
  try {
    const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveChecklists(state: ChecklistState): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
}

interface ChecklistItem {
  id: string;
  text: string;
  textHindi: string;
}

interface DisasterChecklistProps {
  disasterId: string;
  title: string;
  titleHindi: string;
  items: ChecklistItem[];
}

export default function DisasterChecklist({ disasterId, title, titleHindi, items }: DisasterChecklistProps) {
  const [completed, setCompleted] = useState<string[]>(() => {
    return loadChecklists()[disasterId] ?? [];
  });

  useEffect(() => {
    const all = loadChecklists();
    all[disasterId] = completed;
    saveChecklists(all);
  }, [completed, disasterId]);

  const toggleItem = useCallback((itemId: string) => {
    setCompleted((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  }, []);

  const progress = items.length > 0 ? Math.round((completed.length / items.length) * 100) : 0;

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4" role="region" aria-label={`${title} checklist`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-gray-800">📋 {title} Checklist</h4>
          <p className="text-xs text-gray-500">{titleHindi}</p>
        </div>
        <span className="text-xs font-semibold text-gray-500">{completed.length}/{items.length}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-3" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Checklist ${progress}% complete`}>
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {items.map((item) => {
          const done = completed.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 ${
                done ? 'bg-green-50 text-green-700 line-through' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              aria-pressed={done}
              aria-label={`${item.text} — ${done ? 'completed' : 'not completed'}`}
            >
              <span className={`flex-shrink-0 w-4 h-4 rounded border-2 mt-0.5 flex items-center justify-center transition-colors ${
                done ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`} aria-hidden="true">
                {done && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="flex-1">
                <span>{item.text}</span>
                <span className="text-gray-400 ml-1">/ {item.textHindi}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

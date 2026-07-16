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

import { useState, useCallback, useEffect } from 'react';
import type { Conversation, ExportFormat } from '@/lib/ai/types';
import { exportConversation } from '@/lib/ai/export';

interface ExportDialogProps {
  conversation: Conversation;
  onClose: () => void;
}

const FORMATS: { format: ExportFormat; label: string; icon: string; desc: string }[] = [
  { format: 'pdf', label: 'PDF', icon: '📄', desc: 'Formatted document' },
  { format: 'markdown', label: 'Markdown', icon: '📝', desc: 'Markdown file' },
  { format: 'text', label: 'Plain Text', icon: '📋', desc: 'Text file' },
];

export default function ExportDialog({ conversation, onClose }: ExportDialogProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleExport = useCallback(async (format: ExportFormat) => {
    setExporting(format);
    try {
      await exportConversation(conversation, format);
    } catch {
      // Error handled silently
    }
    setExporting(null);
    onClose();
  }, [conversation, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-label="Export conversation">
      <div className="bg-white rounded-2xl p-5 w-80 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Export Conversation</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm" aria-label="Close">✕</button>
        </div>
        <div className="flex flex-col gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.format}
              type="button"
              onClick={() => handleExport(f.format)}
              disabled={exporting !== null}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
            >
              <span className="text-xl" aria-hidden="true">{f.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-700">{f.label}</p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
              {exporting === f.format && (
                <span className="ml-auto w-4 h-4 border-2 border-gray-300 border-t-[#3949AB] rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

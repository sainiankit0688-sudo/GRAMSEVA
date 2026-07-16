/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

import { useState, useCallback } from 'react';

interface ExportButtonProps {
  onExportCSV: () => void | Promise<void>;
  onExportPDF?: () => void | Promise<void>;
  label?: string;
  disabled?: boolean;
}

export default function ExportButton({ onExportCSV, onExportPDF, label = 'Export', disabled }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCSV = useCallback(async () => {
    setLoading(true);
    try { await onExportCSV(); } finally { setLoading(false); setOpen(false); }
  }, [onExportCSV]);

  const handlePDF = useCallback(async () => {
    if (!onExportPDF) return;
    setLoading(true);
    try { await onExportPDF(); } finally { setLoading(false); setOpen(false); }
  }, [onExportPDF]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled || loading}
        className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {loading ? <span className="w-3 h-3 border border-gray-300 border-t-indigo-600 rounded-full animate-spin" aria-hidden="true" /> : '📥'}
        {label}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 min-w-[120px] overflow-hidden">
          <button type="button" onClick={handleCSV} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50">
            CSV
          </button>
          {onExportPDF && (
            <button type="button" onClick={handlePDF} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50">
              PDF
            </button>
          )}
        </div>
      )}
      {open && <button type="button" className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-label="Close export menu" />}
    </div>
  );
}

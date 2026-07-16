// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';

export default function SOSButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSOS = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setShowConfirm(false);
    window.location.href = 'tel:112';
  }, []);

  const handleCancel = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return (
    <>
      <button
        onClick={handleSOS}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center animate-pulse"
        aria-label="SOS Emergency — call 112"
        style={{ animation: 'pulse 2s infinite' }}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-label="SOS confirmation"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl" aria-hidden="true">🆘</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Emergency SOS</h2>
              <p className="text-sm text-gray-500 mt-2 mb-1">आपातकालीन सहायता</p>
              <p className="text-xs text-gray-400">This will call 112 (Universal Emergency Number).</p>
              <p className="text-xs text-gray-400">यह 112 (सार्वभौमिक आपातकालीन नंबर) पर कॉल करेगा।</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                autoFocus
              >
                Cancel / रद्द करें
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                📞 Call 112
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

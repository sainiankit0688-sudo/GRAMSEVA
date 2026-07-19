'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function GuestLoginDialog() {
  const { loginDialogOpen, loginDialogMessage, hideLoginDialog } = useAuth();

  if (!loginDialogOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Login required">
      <div className="absolute inset-0 bg-black/50" onClick={hideLoginDialog} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
        <button
          onClick={hideLoginDialog}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🔐</span>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-1">Login to Continue</h2>
          <p className="text-sm text-gray-500 mb-4">लॉगिन करें</p>

          {loginDialogMessage && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2 mb-4">{loginDialogMessage}</p>
          )}

          <div className="w-full bg-green-50 rounded-xl p-4 mb-5 text-left">
            <p className="text-sm font-semibold text-green-800 mb-2">Benefits of logging in:</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-green-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                File & track complaints
              </li>
              <li className="flex items-center gap-2 text-sm text-green-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Save schemes & bookmarks
              </li>
              <li className="flex items-center gap-2 text-sm text-green-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Unlimited AI conversations
              </li>
              <li className="flex items-center gap-2 text-sm text-green-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                AI conversation history
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            onClick={hideLoginDialog}
            className="w-full py-3 rounded-xl text-white font-bold text-center block transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            Login / लॉगिन
          </Link>

          <Link
            href="/register"
            onClick={hideLoginDialog}
            className="w-full py-3 mt-2 rounded-xl text-green-700 font-semibold text-center block border border-green-200 hover:bg-green-50 transition-colors"
          >
            Create Account / खाता बनाएं
          </Link>
        </div>
      </div>
    </div>
  );
}

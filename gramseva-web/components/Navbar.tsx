'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { subscribeToAuthChanges, getAuthSnapshot, getAuthServerSnapshot } from '@/lib/auth';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const user = useSyncExternalStore(
    subscribeToAuthChanges,
    () => mounted ? getAuthSnapshot() : null,
    getAuthServerSnapshot,
  );

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 shadow-md"
      style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
    >
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-green-700 font-bold text-sm">GS</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-base leading-tight">GramSeva</span>
          <span className="text-green-100 text-xs leading-tight">ग्राम सेवा</span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/weather"
          className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          title="Weather"
        >
          <span className="text-lg">⛅</span>
        </Link>
        <Link
          href="/emergency"
          className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          title="Emergency"
        >
          <span className="text-lg">🚨</span>
        </Link>
        {mounted && (
          user ? (
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold hover:bg-white/30 transition-colors"
              title="Profile"
            >
              {user.user_metadata?.name?.charAt(0)?.toUpperCase() || '👤'}
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg text-white text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
            >
              Login
            </Link>
          )
        )}
      </div>
    </header>
  );
}

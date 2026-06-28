'use client';

import Link from 'next/link';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 shadow-md"
      style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
    >
      {/* Left: hamburger */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Center: logo + title */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-green-700 font-bold text-sm">GS</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-base leading-tight">GramSeva</span>
          <span className="text-green-100 text-xs leading-tight">ग्राम सेवा</span>
        </div>
      </Link>

      {/* Right: weather + emergency quick links */}
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
      </div>
    </header>
  );
}

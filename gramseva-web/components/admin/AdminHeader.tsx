/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

interface AdminHeaderProps {
  title: string;
  onMenuToggle?: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await signOut();
    router.push('/admin/login');
  }, [router]);

  return (
    <header className="bg-gradient-to-r from-[#1A237E] to-[#3949AB] px-4 py-3 flex items-center justify-between flex-shrink-0" role="banner">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="text-white/80 hover:text-white text-sm lg:hidden focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
        <h1 className="text-sm font-bold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/60 text-xs hidden sm:inline">Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-white/70 hover:text-white text-xs px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

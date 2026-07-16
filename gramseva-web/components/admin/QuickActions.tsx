/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import Link from 'next/link';

const QUICK_ACTIONS = [
  { label: 'Complaints', href: '/admin/complaints', icon: '📋', desc: 'Manage complaints' },
  { label: 'Users', href: '/admin/users', icon: '👤', desc: 'Manage users' },
  { label: 'Schemes', href: '/admin/schemes', icon: '🏛️', desc: 'Manage schemes' },
  { label: 'Weather', href: '/admin/weather', icon: '🌤️', desc: 'Manage weather alerts' },
  { label: 'Emergency', href: '/admin/emergency', icon: '🚨', desc: 'Manage emergency data' },
  { label: 'Education', href: '/admin/education', icon: '📚', desc: 'Manage resources' },
  { label: 'AI', href: '/admin/ai', icon: '🤖', desc: 'AI usage & config' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', desc: 'Admin settings' },
];

interface QuickActionsProps {
  onNavigate?: (href: string) => void;
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_ACTIONS.map((action) => (
          onNavigate ? (
            <button
              key={action.href}
              type="button"
              onClick={() => onNavigate(action.href)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <span className="text-lg group-hover:scale-110 transition-transform" aria-hidden="true">{action.icon}</span>
              <span className="text-[10px] font-medium text-gray-700 group-hover:text-[#1A237E]">{action.label}</span>
            </button>
          ) : (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <span className="text-lg group-hover:scale-110 transition-transform" aria-hidden="true">{action.icon}</span>
              <span className="text-[10px] font-medium text-gray-700 group-hover:text-[#1A237E]">{action.label}</span>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}

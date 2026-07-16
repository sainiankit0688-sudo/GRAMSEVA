/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: '📊', section: 'Overview' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈', section: 'Overview' },
  { href: '/admin/live', label: 'Live Activity', icon: '⚡', section: 'Overview' },
  { href: '/admin/complaints', label: 'Complaints', icon: '📝', section: 'Management' },
  { href: '/admin/users', label: 'Users & Roles', icon: '👥', section: 'Management' },
  { href: '/admin/schemes', label: 'Schemes', icon: '📋', section: 'Management' },
  { href: '/admin/education', label: 'Education', icon: '📚', section: 'Management' },
  { href: '/admin/emergency', label: 'Emergency', icon: '🚨', section: 'Management' },
  { href: '/admin/weather', label: 'Weather', icon: '🌤️', section: 'Management' },
  { href: '/admin/ai', label: 'AI Usage', icon: '🤖', section: 'Management' },
  { href: '/admin/notifications', label: 'Notifications', icon: '🔔', section: 'Operations' },
  { href: '/admin/audit', label: 'Audit Logs', icon: '📋', section: 'Operations' },
  { href: '/admin/media', label: 'Media', icon: '🖼️', section: 'Operations' },
  { href: '/admin/health', label: 'System Health', icon: '💓', section: 'System' },
  { href: '/admin/backups', label: 'Backups', icon: '💾', section: 'System' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️', section: 'System' },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sections = NAV_ITEMS.reduce<Record<string, NavItem[]>>((acc, item) => {
    const s = item.section || 'Other';
    if (!acc[s]) acc[s] = [];
    acc[s].push(item);
    return acc;
  }, {});

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Admin sidebar"
      >
        <div className="p-4 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2" aria-label="Admin Dashboard">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="text-sm font-bold text-gray-800">GramSeva Admin</p>
              <p className="text-[10px] text-gray-400">प्रशासन पैनल</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} className="mb-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">{section}</p>
              <ul className="flex flex-col gap-0.5" role="list">
                {items.map((item) => {
                  const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${isActive ? 'bg-indigo-50 text-[#1A237E] font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={onClose}
                      >
                        <span className="text-base" aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <span aria-hidden="true">🏠</span>
            Back to GramSeva
          </Link>
        </div>
      </aside>
    </>
  );
}

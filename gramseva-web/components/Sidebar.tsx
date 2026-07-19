'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/', label: 'Home / Schemes', labelHindi: 'होम / योजनाएं', icon: '🏠' },
  { href: '/government-schemes', label: 'Govt. Schemes', labelHindi: 'सरकारी योजनाएं', icon: '🏛️' },
  { href: '/agriculture', label: 'Agriculture', labelHindi: 'कृषि', icon: '🌾' },
  { href: '/education', label: 'Education', labelHindi: 'शिक्षा', icon: '📚' },
  { href: '/housing', label: 'Housing', labelHindi: 'आवास', icon: '🏘️' },
  { href: '/health', label: 'Health Card', labelHindi: 'स्वास्थ्य कार्ड', icon: '🏥' },
  { href: '/emergency', label: 'Emergency', labelHindi: 'आपातकाल', icon: '🚨' },
  { href: '/complaints', label: 'Complaints', labelHindi: 'शिकायत', icon: '📋' },
  { href: '/jobs', label: 'Job Alerts', labelHindi: 'नौकरी अलर्ट', icon: '💼' },
  { href: '/ai-chat', label: 'AI Chat', labelHindi: 'AI चैट', icon: '🤖' },
  { href: '/weather', label: 'Weather', labelHindi: 'मौसम', icon: '⛅' },
  { href: '/profile', label: 'Profile', labelHindi: 'प्रोफ़ाइल', icon: '👤', requiresAuth: true },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none lg:h-full`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
          <div>
            <h2 className="text-white font-bold text-lg">GramSeva</h2>
            <p className="text-green-100 text-xs">ग्राम सेवा</p>
          </div>
          <button
            onClick={onClose}
            className="text-white p-1 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 lg:hidden"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isLoading && user && (
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
              {user.user_metadata?.name?.charAt(0)?.toUpperCase() || '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.user_metadata?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </Link>
        )}

        {!isLoading && !user && (
          <div className="flex gap-2 px-5 py-3 border-b border-gray-100">
            <Link
              href="/login"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-center text-sm font-semibold text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
            >
              Register
            </Link>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const href = item.requiresAuth && !user ? `/login?redirect=${encodeURIComponent(item.href)}` : item.href;
            return (
              <Link
                key={item.href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-150 group
                  ${isActive
                    ? 'text-white shadow-sm'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                style={isActive ? { backgroundColor: '#2E7D32' } : {}}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">{item.label}</span>
                  <span className={`text-xs leading-tight ${isActive ? 'text-green-100' : 'text-gray-400'}`}>{item.labelHindi}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">GramSeva v1.0 • डिजिटल ग्राम</p>
        </div>
      </aside>
    </>
  );
}

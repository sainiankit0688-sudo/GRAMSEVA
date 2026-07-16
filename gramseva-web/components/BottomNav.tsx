'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Home', labelHindi: 'होम', icon: '🏠' },
  { href: '/complaints', label: 'Complaints', labelHindi: 'शिकायत', icon: '📋' },
  { href: '/emergency', label: 'Emergency', labelHindi: 'आपातकाल', icon: '🚨' },
  { href: '/profile', label: 'Profile', labelHindi: 'प्रोफ़ाइल', icon: '👤' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[64px] focus:outline-none focus:ring-2 focus:ring-green-300 ${
                isActive
                  ? 'text-green-700 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={`text-[10px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

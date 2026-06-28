'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  phone: string;
  village?: string;
  district?: string;
  state?: string;
  joinedAt?: string;
}

const profileSections = [
  {
    title: 'My Services',
    titleHindi: 'मेरी सेवाएं',
    items: [
      { label: 'My Complaints', labelHindi: 'मेरी शिकायतें', icon: '📋', href: '/complaints' },
      { label: 'Job Applications', labelHindi: 'नौकरी आवेदन', icon: '💼', href: '/jobs' },
      { label: 'Saved Schemes', labelHindi: 'सहेजी योजनाएं', icon: '🔖', href: '/' },
    ],
  },
  {
    title: 'Account',
    titleHindi: 'खाता',
    items: [
      { label: 'Edit Profile', labelHindi: 'प्रोफ़ाइल बदलें', icon: '✏️', href: null },
      { label: 'Language / भाषा', labelHindi: 'हिंदी / English', icon: '🌐', href: null },
      { label: 'Notifications', labelHindi: 'सूचनाएं', icon: '🔔', href: null },
    ],
  },
  {
    title: 'Help & Support',
    titleHindi: 'सहायता',
    items: [
      { label: 'Emergency Numbers', labelHindi: 'आपातकालीन नंबर', icon: '🚨', href: '/emergency' },
      { label: 'AI Chat Help', labelHindi: 'AI सहायता', icon: '🤖', href: '/ai-chat' },
      { label: 'About GramSeva', labelHindi: 'GramSeva के बारे में', icon: 'ℹ️', href: null },
    ],
  },
];

const stats = [
  { label: 'Schemes', labelHindi: 'योजनाएं', value: '6', icon: '📋', color: '#2E7D32' },
  { label: 'Complaints', labelHindi: 'शिकायत', value: '0', icon: '📢', color: '#C62828' },
  { label: 'Jobs', labelHindi: 'नौकरी', value: '8', icon: '💼', color: '#1565C0' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [complaintsCount, setComplaintsCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const u = localStorage.getItem('gs_current_user');
    if (u) setUser(JSON.parse(u));
    const complaints = JSON.parse(localStorage.getItem('gs_complaints') || '[]');
    setComplaintsCount(complaints.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('gs_current_user');
    router.push('/login');
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-[#F5F5F5] px-6">
        <div className="text-center">
          <span className="text-6xl">👤</span>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Login Required</h2>
          <p className="text-gray-500 text-sm mt-2">Please login or register to access your profile</p>
          <p className="text-gray-400 text-xs mt-1">लॉगिन करें या पंजीकरण करें</p>
          <div className="flex flex-col gap-3 mt-6">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl text-white font-bold text-center block"
              style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
            >
              Login / लॉगिन
            </Link>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl font-bold text-center border border-green-600 text-green-700 block"
            >
              Register / पंजीकरण
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-12" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-md">
            {user.name?.charAt(0).toUpperCase() || '👤'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{user.name}</h1>
            <p className="text-green-100 text-sm">📱 {user.phone}</p>
            {user.village && <p className="text-green-100 text-xs mt-0.5">📍 {user.village}{user.district ? `, ${user.district}` : ''}{user.state ? `, ${user.state}` : ''}</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6 mb-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 grid grid-cols-3 gap-2">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center ${i < 2 ? 'border-r border-gray-100' : ''}`}>
              <span className="text-xl">{s.icon}</span>
              <p className="text-xl font-bold text-gray-800 mt-0.5">
                {s.label === 'Complaints' ? complaintsCount : s.value}
              </p>
              <p className="text-xs font-medium" style={{ color: s.color }}>{s.label}</p>
              <p className="text-xs text-gray-400">{s.labelHindi}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 mb-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-bold text-gray-800 mb-3">Account Info / खाता जानकारी</h2>
          {[
            { label: 'Name', value: user.name, icon: '👤' },
            { label: 'Mobile', value: user.phone, icon: '📱' },
            { label: 'Village', value: user.village || 'Not set', icon: '🏘️' },
            { label: 'District', value: user.district || 'Not set', icon: '📍' },
            { label: 'State', value: user.state || 'Not set', icon: '🗺️' },
            { label: 'Member Since', value: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN') : 'N/A', icon: '📅' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      {profileSections.map((section) => (
        <div key={section.title} className="px-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {section.title} / {section.titleHindi}
              </p>
            </div>
            {section.items.map((item, i) => {
              const content = (
                <div className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${i < section.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.labelHindi}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              );
              if (item.href) {
                return <Link key={item.label} href={item.href}>{content}</Link>;
              }
              return <div key={item.label}>{content}</div>;
            })}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="px-4 pb-8">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl font-bold text-red-700 border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
        >
          🚪 Logout / लॉगआउट
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">GramSeva v1.0 • Made with ❤️ for Rural India</p>
      </div>
    </div>
  );
}

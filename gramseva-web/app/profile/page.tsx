'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ensureValidSession, signOut, updateUser, getStoredUser, type AuthUser } from '@/lib/auth';
import { ProtectedRoute } from '@/components/auth';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  village: string;
  district: string;
  state: string;
}

const defaultProfile: ProfileData = {
  name: '',
  email: '',
  phone: '',
  village: '',
  district: '',
  state: '',
};

function userToProfile(user: AuthUser): ProfileData {
  const meta = user.user_metadata || {};
  return {
    name: meta.name || '',
    email: user.email || '',
    phone: meta.phone || '',
    village: meta.village || '',
    district: meta.district || '',
    state: meta.state || '',
  };
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
    title: 'Help & Support',
    titleHindi: 'सहायता',
    items: [
      { label: 'Emergency Numbers', labelHindi: 'आपातकालीन नंबर', icon: '🚨', href: '/emergency' },
      { label: 'AI Chat Help', labelHindi: 'AI सहायता', icon: '🤖', href: '/ai-chat' },
      { label: 'About GramSeva', labelHindi: 'GramSeva के बारे में', icon: 'ℹ️', href: null },
    ],
  },
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'J&K', 'Ladakh',
];

export default function ProfilePage() {
  const router = useRouter();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [complaintsCount, setComplaintsCount] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    async function load() {
      const storedUser = getStoredUser();
      if (storedUser) {
        if (!cancelled) setUser(storedUser);
      }

      const session = await ensureValidSession();
      if (cancelled) return;

      if (session) {
        setUser(session.user);
        setComplaintsCount(() => {
          try {
            const raw = localStorage.getItem('gs_complaints');
            return raw ? JSON.parse(raw).length : 0;
          } catch {
            return 0;
          }
        });
      } else {
        router.replace('/login');
        return;
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [mounted, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const startEditing = () => {
    if (user) {
      setEditForm(userToProfile(user));
      setSaveError('');
      setSaveSuccess(false);
      setEditing(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);
    setSaving(true);

    const result = await updateUser({
      name: editForm.name,
      phone: editForm.phone,
      village: editForm.village,
      district: editForm.district,
      state: editForm.state,
    });

    setSaving(false);

    if (result.error) {
      setSaveError(result.error);
      return;
    }

    if (user) {
      const updatedUser: AuthUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          name: editForm.name,
          phone: editForm.phone,
          village: editForm.village,
          district: editForm.district,
          state: editForm.state,
        },
      };
      setUser(updatedUser);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setEditing(false);
      setSaveSuccess(false);
    }, 1500);
  };

  if (!mounted || loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-[#F5F5F5] px-6">
        <div className="text-center">
          <span className="text-6xl">👤</span>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Login Required</h2>
          <p className="text-gray-500 text-sm mt-2">Please login to access your profile</p>
          <p className="text-gray-400 text-xs mt-1">लॉगिन करें अपनी प्रोफ़ाइल देखने के लिए</p>
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

  const meta = user.user_metadata || {};

  if (editing) {
    return (
      <div className="min-h-full bg-[#F5F5F5]">
        <div className="px-5 pt-6 pb-8 text-white" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
          <h1 className="text-xl font-bold">Edit Profile / प्रोफ़ाइल बदलें</h1>
          <p className="text-green-100 text-sm">Update your information</p>
        </div>

        <div className="px-4 -mt-4 pb-8">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
                Profile updated! / प्रोफ़ाइल अपडेट हो गई! ✅
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              {[
                { name: 'name', label: 'Full Name / पूरा नाम', icon: '👤', type: 'text' },
                { name: 'phone', label: 'Mobile / मोबाइल', icon: '📱', type: 'tel' },
                { name: 'village', label: 'Village / गांव', icon: '🏘️', type: 'text' },
                { name: 'district', label: 'District / जिला', icon: '📍', type: 'text' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                    <span className="px-3 text-gray-500 text-sm">{field.icon}</span>
                    <input
                      type={field.type}
                      value={editForm[field.name as keyof ProfileData]}
                      onChange={(e) => setEditForm({ ...editForm, [field.name]: e.target.value })}
                      className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">State / राज्य</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                  <select
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full bg-transparent py-3 px-3 text-gray-800 outline-none text-sm"
                  >
                    <option value="">Select State</option>
                    {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-600 border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-white font-bold transition-opacity disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
                >
                  {saving ? 'Saving...' : 'Save / सहेजें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-12" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-md">
            {meta.name?.charAt(0).toUpperCase() || '👤'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{meta.name || 'User'}</h1>
            <p className="text-green-100 text-sm">📧 {user.email}</p>
            {meta.phone && <p className="text-green-100 text-xs mt-0.5">📱 {meta.phone}</p>}
            {meta.village && <p className="text-green-100 text-xs mt-0.5">📍 {meta.village}{meta.district ? `, ${meta.district}` : ''}{meta.state ? `, ${meta.state}` : ''}</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6 mb-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 grid grid-cols-2 gap-2">
          <div className="text-center border-r border-gray-100">
            <span className="text-xl">📋</span>
            <p className="text-xl font-bold text-gray-800 mt-0.5">{complaintsCount}</p>
            <p className="text-xs font-medium text-amber-700">Complaints</p>
            <p className="text-xs text-gray-400">शिकायतें</p>
          </div>
          <div className="text-center">
            <span className="text-xl">📅</span>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : 'N/A'}
            </p>
            <p className="text-xs font-medium text-green-700">Member Since</p>
            <p className="text-xs text-gray-400">सदस्य</p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 mb-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">Account Info / खाता जानकारी</h2>
            <button
              onClick={startEditing}
              className="text-sm text-green-700 font-semibold hover:underline"
            >
              ✏️ Edit
            </button>
          </div>
          {[
            { label: 'Name', value: meta.name || 'Not set', icon: '👤' },
            { label: 'Email', value: user.email || 'Not set', icon: '📧' },
            { label: 'Mobile', value: meta.phone || 'Not set', icon: '📱' },
            { label: 'Village', value: meta.village || 'Not set', icon: '🏘️' },
            { label: 'District', value: meta.district || 'Not set', icon: '📍' },
            { label: 'State', value: meta.state || 'Not set', icon: '🗺️' },
            { label: 'Member Since', value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : 'N/A', icon: '📅' },
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
    </ProtectedRoute>
  );
}

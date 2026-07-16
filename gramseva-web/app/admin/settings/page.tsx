/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { adminService, type AdminSetting } from '@/lib/services/adminService';
import { getStoredUser, signOut } from '@/lib/auth';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import RoleManager from '@/components/admin/RoleManager';
import PermissionMatrix from '@/components/admin/PermissionMatrix';
import { useRouter } from 'next/navigation';

const SETTING_SECTIONS = [
  {
    id: 'account',
    label: 'Account',
    icon: '👤',
    settings: [
      { key: 'admin_email', label: 'Admin Email', type: 'text' },
      { key: 'admin_name', label: 'Admin Name', type: 'text' },
    ],
  },
  {
    id: 'smtp',
    label: 'SMTP Configuration',
    icon: '📧',
    settings: [
      { key: 'smtp_host', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com' },
      { key: 'smtp_port', label: 'SMTP Port', type: 'text', placeholder: '587' },
      { key: 'smtp_user', label: 'SMTP Username', type: 'text' },
      { key: 'smtp_pass', label: 'SMTP Password', type: 'password' },
      { key: 'smtp_from', label: 'From Email', type: 'text', placeholder: 'noreply@gramseva.gov.in' },
    ],
  },
  {
    id: 'push',
    label: 'Push Notifications',
    icon: '🔔',
    settings: [
      { key: 'push_enabled', label: 'Enable Push Notifications', type: 'select', options: ['true', 'false'] },
      { key: 'push_provider', label: 'Provider', type: 'select', options: ['firebase', 'onesignal', 'web_push'] },
      { key: 'push_api_key', label: 'API Key', type: 'password' },
    ],
  },
  {
    id: 'api_keys',
    label: 'API Keys',
    icon: '🔑',
    settings: [
      { key: 'openweather_key', label: 'OpenWeather API Key', type: 'password' },
      { key: 'groq_key', label: 'Groq API Key', type: 'password' },
      { key: 'openai_key', label: 'OpenAI API Key', type: 'password' },
      { key: 'gemini_key', label: 'Gemini API Key', type: 'password' },
    ],
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: '🎨',
    settings: [
      { key: 'brand_name', label: 'Platform Name', type: 'text', placeholder: 'GramSeva' },
      { key: 'brand_logo', label: 'Logo URL', type: 'text' },
      { key: 'brand_primary', label: 'Primary Color', type: 'text', placeholder: '#1A237E' },
      { key: 'brand_tagline', label: 'Tagline', type: 'text', placeholder: 'GramSeva — गांव की सेवा में' },
    ],
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: '🔧',
    settings: [
      { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'select', options: ['false', 'true'] },
      { key: 'maintenance_message', label: 'Maintenance Message', type: 'textarea', placeholder: 'System is under maintenance. Please try again later.' },
    ],
  },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const user = getStoredUser();
  const [showSignOut, setShowSignOut] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading, refetch } = useQuery<AdminSetting[]>(
    queryKeys.admin.settings(),
    () => adminService.getSettings(),
    { staleTime: 60_000 },
  );

  const settingsMap = (settings || []).reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  const currentSection = SETTING_SECTIONS.find((s) => s.id === activeSection);

  const handleValueChange = useCallback((key: string, value: string) => {
    setEditingValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async (key: string) => {
    const value = editingValues[key];
    if (value === undefined) return;
    try {
      await adminService.updateSetting(key, value);
      setEditingValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      refetch();
    } catch {
      // Error handled silently
    }
  }, [editingValues, refetch]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Platform configuration, roles, and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-1">
            {SETTING_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-300 ${activeSection === section.id ? 'bg-indigo-50 text-[#1A237E] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                <span aria-hidden="true">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="lg:col-span-3 space-y-4">
          {activeSection === 'account' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Account</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Email</span>
                    <span className="text-sm text-gray-800">{user?.email || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Role</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{user?.app_metadata?.role || 'admin'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">User ID</span>
                    <span className="text-xs text-gray-600 font-mono">{user?.id?.slice(0, 12) || '—'}...</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Roles & Permissions</h3>
                <RoleManager />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Permission Matrix</h3>
                <PermissionMatrix />
              </div>
            </>
          )}

          {currentSection && currentSection.id !== 'account' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span aria-hidden="true">{currentSection.icon}</span>
                {currentSection.label}
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentSection.settings.map((setting) => {
                    const currentValue = editingValues[setting.key] !== undefined
                      ? editingValues[setting.key]
                      : settingsMap[setting.key] || '';

                    return (
                      <div key={setting.key} className="space-y-1">
                        <label htmlFor={`setting-${setting.key}`} className="text-xs font-medium text-gray-600">
                          {setting.label}
                        </label>
                        {setting.type === 'select' ? (
                          <select
                            id={`setting-${setting.key}`}
                            value={currentValue}
                            onChange={(e) => handleValueChange(setting.key, e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          >
                            {'options' in setting && setting.options?.map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : setting.type === 'textarea' ? (
                          <textarea
                            id={`setting-${setting.key}`}
                            value={currentValue}
                            onChange={(e) => handleValueChange(setting.key, e.target.value)}
                            placeholder={('placeholder' in setting ? setting.placeholder : '') || ''}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                          />
                        ) : (
                          <input
                            id={`setting-${setting.key}`}
                            type={setting.type || 'text'}
                            value={currentValue}
                            onChange={(e) => handleValueChange(setting.key, e.target.value)}
                            placeholder={('placeholder' in setting ? setting.placeholder : '') || ''}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          />
                        )}
                        {editingValues[setting.key] !== undefined && (
                          <button
                            type="button"
                            onClick={() => handleSave(setting.key)}
                            className="text-xs text-[#1A237E] hover:text-[#283593] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-2 py-1"
                          >
                            Save
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Danger Zone</h3>
            <button
              type="button"
              onClick={() => setShowSignOut(true)}
              className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showSignOut}
        title="Sign Out"
        message="You will be signed out of the admin panel. Are you sure?"
        confirmLabel="Sign Out"
        variant="warning"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOut(false)}
      />
    </div>
  );
}

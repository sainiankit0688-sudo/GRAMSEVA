/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getStoredUser } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const user = getStoredUser();
      if (!user || user.app_metadata?.role !== 'admin') {
        setError('Access denied. Admin account required.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  }, [email, password, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #1A237E, #3949AB)' }}>
            <span className="text-2xl text-white" aria-hidden="true">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">GramSeva Administration Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4" noValidate>
          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="admin@gramseva.gov.in"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            style={{ background: 'linear-gradient(135deg, #1A237E, #3949AB)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-400 mt-6">GramSeva Admin Panel © 2026</p>
      </div>
    </div>
  );
}

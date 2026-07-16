'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/';
  const redirectTo = rawRedirect.startsWith('/') && !rawRedirect.includes('://') ? rawRedirect : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('कृपया सभी फ़ील्ड भरें / Please fill all fields');
      return;
    }
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #2E7D32 0%, #4CAF50 40%, #F5F5F5 60%)' }}>
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
          <span className="text-4xl">🏡</span>
        </div>
        <h1 className="text-white text-2xl font-bold">GramSeva</h1>
        <p className="text-green-100 text-sm">ग्राम सेवा - डिजिटल भारत</p>
      </div>

      <div className="flex-1 bg-white mx-4 rounded-t-3xl shadow-2xl px-6 pt-8 pb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Login / लॉगिन</h2>
        <p className="text-sm text-gray-500 mb-6">अपने खाते में प्रवेश करें</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className="text-sm font-medium text-gray-700 mb-1 block">
              Email / ईमेल
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="px-3 text-gray-500 text-sm">📧</span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm font-medium text-gray-700 mb-1 block">
              Password / पासवर्ड
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="px-3 text-gray-500 text-sm">🔒</span>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">Remember me / याद रखें</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-green-700 font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold text-base mt-2 transition-opacity disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            {loading ? 'Logging in...' : 'Login / लॉगिन'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-green-700 font-semibold">
            Register / पंजीकरण
          </Link>
        </p>
      </div>
    </div>
  );
}

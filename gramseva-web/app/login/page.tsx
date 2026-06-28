'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone || !password) {
      setError('कृपया सभी फ़ील्ड भरें / Please fill all fields');
      return;
    }
    setLoading(true);
    // Simulate login with localStorage
    await new Promise((r) => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('gs_users') || '[]');
    const user = users.find((u: { phone: string; password: string }) => u.phone === phone && u.password === password);
    if (user) {
      localStorage.setItem('gs_current_user', JSON.stringify(user));
      router.push('/');
    } else {
      setError('Invalid phone or password / गलत नंबर या पासवर्ड');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #2E7D32 0%, #4CAF50 40%, #F5F5F5 60%)' }}>
      {/* Top illustration */}
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
          <span className="text-4xl">🏡</span>
        </div>
        <h1 className="text-white text-2xl font-bold">GramSeva</h1>
        <p className="text-green-100 text-sm">ग्राम सेवा - डिजिटल भारत</p>
      </div>

      {/* Card */}
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
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Mobile Number / मोबाइल नंबर
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="px-3 text-gray-500 text-sm">📱</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password / पासवर्ड
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="px-3 text-gray-500 text-sm">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
              />
            </div>
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

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-green-50 rounded-xl">
          <p className="text-xs text-green-700 font-medium">💡 Demo: Register first, then login with your credentials.</p>
        </div>
      </div>
    </div>
  );
}

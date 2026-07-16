'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('कृपया ईमेल दर्ज करें / Please enter your email');
      return;
    }
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-sm max-w-sm w-full">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📧</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Check Your Email</h2>
          <p className="text-gray-600 text-center text-sm">
            If an account exists with <strong>{email}</strong>, we&apos;ve sent a password reset link.
          </p>
          <p className="text-gray-400 text-center text-xs">
            यदि इस ईमेल से कोई खाता है, तो हमने पासवर्ड रीसेट लिंक भेज दिया है।
          </p>
          <Link
            href="/login"
            className="w-full py-3 rounded-xl text-white font-bold text-center block text-center"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            Back to Login / लॉगिन पर वापस
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #2E7D32 0%, #4CAF50 40%, #F5F5F5 60%)' }}>
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
          <span className="text-4xl">🔐</span>
        </div>
        <h1 className="text-white text-2xl font-bold">GramSeva</h1>
        <p className="text-green-100 text-sm">पासवर्ड रीसेट करें</p>
      </div>

      <div className="flex-1 bg-white mx-4 rounded-t-3xl shadow-2xl px-6 pt-8 pb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Forgot Password / पासवर्ड भूल गए?</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we&apos;ll send you a reset link</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="forgot-email" className="text-sm font-medium text-gray-700 mb-1 block">
              Email / ईमेल
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="px-3 text-gray-500 text-sm">📧</span>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold text-base mt-2 transition-opacity disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link / रीसेट लिंक भेजें'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-green-700 font-semibold">Login / लॉगिन</Link>
        </p>
      </div>
    </div>
  );
}

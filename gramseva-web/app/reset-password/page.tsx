'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/auth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const accessToken = searchParams.get('access_token');
  const type = searchParams.get('type');

  const invalidToken = useMemo(() => type !== 'recovery' || !accessToken, [type, accessToken]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (invalidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-sm max-w-sm w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Invalid Link</h2>
          <p className="text-gray-600 text-center text-sm">
            This password reset link is invalid or has expired.
          </p>
          <p className="text-gray-400 text-center text-xs">
            यह लिंक अमान्य है या समाप्त हो गया है।
          </p>
          <Link
            href="/forgot-password"
            className="w-full py-3 rounded-xl text-white font-bold text-center block text-center"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            Request New Link / नया लिंक मांगें
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-sm max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-green-800 text-center">Password Reset!</h2>
          <p className="text-gray-600 text-center text-sm">
            Your password has been updated successfully.
          </p>
          <p className="text-gray-400 text-center text-xs">
            आपका पासवर्ड सफलतापूर्वक बदल दिया गया है।
          </p>
          <Link
            href="/login"
            className="w-full py-3 rounded-xl text-white font-bold text-center block text-center"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            Login with New Password / नए पासवर्ड से लॉगिन करें
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('कृपया सभी फ़ील्ड भरें / Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match / पासवर्ड मेल नहीं खाते');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters / पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
      return;
    }

    setLoading(true);
    const result = await resetPassword(password, accessToken!);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #2E7D32 0%, #4CAF50 40%, #F5F5F5 60%)' }}>
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
          <span className="text-4xl">🔑</span>
        </div>
        <h1 className="text-white text-2xl font-bold">GramSeva</h1>
        <p className="text-green-100 text-sm">नया पासवर्ड सेट करें</p>
      </div>

      <div className="flex-1 bg-white mx-4 rounded-t-3xl shadow-2xl px-6 pt-8 pb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Reset Password / पासवर्ड रीसेट</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your new password below</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reset-password" className="text-sm font-medium text-gray-700 mb-1 block">
              New Password / नया पासवर्ड
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="px-3 text-gray-500 text-sm">🔒</span>
              <input
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reset-confirm-password" className="text-sm font-medium text-gray-700 mb-1 block">
              Confirm Password / पासवर्ड दोहराएं
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="px-3 text-gray-500 text-sm">🔐</span>
              <input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold text-base mt-2 transition-opacity disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            {loading ? 'Resetting...' : 'Reset Password / पासवर्ड बदलें'}
          </button>
        </form>
      </div>
    </div>
  );
}

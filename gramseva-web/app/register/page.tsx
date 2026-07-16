'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('कृपया सभी अनिवार्य फ़ील्ड भरें / Fill all required fields');
      return;
    }
    if (form.phone && form.phone.length !== 10) {
      setError('Invalid mobile number / गलत मोबाइल नंबर');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match / पासवर्ड मेल नहीं खाते');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters / पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
      return;
    }

    setLoading(true);
    const result = await signUp({
      email: form.email,
      password: form.password,
      name: form.name,
      phone: form.phone,
      village: form.village,
      district: form.district,
      state: form.state,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      setSuccess(true);
      redirectTimer.current = setTimeout(() => router.push('/'), 1500);
    } else {
      setNeedsVerification(true);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'J&K', 'Ladakh',
  ];

  if (needsVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-sm max-w-sm w-full">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📧</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Check Your Email</h2>
          <p className="text-gray-600 text-center text-sm">
            We&apos;ve sent a verification link to <strong>{form.email}</strong>
          </p>
          <p className="text-gray-400 text-center text-xs">
            कृपया अपना ईमेल जांचें और सत्यापन लिंक पर क्लिक करें
          </p>
          <Link
            href="/login"
            className="w-full py-3 rounded-xl text-white font-bold text-center block text-center"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
          >
            Go to Login / लॉगिन पर जाएं
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-green-800">Registration Successful!</h2>
          <p className="text-gray-600 text-center">पंजीकरण सफल रहा। Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="px-5 pt-6 pb-8 text-white" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <h1 className="text-xl font-bold">Create Account</h1>
        <p className="text-green-100 text-sm">नया खाता बनाएं</p>
      </div>

      <div className="px-4 -mt-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label htmlFor="reg-name" className="text-sm font-medium text-gray-700 mb-1 block">Full Name / पूरा नाम *</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <span className="px-3 text-gray-500 text-sm">👤</span>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="text-sm font-medium text-gray-700 mb-1 block">Email / ईमेल *</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <span className="px-3 text-gray-500 text-sm">📧</span>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number / मोबाइल नंबर</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <span className="px-3 text-gray-500 text-sm">📱</span>
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit number (optional)"
                  className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                  maxLength={10}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-village" className="text-sm font-medium text-gray-700 mb-1 block">Village / गांव</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <span className="px-3 text-gray-500 text-sm">🏘️</span>
                <input
                  id="reg-village"
                  type="text"
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  placeholder="Your village name"
                  className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-district" className="text-sm font-medium text-gray-700 mb-1 block">District / जिला</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <span className="px-3 text-gray-500 text-sm">📍</span>
                <input
                  id="reg-district"
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Your district"
                  className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-state" className="text-sm font-medium text-gray-700 mb-1 block">State / राज्य</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <select
                  id="reg-state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 px-3 text-gray-800 outline-none text-sm"
                >
                  <option value="">Select State / राज्य चुनें</option>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="text-sm font-medium text-gray-700 mb-1 block">Password / पासवर्ड *</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <span className="px-3 text-gray-500 text-sm">🔒</span>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm-password" className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password / पासवर्ड दोहराएं *</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <span className="px-3 text-gray-500 text-sm">🔐</span>
                <input
                  id="reg-confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
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
              {loading ? 'Registering...' : 'Register / पंजीकरण करें'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-green-700 font-semibold">Login / लॉगिन</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

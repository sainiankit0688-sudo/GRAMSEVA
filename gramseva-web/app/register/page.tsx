'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.password) {
      setError('कृपया सभी अनिवार्य फ़ील्ड भरें / Fill all required fields');
      return;
    }
    if (form.phone.length !== 10) {
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
    await new Promise((r) => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('gs_users') || '[]');
    if (users.find((u: { phone: string }) => u.phone === form.phone)) {
      setError('Mobile number already registered / यह नंबर पहले से पंजीकृत है');
      setLoading(false);
      return;
    }
    const newUser = { ...form, id: Date.now(), joinedAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('gs_users', JSON.stringify(users));
    localStorage.setItem('gs_current_user', JSON.stringify(newUser));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/'), 1500);
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'J&K', 'Ladakh',
  ];

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
      {/* Header */}
      <div className="px-5 pt-6 pb-8 text-white" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <h1 className="text-xl font-bold">Create Account</h1>
        <p className="text-green-100 text-sm">नया खाता बनाएं</p>
      </div>

      {/* Form */}
      <div className="px-4 -mt-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {[
              { name: 'name', label: 'Full Name / पूरा नाम', placeholder: 'Enter your full name', icon: '👤', type: 'text' },
              { name: 'phone', label: 'Mobile Number / मोबाइल नंबर', placeholder: '10-digit number', icon: '📱', type: 'tel' },
              { name: 'village', label: 'Village / गांव', placeholder: 'Your village name', icon: '🏘️', type: 'text' },
              { name: 'district', label: 'District / जिला', placeholder: 'Your district', icon: '📍', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                  <span className="px-3 text-gray-500 text-sm">{field.icon}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">State / राज्य</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                <select
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

            {[
              { name: 'password', label: 'Password / पासवर्ड', placeholder: 'Min 6 characters', icon: '🔒' },
              { name: 'confirmPassword', label: 'Confirm Password / पासवर्ड दोहराएं', placeholder: 'Re-enter password', icon: '🔐' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-green-500">
                  <span className="px-3 text-gray-500 text-sm">{field.icon}</span>
                  <input
                    type="password"
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="flex-1 bg-transparent py-3 pr-3 text-gray-800 outline-none text-sm"
                  />
                </div>
              </div>
            ))}

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

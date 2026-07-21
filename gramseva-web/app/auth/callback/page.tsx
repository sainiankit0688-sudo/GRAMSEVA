'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeCodeForSession } from '@/lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const code = searchParams.get('code');
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    const hash = window.location.hash;

    if (type === 'recovery' && accessToken) {
      router.replace(`/reset-password?access_token=${accessToken}&type=recovery`);
      return;
    }

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const hashToken = params.get('access_token');
      const hashType = params.get('type');

      if (hashType === 'recovery' && hashToken) {
        router.replace(`/reset-password?access_token=${hashToken}&type=recovery`);
        return;
      }

      if (hashToken) {
        exchangeCodeForSession(hashToken).then((result) => {
          if (result.error) {
            setError(result.error);
            setLoading(false);
          } else {
            router.replace('/');
          }
        });
        return;
      }
    }

    if (code) {
      exchangeCodeForSession(code).then((result) => {
        if (result.error) {
          setError(result.error);
          setLoading(false);
        } else if (type === 'recovery' && result.data?.access_token) {
          router.replace(`/reset-password?access_token=${result.data.access_token}&type=recovery`);
        } else {
          router.replace('/');
        }
      });
      return;
    }

    queueMicrotask(() => {
      setError('No authentication code found.');
      setLoading(false);
    });
  }, [searchParams, router]);

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Verifying... / सत्यापन हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-sm max-w-sm w-full">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center">Verification Failed</h2>
        <p className="text-gray-600 text-center text-sm">{error}</p>
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

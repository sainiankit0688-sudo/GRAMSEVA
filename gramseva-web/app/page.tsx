'use client';

import { useState, useEffect, useCallback } from 'react';
import SchemeCard from '@/components/SchemeCard';
import Link from 'next/link';
import { schemeDisplayMeta } from '@/lib/scheme-display';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface SchemeRecord {
  id: string;
  category: string;
  about: string;
}

interface HomeScheme {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  icon: string;
  color: string;
  link: string;
  badge?: string;
}

const quickActions = [
  { label: 'Agriculture', labelHindi: 'कृषि', icon: '🌾', href: '/agriculture', color: '#2E7D32' },
  { label: 'Education', labelHindi: 'शिक्षा', icon: '📚', href: '/education', color: '#1565C0' },
  { label: 'Health', labelHindi: 'स्वास्थ्य', icon: '🏥', href: '/health', color: '#C62828' },
  { label: 'Housing', labelHindi: 'आवास', icon: '🏘️', href: '/housing', color: '#6A1B9A' },
  { label: 'Emergency', labelHindi: 'आपातकाल', icon: '🚨', href: '/emergency', color: '#BF360C' },
  { label: 'Complaints', labelHindi: 'शिकायत', icon: '📋', href: '/complaints', color: '#4E342E' },
  { label: 'Jobs', labelHindi: 'नौकरी', icon: '💼', href: '/jobs', color: '#00695C' },
  { label: 'AI Chat', labelHindi: 'AI चैट', icon: '🤖', href: '/ai-chat', color: '#1A237E' },
];

function enrichScheme(record: SchemeRecord): HomeScheme {
  const meta = schemeDisplayMeta[record.id];
  return {
    id: record.id,
    title: meta?.title || record.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    titleHindi: meta?.titleHindi || '',
    description: meta?.description || (record.about ? record.about.substring(0, 120) + (record.about.length > 120 ? '...' : '') : ''),
    icon: meta?.icon || '📄',
    color: meta?.color || '#2E7D32',
    link: meta?.link || '/',
    badge: meta?.featured ? 'Active' : undefined,
  };
}

async function fetchSchemesFromApi(): Promise<HomeScheme[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/schemes?select=id,category,about`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch schemes (${res.status})`);
  const data: SchemeRecord[] = await res.json();
  return data.map(enrichScheme);
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allSchemes, setAllSchemes] = useState<HomeScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSchemes() {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        if (!cancelled) {
          setError('Backend not configured.');
          setLoading(false);
        }
        return;
      }
      try {
        const schemes = await fetchSchemesFromApi();
        if (!cancelled) setAllSchemes(schemes);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load schemes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSchemes();
    return () => { cancelled = true; };
  }, []);

  const handleRetry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const schemes = await fetchSchemesFromApi();
      setAllSchemes(schemes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schemes');
    } finally {
      setLoading(false);
    }
  }, []);

  const query = searchQuery.toLowerCase().trim();

  const featuredSchemes = allSchemes.filter(s => schemeDisplayMeta[s.id]?.featured);

  const filteredQuickActions = query
    ? quickActions.filter(
        (a) =>
          a.label.toLowerCase().includes(query) ||
          a.labelHindi.includes(query) ||
          a.href.replace('/', '').includes(query)
      )
    : quickActions;

  const filteredSchemes = query
    ? allSchemes.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.titleHindi.includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.id.includes(query)
      )
    : featuredSchemes;

  const hasResults = filteredQuickActions.length > 0 || filteredSchemes.length > 0;

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Hero Banner */}
      <div
        className="px-5 pt-6 pb-8 text-white"
        style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
      >
        <p className="text-green-100 text-sm mb-1">नमस्ते! Welcome to</p>
        <h1 className="text-2xl font-bold">GramSeva Portal</h1>
        <p className="text-green-100 text-sm mt-1">सरकारी योजनाओं की जानकारी एक जगह</p>
        <p className="text-green-100 text-xs">All government schemes in one place</p>
        <div className="flex gap-3 mt-4">
          <Link
            href="/ai-chat"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full text-sm font-medium"
          >
            🤖 AI से पूछें
          </Link>
          <Link
            href="/emergency"
            className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 transition-colors px-4 py-2 rounded-full text-sm font-medium"
          >
            🚨 Emergency
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services & schemes... / सेवाएं खोजें"
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm outline-none focus:ring-2 focus:ring-white/50 transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {filteredQuickActions.length > 0 && (
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Quick Access / त्वरित पहुँच</h2>
          <div className="grid grid-cols-4 gap-3">
            {filteredQuickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105"
                  style={{ backgroundColor: action.color + '15', border: `1px solid ${action.color}30` }}
                >
                  {action.icon}
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight font-medium">{action.label}</span>
                <span className="text-xs text-gray-400 text-center leading-tight">{action.labelHindi}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Government Schemes - Loading */}
      {loading && !query && (
      <div className="px-4 mt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Govt. Schemes</h2>
            <p className="text-xs text-gray-500">सरकारी योजनाएं</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-gray-200 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Government Schemes - Error */}
      {!loading && error && (
      <div className="px-4 mt-5 pb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm font-medium text-gray-700 mt-2">Failed to load schemes</p>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-3 px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry / पुनः प्रयास करें
          </button>
        </div>
      </div>
      )}

      {/* Government Schemes - Data */}
      {!loading && !error && filteredSchemes.length > 0 && (
      <div className="px-4 mt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Govt. Schemes</h2>
            <p className="text-xs text-gray-500">सरकारी योजनाएं</p>
          </div>
          <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-1 rounded-full">{query ? filteredSchemes.length : featuredSchemes.length} Active</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} {...scheme} />
          ))}
        </div>
      </div>
      )}

      {/* Empty State */}
      {query && !hasResults && (
      <div className="px-4 mt-8 text-center pb-8">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <p className="text-sm font-medium text-gray-600 mt-3">No results found</p>
        <p className="text-xs text-gray-400 mt-1">&quot;{searchQuery}&quot; के लिए कोई परिणाम नहीं मिला</p>
        <button
          onClick={() => setSearchQuery('')}
          className="mt-3 text-xs text-green-600 font-medium underline hover:text-green-700"
        >
          Clear search / खोज साफ़ करें
        </button>
      </div>
      )}

      {/* Info Banner */}
      <div className="px-4 pb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">Need Help?</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Use our AI Chat for instant help with government schemes, documents, and eligibility queries.
              हमारे AI चैट से योजनाओं की जानकारी पाएं।
            </p>
            <Link href="/ai-chat" className="text-xs text-blue-700 font-semibold mt-1 inline-block underline">
              Chat with AI →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

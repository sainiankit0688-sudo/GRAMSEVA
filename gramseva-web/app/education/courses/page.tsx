'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type EduCourse } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/education/BookmarkButton';
import NotificationButton from '@/components/education/NotificationButton';
import ShareActions from '@/components/education/ShareActions';
import ProgressButtons from '@/components/education/ProgressButtons';

const LEVELS = ['All', 'Beginner', 'Intermediate'];
const DURATIONS = ['All', '1 month', '3 months', '6 months', 'Self-paced'];
const MODES = ['All', 'Online', 'Offline', 'Online/Offline'];
const PROVIDERS = ['All', 'NIELIT', 'PMGDISHA', 'NSDC', 'ICAR', 'NIIT', 'NCFE', 'Spoken Tutorial IIT Bombay'];

export default function CoursesPage() {
  const [level, setLevel] = useState('All');
  const [duration, setDuration] = useState('All');
  const [mode, setMode] = useState('All');
  const [provider, setProvider] = useState('All');
  const [certOnly, setCertOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

  const { data: courses, isLoading, error, refetch } = useQuery<EduCourse[]>(
    queryKeys.education.courses(level === 'All' ? undefined : level),
    () => educationService.getCourses(level === 'All' ? undefined : level),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchesLevel = level === 'All' || c.level === level;
      const matchesDuration = duration === 'All' || c.duration === duration;
      const matchesMode = mode === 'All' || c.mode === mode;
      const matchesProvider = provider === 'All' || c.provider === provider;
      const matchesCert = !certOnly || c.certificate;
      const matchesFree = !freeOnly || c.free;
      return matchesLevel && matchesDuration && matchesMode && matchesProvider && matchesCert && matchesFree;
    });
  }, [courses, level, duration, mode, provider, certOnly, freeOnly]);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  const clearFilters = useCallback(() => {
    setLevel('All'); setDuration('All'); setMode('All'); setProvider('All'); setCertOnly(false); setFreeOnly(false);
  }, []);

  const hasActiveFilters = level !== 'All' || duration !== 'All' || mode !== 'All' || provider !== 'All' || certOnly || freeOnly;

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Courses" titleHindi="पाठ्यक्रम" icon="📚" gradient="linear-gradient(135deg, #1565C0, #1E88E5)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'Courses' }]} />

      <div className="px-4 py-4 space-y-4">
        {/* Advanced Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-700">Filters / फ़िल्टर</h2>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-[11px] text-red-600 hover:text-red-800 focus:outline-none focus:underline" aria-label="Clear all filters">
                Clear All / साफ़ करें
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium mr-1">Level / स्तर:</span>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    level === l ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={level === l}
                >
                  {l === 'All' ? 'All' : l === 'Beginner' ? 'Beginner' : 'Intermediate'}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium mr-1">Duration / अवधि:</span>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    duration === d ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={duration === d}
                >
                  {d === 'All' ? 'All' : d}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium mr-1">Mode / मोड:</span>
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    mode === m ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={mode === m}
                >
                  {m === 'All' ? 'All' : m}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium mr-1">Provider / प्रदाता:</span>
              {PROVIDERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    provider === p ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={provider === p}
                >
                  {p === 'All' ? 'All' : p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                <input type="checkbox" checked={certOnly} onChange={(e) => setCertOnly(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                Certificate / प्रमाणपत्र
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-400" />
                Free / मुफ्त
              </label>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex gap-2 items-start">
          <span aria-hidden="true">🎉</span>
          <p className="text-xs text-green-700">सभी कोर्स मुफ़्त हैं! All courses are FREE for rural citizens.</p>
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading courses..." messageHindi="पाठ्यक्रम लोड हो रहे हैं..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load courses'} messageHindi="पाठ्यक्रम लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            icon="📚"
            title="No courses found"
            titleHindi="कोई पाठ्यक्रम नहीं मिला"
            action={hasActiveFilters ? { label: 'Clear Filters / फ़िल्टर साफ़ करें', onClick: clearFilters } : undefined}
          />
        )}

        {/* List */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={course.title}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xl mt-0.5" aria-hidden="true">{course.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{course.title}</h3>
                      <p className="text-xs text-gray-500">{course.titleHindi} · {course.provider}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {course.free && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">FREE</span>
                    )}
                    {course.certificate && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">🎓 Certificate</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">⏱️ {course.duration}</span>
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">📡 {course.mode}</span>
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{course.level === 'Beginner' ? '🌟 Beginner' : '📈 Intermediate'}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <BookmarkButton itemId={course.id} />
                  <NotificationButton itemId={course.id} />
                </div>

                <ProgressButtons itemId={course.id} />

                <div className="mt-3">
                  <ShareActions title={course.title} itemId={course.id} />
                </div>

                <button className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Enroll / नामांकन करें
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

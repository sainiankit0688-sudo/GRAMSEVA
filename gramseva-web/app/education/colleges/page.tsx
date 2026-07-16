'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type College } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/education/BookmarkButton';
import ShareActions from '@/components/education/ShareActions';
import ProgressButtons from '@/components/education/ProgressButtons';

const TYPES = ['All', 'Government', 'Central University', 'Private'];
const STATES = ['All', 'Uttar Pradesh', 'Bihar', 'Delhi'];
const COURSES_LIST = ['All', 'B.Tech', 'MBA', 'MBBS', 'BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc', 'LLB', 'PhD'];

export default function CollegesPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  const { data: colleges, isLoading, error, refetch } = useQuery<College[]>(
    queryKeys.education.colleges(),
    () => educationService.getColleges(),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const filtered = useMemo(() => {
    if (!colleges) return [];
    return colleges.filter((c) => {
      const matchesType = typeFilter === 'All' || c.type === typeFilter;
      const matchesState = stateFilter === 'All' || c.state === stateFilter;
      const matchesCourse = courseFilter === 'All' || c.courses.includes(courseFilter);
      return matchesType && matchesState && matchesCourse;
    });
  }, [colleges, typeFilter, stateFilter, courseFilter]);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  const hasActiveFilters = typeFilter !== 'All' || stateFilter !== 'All' || courseFilter !== 'All';

  const clearFilters = useCallback(() => {
    setTypeFilter('All'); setStateFilter('All'); setCourseFilter('All');
  }, []);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="College Information" titleHindi="कॉलेज की जानकारी" icon="🏛️" gradient="linear-gradient(135deg, #4527A0, #5E35B1)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'Colleges' }]} />

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
              <span className="text-[10px] text-gray-400 font-medium mr-1">Type / प्रकार:</span>
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    typeFilter === t ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={typeFilter === t}
                >
                  {t === 'All' ? 'All' : t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium mr-1">State / राज्य:</span>
              {STATES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStateFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    stateFilter === s ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={stateFilter === s}
                >
                  {s === 'All' ? 'All' : s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium mr-1">Course / पाठ्यक्रम:</span>
              {COURSES_LIST.map((c) => (
                <button
                  key={c}
                  onClick={() => setCourseFilter(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    courseFilter === c ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={courseFilter === c}
                >
                  {c === 'All' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading colleges..." messageHindi="कॉलेज लोड हो रहे हैं..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load colleges'} messageHindi="कॉलेज लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            icon="🏛️"
            title="No colleges found"
            titleHindi="कोई कॉलेज नहीं मिला"
            action={hasActiveFilters ? { label: 'Clear Filters / फ़िल्टर साफ़ करें', onClick: clearFilters } : undefined}
          />
        )}

        {/* List */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((college) => (
              <div key={college.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all" role="article" aria-label={college.name}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">{college.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm">{college.name}</h3>
                    <div className="flex gap-1.5 mt-1">
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{college.type}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{college.state}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-gray-500 mb-1">Courses Offered / उपलब्ध पाठ्यक्रम</p>
                  <div className="flex flex-wrap gap-1">
                    {college.courses.map((c) => (
                      <span key={c} className="text-[10px] bg-white text-gray-700 px-2 py-0.5 rounded border border-gray-200">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <BookmarkButton itemId={college.id} />
                </div>

                <ProgressButtons itemId={college.id} />

                <div className="mt-3">
                  <ShareActions title={college.name} itemId={college.id} />
                </div>

                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block w-full py-2 rounded-xl text-sm font-semibold text-indigo-700 border border-indigo-200 text-center hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label={`Visit ${college.name} website`}
                >
                  Visit Website / वेबसाइट देखें ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

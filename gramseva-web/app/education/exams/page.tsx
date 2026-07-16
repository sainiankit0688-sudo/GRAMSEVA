'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type Exam } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import NotificationButton from '@/components/education/NotificationButton';
import SmartBadges from '@/components/education/SmartBadges';
import ShareActions from '@/components/education/ShareActions';
import ProgressButtons from '@/components/education/ProgressButtons';

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-green-100 text-green-700',
  Coming: 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-red-100 text-red-700',
};

const LEVELS = ['All', 'Central', 'State', 'Banking', 'Teaching', 'Medical', 'Engineering'];

export default function ExamsPage() {
  const [levelFilter, setLevelFilter] = useState('All');

  const { data: exams, isLoading, error, refetch } = useQuery<Exam[]>(
    queryKeys.education.exams(),
    () => educationService.getExams(),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const filtered = useMemo(() => {
    if (!exams) return [];
    if (levelFilter === 'All') return exams;
    return exams.filter((e) => e.level === levelFilter);
  }, [exams, levelFilter]);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Competitive Exams" titleHindi="प्रतियोगी परीक्षाएं" icon="📋" gradient="linear-gradient(135deg, #6A1B9A, #8E24AA)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'Exams' }]} />

      <div className="px-4 py-4 space-y-4">
        {/* Level filter */}
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                levelFilter === l ? 'bg-purple-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
              }`}
              aria-pressed={levelFilter === l}
            >
              {l === 'All' ? 'All / सभी' : l}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading exams..." messageHindi="परीक्षाएं लोड हो रही हैं..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load exams'} messageHindi="परीक्षाएं लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState icon="📋" title="No exams found" titleHindi="कोई परीक्षा नहीं मिली" />
        )}

        {/* List */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" role="article" aria-label={exam.exam}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{exam.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800 text-sm">{exam.exam}</h3>
                          <SmartBadges item={{ id: exam.id, status: exam.status, isPopular: exam.vacancies !== '–' && parseInt(exam.vacancies.replace(/[,+]/g, '')) > 10000 }} />
                        </div>
                        <p className="text-xs text-gray-500">{exam.examHindi} · {exam.level}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${STATUS_COLORS[exam.status]}`}>
                        {exam.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-500">Exam Date / परीक्षा तिथि</p>
                    <p className="text-xs font-semibold text-gray-800">{exam.date}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-500">Vacancies / रिक्तियां</p>
                    <p className="text-xs font-semibold text-blue-700">{exam.vacancies}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-2.5 mt-2">
                  <p className="text-[10px] text-gray-500">Eligibility / पात्रता</p>
                  <p className="text-[11px] font-medium text-blue-800">{exam.eligibility}</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-2.5 mt-2">
                  <p className="text-[10px] text-gray-500">Syllabus / पाठ्यक्रम</p>
                  <p className="text-[11px] font-medium text-purple-800">{exam.syllabus}</p>
                </div>

                <div className="flex gap-2 mt-3">
                  <NotificationButton itemId={exam.id} />
                </div>

                <ProgressButtons itemId={exam.id} />

                <div className="mt-3">
                  <ShareActions title={exam.exam} itemId={exam.id} />
                </div>

                <div className="mt-3">
                  <a
                    href={exam.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-2 rounded-xl text-sm font-semibold text-purple-700 border border-purple-200 text-center hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                    aria-label={`Visit ${exam.exam} official website`}
                  >
                    Official Website / आधिकारिक वेबसाइट ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

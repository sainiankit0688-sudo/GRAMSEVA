'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type CareerPath } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';

export default function CareerGuidancePage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: careers, isLoading, error, refetch } = useQuery<CareerPath[]>(
    queryKeys.education.careerGuidance(),
    () => educationService.getCareerPaths(),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Career Guidance" titleHindi="करियर मार्गदर्शन" icon="🚀" gradient="linear-gradient(135deg, #E65100, #FB8C00)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'Career Guidance' }]} />

      <div className="px-4 py-4 space-y-4">
        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading career guidance..." messageHindi="करियर मार्गदर्शन लोड हो रहा है..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load career guidance'} messageHindi="करियर मार्गदर्शन लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && (!careers || careers.length === 0) && (
          <EmptyState icon="🚀" title="No career guidance available" titleHindi="कोई करियर मार्गदर्शन उपलब्ध नहीं" />
        )}

        {/* Cards */}
        {!isLoading && !error && careers && careers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careers.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="w-full text-left p-5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400"
                  aria-expanded={expanded === c.id}
                  aria-controls={`career-detail-${c.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: c.color + '15' }}>
                      <span aria-hidden="true">{c.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm">{c.title}</h3>
                      <p className="text-xs text-orange-600 font-medium">{c.titleHindi}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.descriptionHindi}</p>
                    </div>
                    <span className={`text-gray-400 transition-transform flex-shrink-0 mt-1 ${expanded === c.id ? 'rotate-180' : ''}`} aria-hidden="true">
                      ▼
                    </span>
                  </div>
                </button>

                {expanded === c.id && (
                  <div id={`career-detail-${c.id}`} className="px-5 pb-5" role="region" aria-label={`${c.title} opportunities`}>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Opportunities / अवसर:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.opportunities.map((opp) => (
                          <span key={opp} className="text-[11px] bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-100">
                            {opp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

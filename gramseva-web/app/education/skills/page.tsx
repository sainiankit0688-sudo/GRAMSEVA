'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type Skill } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';

export default function SkillsPage() {
  const { data: skills, isLoading, error, refetch } = useQuery<Skill[]>(
    queryKeys.education.skills(),
    () => educationService.getSkills(),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Skill Development" titleHindi="कौशल विकास" icon="🔧" gradient="linear-gradient(135deg, #AD1457, #D81B60)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'Skills' }]} />

      <div className="px-4 py-4 space-y-4">
        {/* Notice */}
        <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 flex gap-2 items-start">
          <span aria-hidden="true">💡</span>
          <p className="text-xs text-pink-700">सभी कौशल प्रशिक्षण सरकारी योजनाओं के तहत उपलब्ध हैं। All training available under government schemes.</p>
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading skills..." messageHindi="कौशल लोड हो रहे हैं..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load skills'} messageHindi="कौशल लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && (!skills || skills.length === 0) && (
          <EmptyState icon="🔧" title="No skills available" titleHindi="कोई कौशल उपलब्ध नहीं" />
        )}

        {/* Grid */}
        {!isLoading && !error && skills && skills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">{skill.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm">{skill.name}</h3>
                    <p className="text-xs text-gray-500">{skill.nameHindi}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Duration / अवधि</span>
                    <span className="font-semibold text-gray-700">{skill.duration}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Provider / प्रदाता</span>
                    <span className="font-semibold text-gray-700">{skill.provider}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Certificate / प्रमाणपत्र</span>
                    <span className={`font-semibold ${skill.certification ? 'text-green-600' : 'text-gray-400'}`}>
                      {skill.certification ? '✓ Yes / हाँ' : '✗ No / नहीं'}
                    </span>
                  </div>
                </div>
                <button className="mt-3 w-full py-1.5 rounded-xl text-xs font-semibold text-pink-700 border border-pink-200 hover:bg-pink-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400">
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

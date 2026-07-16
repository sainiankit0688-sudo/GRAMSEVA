'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type StudyMaterial } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';
import BookmarkButton from '@/components/education/BookmarkButton';
import ShareActions from '@/components/education/ShareActions';
import ProgressButtons from '@/components/education/ProgressButtons';

const CATEGORIES = ['All', 'Competitive Exams', 'Language'];

export default function StudyMaterialPage() {
  const [category, setCategory] = useState('All');

  const { data: materials, isLoading, error, refetch } = useQuery<StudyMaterial[]>(
    queryKeys.education.studyMaterial(category === 'All' ? undefined : category),
    () => educationService.getStudyMaterials(category === 'All' ? undefined : category),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);

  const handleDownload = useCallback((item: StudyMaterial) => {
    const content = `${item.subject}\n${item.subjectHindi}\n\nCategory: ${item.category}\nFiles: ${item.files}\n\nNotes: ${item.notes}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.subject.replace(/\s+/g, '_')}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Study Material" titleHindi="अध्ययन सामग्री" icon="📖" gradient="linear-gradient(135deg, #00838F, #00ACC1)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'Study Material' }]} />

      <div className="px-4 py-4 space-y-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                category === c ? 'bg-cyan-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-cyan-300'
              }`}
              aria-pressed={category === c}
            >
              {c === 'All' ? 'All / सभी' : c === 'Competitive Exams' ? 'Competitive / प्रतियोगी' : 'Language / भाषा'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading study material..." messageHindi="अध्ययन सामग्री लोड हो रही है..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load study material'} messageHindi="अध्ययन सामग्री लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && (!materials || materials.length === 0) && (
          <EmptyState icon="📖" title="No study material available" titleHindi="कोई अध्ययन सामग्री उपलब्ध नहीं" />
        )}

        {/* Grid */}
        {!isLoading && !error && materials && materials.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {materials.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2 hover:shadow-md hover:border-cyan-200 transition-all" role="article" aria-label={item.subject}>
                <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{item.subject}</p>
                <p className="text-xs text-gray-500">{item.subjectHindi}</p>
                <span className="text-xs text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full font-medium">
                  📄 {item.files} Resources
                </span>
                <p className="text-[10px] text-gray-500 leading-tight">{item.notes}</p>

                <div className="flex gap-1.5 w-full justify-center">
                  <BookmarkButton itemId={item.id} showLabel={false} />
                </div>

                <ProgressButtons itemId={item.id} />

                <button
                  onClick={() => handleDownload(item)}
                  className="w-full py-1.5 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label={`Download ${item.subject} notes`}
                >
                  Download / डाउनलोड
                </button>

                <div className="w-full">
                  <ShareActions title={item.subject} itemId={item.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

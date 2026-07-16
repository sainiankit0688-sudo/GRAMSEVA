'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { educationService, type FaqItem } from '@/lib/services/educationService';
import { EDUCATION_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, Breadcrumb } from '@/components/agriculture';

const CATEGORIES = ['All', 'Scholarships', 'Exams', 'Skills', 'Career Guidance', 'College Info'];

export default function FaqPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const { data: faqs, isLoading, error, refetch } = useQuery<FaqItem[]>(
    queryKeys.education.faq(),
    () => educationService.getFaqs(categoryFilter === 'All' ? undefined : categoryFilter),
    { staleTime: EDUCATION_STALE_TIME },
  );

  const filtered = useMemo(() => {
    if (!faqs) return [];
    if (categoryFilter === 'All') return faqs;
    return faqs.filter((f) => f.category === categoryFilter);
  }, [faqs, categoryFilter]);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Education FAQ" titleHindi="शिक्षा संबंधी प्रश्न" icon="❓" gradient="linear-gradient(135deg, #C62828, #E53935)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Education', href: '/education' }, { label: 'FAQ' }]} />

      <div className="px-4 py-4 space-y-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategoryFilter(c); setExpanded(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ${
                categoryFilter === c ? 'bg-red-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'
              }`}
              aria-pressed={categoryFilter === c}
            >
              {c === 'All' ? 'All / सभी' : c === 'Career Guidance' ? 'Career / करियर' : c === 'College Info' ? 'Colleges / कॉलेज' : c}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner message="Loading FAQs..." messageHindi="प्रश्न लोड हो रहे हैं..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorAlert message={error.message || 'Failed to load FAQs'} messageHindi="प्रश्न लोड करने में विफल" onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState icon="❓" title="No FAQs found" titleHindi="कोई प्रश्न नहीं मिला" />
        )}

        {/* Accordion */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-2">
            {filtered.map((faq) => {
              const isOpen = expanded === faq.id;
              return (
                <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left px-4 py-3.5 flex items-start justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-400"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 pr-4">{faq.question}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{faq.questionHindi}</p>
                    </div>
                    <span className={`text-gray-400 transition-transform flex-shrink-0 mt-0.5 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="px-4 pb-4 border-t border-gray-100 pt-3"
                      role="region"
                      aria-label={`Answer for: ${faq.question}`}
                    >
                      <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{faq.answerHindi}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

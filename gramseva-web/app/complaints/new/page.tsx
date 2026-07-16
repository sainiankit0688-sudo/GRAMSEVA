'use client';

/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { PageHeader } from '@/components/agriculture';
import { ComplaintForm } from '@/components/complaints';
import { Breadcrumb } from '@/components/agriculture';

export default function NewComplaintPage() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="File a Complaint"
        titleHindi="शिकायत दर्ज करें"
        icon="✏️"
        gradient="linear-gradient(135deg, #4E342E, #6D4C41)"
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Complaints', href: '/complaints' },
          { label: 'New Complaint' },
        ]}
      />

      <div className="px-4 py-5">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <span aria-hidden="true">←</span> Back / पीछे
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800">Complaint Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">शिकायत विवरण भरें</p>
          </div>
          <ComplaintForm />
        </div>

        {/* Info Note */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
          <span className="text-blue-500 text-sm flex-shrink-0" aria-hidden="true">ℹ️</span>
          <p className="text-xs text-blue-700">
            All fields marked with * are required. You can track your complaint status from &quot;My Complaints&quot;.
            <span className="block text-blue-500 mt-0.5">
              * से चिह्नित सभी फ़ील्ड आवश्यक हैं।
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

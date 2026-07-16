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

import Link from 'next/link';
import { useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { complaintService } from '@/lib/services/complaintService';
import { queryKeys } from '@/lib/queryKeys';
import { COMPLAINT_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert } from '@/components/agriculture';
import { ComplaintCard, ComplaintStats, ComplaintAnalytics, ComplaintNotificationButton } from '@/components/complaints';
import { getStoredUser } from '@/lib/auth';

export default function ComplaintsDashboard() {
  const user = getStoredUser();

  const {
    data: complaints,
    isLoading,
    error,
    refetch,
  } = useQuery(
    queryKeys.complaints.mine(),
    () => complaintService.listMine({ pagination: { page: 1, limit: 10 } }),
    { staleTime: COMPLAINT_STALE_TIME },
  );

  const handleRetry = useCallback(() => { refetch(); }, [refetch]);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <div className="relative">
        <PageHeader
          title="Complaints Portal"
          titleHindi="शिकायत पोर्टल"
          icon="📋"
          gradient="linear-gradient(135deg, #4E342E, #6D4C41)"
        >
          <p className="text-amber-100 text-xs mt-1">
            Submit grievances about public services
          </p>
        </PageHeader>
        {user && (
          <div className="absolute top-4 right-4">
            <ComplaintNotificationButton />
          </div>
        )}
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/complaints/new"
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl" aria-hidden="true">✏️</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">New Complaint</p>
              <p className="text-xs text-gray-400">नई शिकायत</p>
            </div>
          </Link>
          <Link href="/complaints/my-complaints"
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl" aria-hidden="true">📂</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">My Complaints</p>
              <p className="text-xs text-gray-400">मेरी शिकायतें</p>
            </div>
          </Link>
        </div>

        {/* Stats */}
        {complaints && complaints.length > 0 && <ComplaintStats complaints={complaints} />}

        {/* Analytics */}
        {complaints && complaints.length > 0 && <ComplaintAnalytics complaints={complaints} />}

        {/* Content */}
        {isLoading && <LoadingSpinner message="Loading complaints..." messageHindi="शिकायतें लोड हो रही हैं..." />}

        {error && (
          <ErrorAlert message={error.message || 'Failed to load complaints.'} messageHindi="शिकायतें लोड करने में विफल।" onRetry={handleRetry} />
        )}

        {!isLoading && !error && complaints && complaints.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
            <span className="text-5xl" aria-hidden="true">📋</span>
            <p className="text-sm font-medium">No complaints yet</p>
            <p className="text-xs">अभी तक कोई शिकायत नहीं</p>
            <Link href="/complaints/new" className="px-5 py-2.5 bg-amber-700 text-white text-sm font-medium rounded-xl hover:bg-amber-800 transition-colors">
              File a Complaint
            </Link>
          </div>
        )}

        {!isLoading && !error && complaints && complaints.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Recent Complaints</h2>
              <Link href="/complaints/my-complaints" className="text-xs font-medium text-amber-700 hover:underline">View All →</Link>
            </div>
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}

        {!user && !isLoading && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-amber-800 font-medium">Login to submit and track complaints</p>
            <Link href="/login" className="inline-block mt-3 px-4 py-2 bg-amber-700 text-white text-xs font-medium rounded-lg hover:bg-amber-800 transition-colors">
              Login / लॉगिन
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

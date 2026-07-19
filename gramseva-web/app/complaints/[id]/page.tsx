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

import { use, useCallback, useState } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { useMutation } from '@/hooks/useMutation';
import { complaintService } from '@/lib/services/complaintService';
import { queryKeys } from '@/lib/queryKeys';
import { COMPLAINT_STALE_TIME } from '@/lib/constants/api';
import { invalidateComplaints } from '@/lib/cache/invalidation';
import { addComplaintNotification } from '@/components/complaints/ComplaintNotificationButton';
import { PageHeader, LoadingSpinner, ErrorAlert, Breadcrumb } from '@/components/agriculture';
import { ProtectedRoute } from '@/components/auth';
import {
  ComplaintTimeline,
  LiveTrackingCard,
  ShareComplaint,
  RelatedComplaints,
} from '@/components/complaints';
import Image from 'next/image';

const CATEGORY_META: Record<string, { icon: string; label: string; color: string }> = {
  road: { icon: '🛣️', label: 'Road Issue', color: '#795548' },
  water: { icon: '💧', label: 'Water Supply', color: '#1565C0' },
  electricity: { icon: '⚡', label: 'Electricity', color: '#F57F17' },
  sanitation: { icon: '🚽', label: 'Sanitation', color: '#2E7D32' },
  drainage: { icon: '🌊', label: 'Drainage', color: '#00838F' },
  streetlight: { icon: '💡', label: 'Street Light', color: '#FF8F00' },
  garbage: { icon: '🗑️', label: 'Garbage', color: '#4E342E' },
  other: { icon: '📋', label: 'Other', color: '#6A1B9A' },
};

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: '#FFF3E0', text: '#E65100' },
  in_progress: { label: 'In Progress', bg: '#E3F2FD', text: '#0D47A1' },
  resolved: { label: 'Resolved', bg: '#E8F5E9', text: '#1B5E20' },
  rejected: { label: 'Rejected', bg: '#FFEBEE', text: '#B71C1C' },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: '#4CAF50' },
  medium: { label: 'Medium', color: '#FF9800' },
  high: { label: 'High', color: '#F44336' },
  urgent: { label: 'Urgent', color: '#B71C1C' },
};

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: complaint, isLoading, error, refetch } = useQuery(
    queryKeys.complaints.detail(id),
    () => complaintService.getById(id),
    { staleTime: COMPLAINT_STALE_TIME },
  );

  const { data: updates, isLoading: updatesLoading } = useQuery(
    queryKeys.complaints.updates(id),
    () => complaintService.getUpdates(id),
    { staleTime: COMPLAINT_STALE_TIME },
  );

  const { mutate: cancelComplaint, isLoading: cancelling } = useMutation(
    () => complaintService.cancel(id),
    {
      onSuccess: () => {
        invalidateComplaints();
        if (complaint) {
          addComplaintNotification({
            complaintId: id,
            title: 'Complaint Cancelled',
            message: `Your complaint "${complaint.title}" has been cancelled.`,
            type: 'rejected',
          });
        }
        setShowCancelConfirm(false);
        refetch();
      },
    },
  );

  const handleRetry = useCallback(() => { refetch(); }, [refetch]);
  const handleCancel = useCallback(() => { cancelComplaint(); }, [cancelComplaint]);

  const formatDateTime = useCallback((dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch { return dateStr; }
  }, []);

  const allPhotoUrls = useCallback(() => {
    if (!complaint) return [];
    const urls: string[] = [];
    if (complaint.photo_urls && Array.isArray(complaint.photo_urls)) urls.push(...complaint.photo_urls);
    else if (complaint.photo_url) urls.push(complaint.photo_url);
    return urls;
  }, [complaint]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#F5F5F5]">
        <PageHeader title="Complaint Details" titleHindi="शिकायत विवरण" icon="📋" gradient="linear-gradient(135deg, #4E342E, #6D4C41)" />
        <LoadingSpinner message="Loading complaint..." messageHindi="शिकायत लोड हो रही है..." />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-full bg-[#F5F5F5]">
        <PageHeader title="Complaint Details" titleHindi="शिकायत विवरण" icon="📋" gradient="linear-gradient(135deg, #4E342E, #6D4C41)" />
        <div className="px-4 py-5">
          <ErrorAlert message={error?.message || 'Complaint not found.'} messageHindi="शिकायत नहीं मिली।" onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  const cat = CATEGORY_META[complaint.category] || CATEGORY_META.other;
  const status = STATUS_META[complaint.status] || STATUS_META.pending;
  const priority = complaint.priority ? PRIORITY_META[complaint.priority] : null;
  const photos = allPhotoUrls();
  const mapUrl = complaint.latitude && complaint.longitude
    ? `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`
    : null;

  return (
    <ProtectedRoute>
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Complaint Details" titleHindi="शिकायत विवरण" icon="📋" gradient="linear-gradient(135deg, #4E342E, #6D4C41)" />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Complaints', href: '/complaints' },
        { label: complaint.title || 'Detail' },
      ]} />

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Status Banner + Share */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ backgroundColor: status.bg }} role="status">
            <span className="text-lg" aria-hidden="true">
              {complaint.status === 'pending' && '⏳'}
              {complaint.status === 'in_progress' && '🔄'}
              {complaint.status === 'resolved' && '✅'}
              {complaint.status === 'rejected' && '❌'}
            </span>
            <span className="text-sm font-bold" style={{ color: status.text }}>{status.label}</span>
            {priority && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white ml-2" style={{ backgroundColor: priority.color }}>
                {priority.label}
              </span>
            )}
          </div>
          <ShareComplaint complaint={complaint} />
        </div>

        {/* Main Info */}
        <article className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3 mb-3">
            <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: cat.color + '15' }} aria-hidden="true">{cat.icon}</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">{complaint.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{cat.label}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{formatDateTime(complaint.created_at)}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{complaint.description}</p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {complaint.village && <div><span className="text-gray-400">Village</span><p className="font-medium text-gray-700">{complaint.village}</p></div>}
            {complaint.block && <div><span className="text-gray-400">Block</span><p className="font-medium text-gray-700">{complaint.block}</p></div>}
            {complaint.district && <div><span className="text-gray-400">District</span><p className="font-medium text-gray-700">{complaint.district}</p></div>}
            {complaint.state && <div><span className="text-gray-400">State</span><p className="font-medium text-gray-700">{complaint.state}</p></div>}
            {complaint.pincode && <div><span className="text-gray-400">Pincode</span><p className="font-medium text-gray-700">{complaint.pincode}</p></div>}
            {complaint.address && <div className="col-span-2"><span className="text-gray-400">Address</span><p className="font-medium text-gray-700">{complaint.address}</p></div>}
          </div>
        </article>

        {/* Live Tracking */}
        <LiveTrackingCard complaint={complaint} updates={updates || []} />

        {/* Photos */}
        {photos.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Photos / फोटो ({photos.length})</h3>
            <div className="flex flex-wrap gap-2">
              {photos.map((url, i) => (
                <Image key={url} src={url} alt={`Photo ${i + 1}`} width={200} height={200} unoptimized
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {mapUrl && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Location / स्थान</h3>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Lat: {complaint.latitude?.toFixed(6)}, Lng: {complaint.longitude?.toFixed(6)}</p>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                📍 Open Map
              </a>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Timeline / समयरेखा</h3>
          {updatesLoading ? <LoadingSpinner message="Loading timeline..." /> : (
            <ComplaintTimeline updates={updates || []} currentStatus={complaint.status} createdAt={complaint.created_at} />
          )}
        </div>

        {/* Related Complaints */}
        <RelatedComplaints complaint={complaint} />

        {/* Cancel */}
        {complaint.status === 'pending' && (
          <div>
            {showCancelConfirm ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm text-red-700 font-medium mb-2">Are you sure?</p>
                <p className="text-xs text-red-500 mb-3">This action cannot be undone.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    No
                  </button>
                  <button type="button" onClick={handleCancel} disabled={cancelling}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-70">
                    {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowCancelConfirm(true)}
                className="w-full py-3 rounded-xl text-sm font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                Cancel Complaint
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}

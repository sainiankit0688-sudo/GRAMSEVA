/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import MediaManager from '@/components/admin/MediaManager';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Media Manager</h1>
        <p className="text-xs text-gray-500 mt-0.5">Upload, organize, and manage media files</p>
      </div>
      <MediaManager />
    </div>
  );
}

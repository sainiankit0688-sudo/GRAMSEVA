/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { adminService } from '@/lib/services/adminService';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import type { PaginatedResponse } from '@/types/api';
import type { MediaFile } from '@/lib/services/adminService';

type MediaFilter = 'all' | 'images' | 'documents';

interface UploadForm {
  name: string;
  url: string;
}

function isImageType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  return '📁';
}

function guessMimeType(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    pdf: 'application/pdf', doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mp4: 'video/mp4', webm: 'video/webm',
    mp3: 'audio/mpeg', wav: 'audio/wav',
    txt: 'text/plain',
  };
  return map[ext] ?? 'application/octet-stream';
}

function guessName(url: string): string {
  try {
    const path = new URL(url).pathname;
    const segments = path.split('/');
    const filename = segments[segments.length - 1];
    return decodeURIComponent(filename) || 'Untitled';
  } catch {
    return 'Untitled';
  }
}

function MediaCard({ file, onPreview, onDelete }: { file: MediaFile; onPreview: (f: MediaFile) => void; onDelete: (f: MediaFile) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {isImageType(file.type) ? (
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="w-full h-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300"
            aria-label={`Preview ${file.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-1 text-3xl" aria-hidden="true">
            <span>{getFileIcon(file.type)}</span>
            <span className="text-[10px] text-gray-400 uppercase font-medium">{file.type.split('/').pop()}</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => onDelete(file)}
          className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-red-300 focus:opacity-100"
          aria-label={`Delete ${file.name}`}
        >
          &times;
        </button>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-xs font-medium text-gray-800 truncate" title={file.name}>{file.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-400">{formatFileSize(file.size)}</span>
          <span className="text-[10px] text-gray-300">&middot;</span>
          <span className="text-[10px] text-gray-400">{formatDate(file.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default function MediaManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [previewTarget, setPreviewTarget] = useState<MediaFile | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({ name: '', url: '' });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [localMedia, setLocalMedia] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pageSize = 12;

  const fetchData = useCallback(async (): Promise<PaginatedResponse<MediaFile>> => {
    return adminService.getMedia({ page, limit: pageSize });
  }, [page]);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedResponse<MediaFile>>(
    queryKeys.admin.media(),
    fetchData,
    { staleTime: 30_000 },
  );

  const serverMedia = data?.data ?? [];
  const allMedia = [...localMedia, ...serverMedia];
  const totalPages = data?.totalPages ?? 0;

  const displayMedia = allMedia.filter((f) => {
    if (filter === 'images' && !isImageType(f.type)) return false;
    if (filter === 'documents' && isImageType(f.type)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q);
    }
    return true;
  });

  const openUpload = useCallback(() => {
    setUploadForm({ name: '', url: '' });
    setUploadOpen(true);
  }, []);

  const closeUpload = useCallback(() => {
    setUploadOpen(false);
    setUploadForm({ name: '', url: '' });
  }, []);

  const handleUrlChange = useCallback((url: string) => {
    setUploadForm((prev) => ({
      name: prev.name || guessName(url),
      url,
    }));
  }, []);

  const handleUpload = useCallback(async () => {
    const url = uploadForm.url.trim();
    if (!url) return;

    const mimeType = guessMimeType(url);
    const name = uploadForm.name.trim() || guessName(url);

    setMutationLoading(true);
    try {
      const record = await adminService.createContent('media', {
        name,
        url,
        type: mimeType,
        size: 0,
      });
      setLocalMedia((prev) => [{
        id: String(record.id ?? Date.now().toString()),
        name,
        url,
        type: mimeType,
        size: 0,
        created_at: new Date().toISOString(),
      }, ...prev]);
      closeUpload();
      refetch();
    } catch {
      // error handled by UI state
    } finally {
      setMutationLoading(false);
    }
  }, [uploadForm, closeUpload, refetch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setMutationLoading(true);
    try {
      if (localMedia.some((m) => m.id === deleteTarget.id)) {
        setLocalMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      } else {
        await adminService.deleteMedia(deleteTarget.id);
      }
      setDeleteTarget(null);
      refetch();
    } catch {
      // error handled by UI state
    } finally {
      setMutationLoading(false);
    }
  }, [deleteTarget, localMedia, refetch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
      handleUrlChange(text);
      setUploadOpen(true);
    }
  }, [handleUrlChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const FILTER_OPTIONS: Array<{ value: MediaFilter; label: string }> = [
    { value: 'all', label: 'All Files' },
    { value: 'images', label: 'Images' },
    { value: 'documents', label: 'Documents' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#1A237E] to-[#3949AB] bg-clip-text text-transparent">
          Media Manager
        </h2>
        <button
          type="button"
          onClick={openUpload}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#1A237E] to-[#3949AB] text-white rounded-xl px-3 py-2 text-xs font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Add media URL"
        >
          <span aria-hidden="true">+</span> Add Media
        </button>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${dragActive ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'}`}
        role="region"
        aria-label="Drop zone for media URLs"
      >
        <div className="text-2xl mb-1" aria-hidden="true">☁️</div>
        <p className="text-xs text-gray-500">
          Drag a URL here or{' '}
          <button
            type="button"
            onClick={openUpload}
            className="text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-1"
          >
            click to add
          </button>
        </p>
        <p className="text-[10px] text-gray-400 mt-1">Paste image URLs to manage your media library</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="max-w-xs flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search media..." />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-0.5" role="tablist" aria-label="Filter media by type">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={filter === opt.value}
              onClick={() => { setFilter(opt.value); setPage(1); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${filter === opt.value ? 'bg-white text-[#1A237E] shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" aria-label="Loading media" />
          <p className="text-xs text-gray-400 mt-2">Loading media files...</p>
        </div>
      ) : displayMedia.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3" aria-hidden="true">📂</div>
          <p className="text-sm font-medium text-gray-600">No media files</p>
          <p className="text-xs text-gray-400 mt-1">
            {search.trim() || filter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first media file to get started'}
          </p>
          {!search.trim() && filter === 'all' && (
            <button
              type="button"
              onClick={openUpload}
              className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-2 py-1"
            >
              Add Media
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" role="list" aria-label="Media files">
            {displayMedia.map((file) => (
              <div key={file.id} role="listitem">
                <MediaCard
                  file={file}
                  onPreview={setPreviewTarget}
                  onDelete={setDeleteTarget}
                />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}

      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2 z-30">
          <div className="w-3 h-3 border border-indigo-200 border-t-indigo-600 rounded-full animate-spin" aria-hidden="true" />
          <span className="text-[10px] text-gray-500">Updating...</span>
        </div>
      )}

      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="media-upload-title">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={closeUpload} aria-label="Close upload dialog" tabIndex={-1} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 id="media-upload-title" className="text-sm font-semibold text-gray-800">Add Media</h3>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Media URL *</label>
              <input
                ref={inputRef}
                type="url"
                value={uploadForm.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                aria-label="Media URL"
                autoFocus
              />
              {uploadForm.url && isImageType(guessMimeType(uploadForm.url)) && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadForm.url}
                    alt="Upload preview"
                    className="w-full h-32 object-cover rounded-xl border border-gray-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">File Name</label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. hero-banner.jpg"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                aria-label="File name"
              />
              {uploadForm.url && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Type: {guessMimeType(uploadForm.url)} &middot; Detected: {guessName(uploadForm.url)}
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={closeUpload}
                disabled={mutationLoading}
                className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={mutationLoading || !uploadForm.url.trim()}
                className="px-4 py-2 text-xs text-white bg-gradient-to-r from-[#1A237E] to-[#3949AB] rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {mutationLoading ? 'Adding...' : 'Add Media'}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="media-preview-title">
          <button type="button" className="absolute inset-0 bg-black/60" onClick={() => setPreviewTarget(null)} aria-label="Close preview" tabIndex={-1} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="bg-gray-50 flex items-center justify-center min-h-[200px] max-h-[60vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewTarget.url}
                alt={previewTarget.name}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
            <div className="px-5 py-4 border-t border-gray-100">
              <h4 id="media-preview-title" className="text-sm font-semibold text-gray-800 truncate">{previewTarget.name}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                <span className="text-xs text-gray-500">Type: {previewTarget.type}</span>
                <span className="text-xs text-gray-500">Size: {formatFileSize(previewTarget.size)}</span>
                <span className="text-xs text-gray-500">Added: {formatDate(previewTarget.created_at)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    window.open(previewTarget.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Open Original
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewTarget.url).catch(() => {});
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => { setPreviewTarget(null); setDeleteTarget(previewTarget); }}
                  className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors ml-auto focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTarget(null)}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Media"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={mutationLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

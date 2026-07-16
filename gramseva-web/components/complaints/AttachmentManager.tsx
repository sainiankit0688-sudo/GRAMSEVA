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

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { complaintService } from '@/lib/services/complaintService';
import { getStoredUser } from '@/lib/auth';
import { COMPLAINT_MAX_PHOTOS, COMPLAINT_MAX_PHOTO_SIZE } from '@/lib/constants/api';

interface AttachmentManagerProps {
  existingUrls?: string[];
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
}

interface PendingFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  error?: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  if (file.size < 500 * 1024) return file;

  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            resolve(file);
          }
        },
        file.type,
        quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export default function AttachmentManager({
  existingUrls = [],
  onChange,
  maxPhotos = COMPLAINT_MAX_PHOTOS,
}: AttachmentManagerProps) {
  const [existing, setExisting] = useState<string[]>(existingUrls);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPhotos = existing.length + pending.length;
  const canAdd = totalPhotos < maxPhotos;

  const syncChange = useCallback(
    (newExisting: string[]) => {
      setExisting(newExisting);
      onChange(newExisting);
    },
    [onChange],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const user = getStoredUser();
      if (!user) return;

      const newPending: PendingFile[] = [];
      for (let i = 0; i < files.length && totalPhotos + newPending.length < maxPhotos; i++) {
        const file = files[i];
        if (file.size > COMPLAINT_MAX_PHOTO_SIZE) {
          newPending.push({
            id: generateId(),
            file,
            preview: '',
            uploading: false,
            error: 'File too large / फ़ाइल बहुत बड़ी है',
          });
          continue;
        }
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
          newPending.push({
            id: generateId(),
            file,
            preview: '',
            uploading: false,
            error: 'Invalid format / अमान्य प्रारूप',
          });
          continue;
        }
        const preview = URL.createObjectURL(file);
        newPending.push({ id: generateId(), file, preview, uploading: true });
      }

      setPending((prev) => [...prev, ...newPending]);

      for (const item of newPending) {
        if (item.error) continue;
        try {
          const compressed = await compressImage(item.file);
          const url = await complaintService.uploadPhoto(compressed, user.id);
          setExisting((prev) => {
            const updated = [...prev, url];
            onChange(updated);
            return updated;
          });
          setPending((prev) => prev.filter((p) => p.id !== item.id));
        } catch (err) {
          setPending((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? { ...p, uploading: false, error: err instanceof Error ? err.message : 'Upload failed' }
                : p,
            ),
          );
        }
      }
    },
    [totalPhotos, maxPhotos, onChange],
  );

  const removeExisting = useCallback(
    (index: number) => {
      const url = existing[index];
      complaintService.deletePhoto(url).catch(() => {});
      const updated = existing.filter((_, i) => i !== index);
      syncChange(updated);
    },
    [existing, syncChange],
  );

  const removePending = useCallback((id: string) => {
    setPending((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* Existing Photos */}
      {existing.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Uploaded photos">
          {existing.map((url, i) => (
            <div key={url} className="relative w-20 h-20 group" role="listitem">
              <Image
                src={url}
                alt={`Photo ${i + 1}`}
                width={80}
                height={80}
                unoptimized
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label={`Remove photo ${i + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading Photos */}
      {pending.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pending.map((item) => (
            <div key={item.id} className="relative w-20 h-20">
              {item.preview ? (
                <Image
                  src={item.preview}
                  alt="Uploading"
                  width={80}
                  height={80}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg border border-gray-200 opacity-60"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-400">⚠</span>
                </div>
              )}
              {item.uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-amber-600 rounded-full animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removePending(item.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                aria-label="Remove"
              >
                ✕
              </button>
              {item.error && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-xs text-red-500 bg-white/80 rounded-b-lg truncate px-1">
                  {item.error}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Button */}
      {canAdd && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            aria-label="Upload photos"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
          >
            <span aria-hidden="true">📷</span>
            Add Photo ({totalPhotos}/{maxPhotos})
          </button>
        </div>
      )}
    </div>
  );
}

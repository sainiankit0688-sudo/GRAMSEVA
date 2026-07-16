'use client';

/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { FileAttachment } from '@/lib/ai/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'text/plain',
];

function generateId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  if (file.size < 500 * 1024 || !file.type.startsWith('image/')) return file;
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(new File([blob], file.name, { type: file.type }));
        else resolve(file);
      }, file.type, quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

interface FileUploadProps {
  attachments: FileAttachment[];
  onChange: (attachments: FileAttachment[]) => void;
  maxFiles?: number;
}

export default function FileUpload({ attachments, onChange, maxFiles = 5 }: FileUploadProps) {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canAdd = attachments.length < maxFiles;

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    setError('');
    const newAttachments: FileAttachment[] = [];

    for (let i = 0; i < files.length && attachments.length + newAttachments.length < maxFiles; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        setError('File too large (max 10MB)');
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Unsupported file type');
        continue;
      }

      const attachment: FileAttachment = {
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
      };

      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        attachment.preview = URL.createObjectURL(compressed);
      }

      if (file.type === 'text/plain') {
        attachment.data = await file.text();
      }

      newAttachments.push(attachment);
    }

    if (newAttachments.length > 0) {
      onChange([...attachments, ...newAttachments]);
    }
  }, [attachments, onChange, maxFiles]);

  const handleRemove = useCallback((id: string) => {
    const item = attachments.find((a) => a.id === id);
    if (item?.preview) URL.revokeObjectURL(item.preview);
    onChange(attachments.filter((a) => a.id !== id));
  }, [attachments, onChange]);

  return (
    <div className="flex flex-col gap-2">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Attached files">
          {attachments.map((a) => (
            <div key={a.id} className="relative w-16 h-16 group" role="listitem">
              {a.preview ? (
                <Image src={a.preview} alt={a.name} width={64} height={64} unoptimized className="w-full h-full object-cover rounded-lg border border-gray-200" />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-lg" aria-hidden="true">
                  {a.type === 'application/pdf' ? '📄' : '📝'}
                </div>
              )}
              <button type="button" onClick={() => handleRemove(a.id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label={`Remove ${a.name}`}>
                ✕
              </button>
              <p className="text-[9px] text-gray-400 truncate mt-0.5 max-w-[64px]">{a.name}</p>
            </div>
          ))}
        </div>
      )}
      {canAdd && (
        <>
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.txt" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" aria-label="Upload files" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 transition-colors" aria-label="Attach file">
            <span aria-hidden="true">📎</span>
            Attach ({attachments.length}/{maxFiles})
          </button>
        </>
      )}
      {error && <p className="text-[10px] text-red-500" role="alert">{error}</p>}
    </div>
  );
}

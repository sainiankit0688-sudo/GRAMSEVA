'use client';

import { useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

interface CropImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeClasses = {
  sm: 'w-11 h-11 text-xl',
  md: 'w-20 h-20 text-3xl',
  lg: 'w-full h-48 text-5xl',
  full: 'w-full h-64 text-6xl',
};

export default function CropImage({
  src,
  alt,
  className = '',
  size = 'lg',
}: CropImageProps) {
  const [imgError, setImgError] = useState(false);

  const fullUrl = src
    ? src.startsWith('http')
      ? src
      : `${SUPABASE_URL}/storage/v1/object/public/crop_images/${src}`
    : null;

  const showImage = fullUrl && !imgError;

  if (size === 'sm') {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}
      >
        {showImage ? (
          <img
            src={fullUrl}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>🌾</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden ${className}`}
    >
      {showImage ? (
        <img
          src={fullUrl}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="opacity-60">🌾</span>
      )}
    </div>
  );
}

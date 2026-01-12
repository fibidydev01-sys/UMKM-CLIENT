'use client';

import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { getImageSource } from '@/lib/cloudinary';

// Base64 blur placeholder
const BLUR_DATA_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3C/svg%3E";

interface OptimizedImageProps {
  src: string | undefined | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'limit';
  gravity?: 'auto' | 'face' | 'faces' | 'center';
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  fallback?: React.ReactNode;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  className,
  crop = 'fill',
  gravity = 'auto',
  priority = false,
  loading,
  fetchPriority,
  fallback,
}: OptimizedImageProps) {
  const { type, src: imageSrc } = getImageSource(src);

  // No image
  if (type === 'none' || !imageSrc) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  // ✅ CLOUDINARY → use CldImage
  if (type === 'cloudinary') {
    return (
      <CldImage
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        crop={crop}
        gravity={gravity}
        className={className}
        {...(priority ? { loading: 'eager' as const, fetchPriority: 'high' as const } : {})}
        {...(loading ? { loading } : {})}
        {...(fetchPriority ? { fetchPriority } : {})}
      />
    );
  }

  // ✅ EXTERNAL URL → use next/image
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      className={className}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      {...(priority ? { priority: true } : {})}
      {...(loading ? { loading } : {})}
    />
  );
}
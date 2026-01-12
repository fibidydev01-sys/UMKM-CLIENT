'use client';

import { CldImage as CldImageBase, type CldImageProps } from 'next-cloudinary';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { extractPublicId, isCloudinaryUrl } from '@/lib/cloudinary';

// ==========================================
// CLOUDINARY IMAGE WRAPPER
// Handles both Cloudinary URLs and public_ids
// ==========================================

interface CloudinaryImageProps extends Omit<CldImageProps, 'src'> {
  src: string | undefined | null;
  fallback?: React.ReactNode;
  className?: string;
}

// Base64 blur placeholder (grey)
const BLUR_DATA_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3C/svg%3E";

export function CloudinaryImage({
  src,
  fallback,
  className,
  ...props
}: CloudinaryImageProps) {
  const [hasError, setHasError] = useState(false);

  // No source provided
  if (!src || hasError) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
        style={{ width: props.width, height: props.height }}
      >
        <span className="text-sm">No Image</span>
      </div>
    );
  }

  // Determine if we need to extract public_id
  const imageSrc = isCloudinaryUrl(src) ? extractPublicId(src) : src;

  return (
    <CldImageBase
      src={imageSrc}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
}

// ==========================================
// PRESET-BASED COMPONENTS
// ==========================================

// Product Card Image (300x300)
export function ProductCardImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string | undefined | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={300}
      height={300}
      crop="fill"
      gravity="auto"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className={cn('object-cover', className)}
      // Next.js 16+: priority → preload
      {...(priority ? { loading: 'eager', fetchPriority: 'high' } : {})}
    />
  );
}

// Product Thumbnail (150x150)
export function ProductThumbnail({
  src,
  alt,
  className,
}: {
  src: string | undefined | null;
  alt: string;
  className?: string;
}) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={150}
      height={150}
      crop="fill"
      gravity="auto"
      className={cn('object-cover', className)}
    />
  );
}

// Hero Banner (1920x1080)
export function HeroBanner({
  src,
  alt,
  className,
  overlayOpacity = 0,
}: {
  src: string | undefined | null;
  alt: string;
  className?: string;
  overlayOpacity?: number;
}) {
  return (
    <div className={cn('relative', className)}>
      <CloudinaryImage
        src={src}
        alt={alt}
        fill
        crop="fill"
        gravity="auto"
        sizes="100vw"
        // CRITICAL for LCP!
        loading="eager"
        fetchPriority="high"
        className="object-cover"
      />
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

// Testimonial Avatar (80x80 with face detection)
export function TestimonialAvatar({
  src,
  name,
  size = 'small',
  className,
}: {
  src: string | undefined | null;
  name: string;
  size?: 'small' | 'large';
  className?: string;
}) {
  const dimensions = size === 'small' ? 80 : 150;

  // Fallback to initials
  if (!src) {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium',
          className
        )}
        style={{ width: dimensions, height: dimensions }}
      >
        {initials}
      </div>
    );
  }

  return (
    <CloudinaryImage
      src={src}
      alt={name}
      width={dimensions}
      height={dimensions}
      crop="thumb"
      gravity="face" // AI Face Detection!
      className={cn('rounded-full object-cover', className)}
    />
  );
}

// Store Logo (200x200, maintain aspect ratio)
export function StoreLogo({
  src,
  storeName,
  className,
}: {
  src: string | undefined | null;
  storeName: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={cn('font-bold text-xl', className)}>
        {storeName}
      </div>
    );
  }

  return (
    <CloudinaryImage
      src={src}
      alt={`${storeName} logo`}
      width={200}
      height={200}
      crop="fit" // Maintain aspect ratio
      className={className}
    />
  );
}
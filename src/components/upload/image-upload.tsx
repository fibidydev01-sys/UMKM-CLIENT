'use client';

// =================================================================
// src/components/upload/image-upload.tsx
//
// Single-image upload dengan Cloudinary widget.
// Script di-load via next/script (lazyOnload) — hanya sekali.
// =================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CloudinaryWidget, ImageUploadProps } from '@/types/cloudinary';

// -----------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------

function checkScriptAlreadyLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.cloudinary;
}

function isValidHttpUrl(url?: string): boolean {
  if (!url?.trim()) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------
// Component
// -----------------------------------------------------------------

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  aspectRatio = 1,
  folder = 'tenant-uploads',
  placeholder = 'Upload gambar',
  showPreview = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [scriptReady, setScriptReady] = useState(checkScriptAlreadyLoaded);
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  const hasImage = isValidHttpUrl(value);

  // Cek apakah script sudah ada di window saat mount
  // (misal: komponen lain sudah load duluan)
  useEffect(() => {
    if (!scriptReady && window.cloudinary) setScriptReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Buka widget — destroy dulu supaya config selalu fresh
  const openWidget = useCallback(() => {
    if (disabled || isUploading || !window.cloudinary) return;

    widgetRef.current?.destroy();
    widgetRef.current = null;

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '',
        folder,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
        maxFileSize: 5_000_000,
        cropping: true,
        croppingAspectRatio: aspectRatio,
        showSkipCropButton: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1',
          },
        },
      },
      (error, result) => {
        if (error) {
          setIsUploading(false);
          document.body.style.overflow = '';
          return;
        }

        switch (result.event) {
          case 'queues-start':
            setIsUploading(true);
            break;
          case 'success':
            if (result.info?.secure_url) {
              onChange(result.info.secure_url.trim());
            }
            setIsUploading(false);
            document.body.style.overflow = '';
            break;
          case 'close':
          case 'abort':
          case 'queues-end':
            setIsUploading(false);
            document.body.style.overflow = '';
            break;
        }
      }
    );

    widgetRef.current.open();
  }, [disabled, isUploading, folder, aspectRatio, onChange]);

  const handleRemove = () => {
    if (isUploading) return;
    onRemove ? onRemove() : onChange('');
  };

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------

  return (
    <>
      {/* Load script sekali — hanya kalau belum ada */}
      {!scriptReady && (
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
          onLoad={() => setScriptReady(true)}
        />
      )}

      <div className={cn('relative group', className)}>
        {hasImage && showPreview ? (
          /* ── Preview mode ──────────────────────────────────────── */
          <div
            className="relative overflow-hidden rounded-lg border bg-muted"
            style={{ aspectRatio }}
          >
            <Image
              src={value!.trim()}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={openWidget}
                  disabled={isUploading || !scriptReady}
                >
                  {isUploading
                    ? <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    : <Upload className="mr-1 h-4 w-4" />
                  }
                  Ganti
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Hapus
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* ── Upload mode ───────────────────────────────────────── */
          <button
            type="button"
            onClick={openWidget}
            disabled={disabled || isUploading || !scriptReady}
            style={{ aspectRatio }}
            className={cn(
              'w-full flex flex-col items-center justify-center gap-1',
              'border-2 border-dashed rounded-lg',
              'bg-muted/50 hover:bg-muted transition-colors',
              disabled && 'cursor-not-allowed opacity-50',
              (isUploading || !scriptReady) && 'cursor-wait opacity-70',
            )}
          >
            {isUploading || !scriptReady ? (
              <>
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                <span className="text-sm text-muted-foreground">
                  {isUploading ? 'Mengupload...' : 'Memuat...'}
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{placeholder}</span>
                <span className="text-xs text-muted-foreground/70">
                  PNG, JPG, WebP · maks 5 MB
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import type { MultiImageUploadProps } from '@/types/cloudinary';

// ==========================================
// MULTI IMAGE UPLOAD COMPONENT
// ==========================================

export function MultiImageUpload({
  value = [],
  onChange,
  folder = 'fibidy/products',
  maxImages = 5,
  disabled = false,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event === 'success' && result.info && typeof result.info !== 'string') {
      const newUrl = result.info.secure_url;
      if (!value.includes(newUrl)) {
        onChange([...value, newUrl]);
      }
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newValue = [...value];
    const [removed] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, removed);
    onChange(newValue);
  };

  const canUploadMore = value.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Uploaded Images */}
        {value.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden border bg-muted group"
          >
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

            {/* Badge - Image Number */}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
              {index + 1}
            </div>

            {/* Actions */}
            {!disabled && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRemove(url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Reorder Buttons */}
            {!disabled && value.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleReorder(index, index - 1)}
                  >
                    ←
                  </Button>
                )}
                {index < value.length - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleReorder(index, index + 1)}
                  >
                    →
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {canUploadMore && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              folder,
              maxFiles: maxImages - value.length,
              resourceType: 'image',
              clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
              maxFileSize: 10000000, // 10MB
              sources: ['local', 'url', 'camera'],
              multiple: true,
              styles: {
                palette: {
                  window: '#FFFFFF',
                  windowBorder: '#E5E7EB',
                  tabIcon: '#10B981',
                  menuIcons: '#6B7280',
                  textDark: '#111827',
                  textLight: '#FFFFFF',
                  link: '#10B981',
                  action: '#10B981',
                  inactiveTabIcon: '#9CA3AF',
                  error: '#EF4444',
                  inProgress: '#10B981',
                  complete: '#10B981',
                  sourceBg: '#F9FAFB',
                },
              },
            }}
            onOpen={() => setIsUploading(true)}
            onClose={() => setIsUploading(false)}
            onSuccess={handleUpload}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                disabled={disabled || isUploading}
                className={cn(
                  'aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors',
                  'hover:border-primary/50 hover:bg-muted/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Tambah Foto
                    </span>
                  </>
                )}
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {value.length} / {maxImages} gambar
        </span>
        {value.length > 0 && (
          <span className="text-xs">
            Gambar pertama akan jadi thumbnail utama
          </span>
        )}
      </div>
    </div>
  );
}
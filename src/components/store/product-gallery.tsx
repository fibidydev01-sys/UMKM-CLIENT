'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/cn';
import {
  getProductImageUrl,
  getThumbnailUrl,
  isCloudinaryUrl
} from '@/lib/cloudinary';

// ==========================================
// PRODUCT GALLERY COMPONENT
// ==========================================

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  // ✅ Get current image URL
  const currentImageUrl = hasImages ? images[selectedIndex] : null;

  // ✅ Use optimized Cloudinary URLs
  const optimizedMainImage = currentImageUrl
    ? isCloudinaryUrl(currentImageUrl)
      ? getProductImageUrl(currentImageUrl) // 800px max, auto quality
      : currentImageUrl
    : null;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // ✅ Get optimized thumbnail URL
  const getOptimizedThumbnail = (imageUrl: string) => {
    return isCloudinaryUrl(imageUrl) ? getThumbnailUrl(imageUrl) : imageUrl;
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        {hasImages && optimizedMainImage ? (
          <>
            <Image
              src={optimizedMainImage}
              alt={`${productName} - Gambar ${selectedIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Zoom Button */}
            <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full shadow-lg"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <div className="relative aspect-square w-full">
                  {/* ✅ Use original URL for zoom (full quality) */}
                  <Image
                    src={currentImageUrl!}
                    alt={`${productName} - Gambar ${selectedIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-24 w-24 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
            >
              {/* ✅ Use optimized thumbnail for strip */}
              <Image
                src={getOptimizedThumbnail(image)}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
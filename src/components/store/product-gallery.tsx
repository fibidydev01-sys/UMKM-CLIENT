'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Package, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/cn';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const currentImage = hasImages ? images[selectedIndex] : null;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultipleImages) return;
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        {hasImages && currentImage ? (
          <>
            <OptimizedImage
              src={currentImage}
              alt={`${productName} - Gambar ${selectedIndex + 1}`}
              fill
              crop="fill"
              gravity="auto"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full shadow-lg"
              onClick={() => setZoomOpen(true)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

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

      {/* Thumbnails */}
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
              <OptimizedImage
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                width={80}
                height={80}
                crop="fill"
                gravity="auto"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ✅ FIXED: Custom Full-screen Zoom Modal */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogPrimitive.Portal>
          {/* Dark Overlay */}
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          {/* ✅ CENTERED Content */}
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex items-center justify-center outline-none"
            onKeyDown={handleKeyDown}
          >
            {/* Hidden title for accessibility */}
            <DialogTitle className="sr-only">
              {productName} - Gambar {selectedIndex + 1}
            </DialogTitle>

            {/* Close Button */}
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Tutup</span>
              </Button>
            </DialogPrimitive.Close>

            {/* Navigation */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white h-12 w-12"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white h-12 w-12"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* ✅ CENTERED Image Container */}
            <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
              {currentImage && (
                <OptimizedImage
                  src={currentImage}
                  alt={`${productName} - Gambar ${selectedIndex + 1}`}
                  fill
                  crop="fit"
                  sizes="90vw"
                  className="object-contain"
                />
              )}
            </div>

            {/* Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════
// DISCOVER PAGE - V10.0 PRODUCTION READY
// WITH SUSPENSE BOUNDARY (Next.js Best Practice)
// ══════════════════════════════════════════════════════════════

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DiscoverPageClient } from './client';
import { Skeleton } from '@/components/ui/skeleton';

// ══════════════════════════════════════════════════════════════
// METADATA
// ══════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Discover UMKM Lokal Indonesia | Fibidy',
  description:
    'Temukan berbagai UMKM lokal Indonesia. Warung makan, salon, laundry, bengkel, dan ribuan usaha lainnya. Semua punya toko online sendiri di Fibidy.',
  keywords: [
    'umkm indonesia',
    'discover umkm',
    'toko online lokal',
    'warung online',
    'jasa lokal',
    'fibidy',
  ],
  openGraph: {
    title: 'Discover UMKM Lokal Indonesia | Fibidy',
    description: 'Temukan berbagai UMKM lokal Indonesia dengan toko online sendiri.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

// ══════════════════════════════════════════════════════════════
// LOADING FALLBACK
// Shown while client component hydrates with useSearchParams
// ══════════════════════════════════════════════════════════════

function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-96 rounded-full hidden md:block" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <Skeleton className="h-12 w-48 mb-4" />
              <Skeleton className="h-16 w-full max-w-md mb-4" />
              <Skeleton className="h-6 w-full max-w-lg mb-8" />

              {/* Tabs skeleton */}
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-full" />
              </div>

              {/* Search skeleton */}
              <Skeleton className="h-14 w-full rounded-full mb-4" />

              {/* Tags skeleton */}
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 h-14">
            <Skeleton className="h-9 w-24" />
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-1 flex-1">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group">
                <Skeleton className="aspect-[4/3] w-full rounded-xl mb-3" />
                <div className="flex items-center gap-3 px-1">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// Wraps client component with Suspense for useSearchParams
// ══════════════════════════════════════════════════════════════

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverLoading />}>
      <DiscoverPageClient />
    </Suspense>
  );
}
/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/landing-builder/page.tsx
 * ============================================================================
 * Route: /dashboard/landing-builder
 * Description: Main entry point - Redirects to gallery
 * ============================================================================
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function LandingBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to gallery on mount
    router.replace('/dashboard/landing-builder/gallery');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

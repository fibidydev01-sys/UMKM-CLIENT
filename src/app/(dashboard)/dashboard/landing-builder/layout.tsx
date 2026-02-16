/**
 * Landing Builder Layout
 *
 * Minimal layout for full-screen builder experience
 * Protected with AuthGuard - requires authentication
 */

'use client';

import { useEffect } from 'react';
import { AuthGuard } from '@/components/auth';

export default function LandingBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add class to body to override global overflow-y: scroll
  useEffect(() => {
    document.body.classList.add('landing-builder-active');
    return () => {
      document.body.classList.remove('landing-builder-active');
    };
  }, []);

  return (
    <AuthGuard requireAuth redirectTo="/login">
      <div className="h-screen w-full overflow-hidden">
        {children}
      </div>
    </AuthGuard>
  );
}

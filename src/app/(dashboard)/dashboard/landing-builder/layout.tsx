'use client';

import { useEffect } from 'react';
import { AuthGuard } from '@/components/auth';

export default function LandingBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add('landing-builder-active');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove('landing-builder-active');
      document.body.style.overflow = '';
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
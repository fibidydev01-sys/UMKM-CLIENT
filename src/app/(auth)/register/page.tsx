import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout, RegisterForm } from '@/components/auth';
import { Skeleton } from '@/components/ui/skeleton';

// ==========================================
// REGISTER PAGE
// ==========================================

export const metadata: Metadata = {
  title: 'Daftar',
  description: 'Buat toko online gratis dalam hitungan menit',
};

// ==========================================
// LOADING SKELETON
// ==========================================

function RegisterFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-40 mx-auto" />
    </div>
  );
}

// ==========================================
// PAGE COMPONENT
// ==========================================

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Buat Toko Online Gratis"
      description="Mulai jualan online dalam hitungan menit"
    >
      {/* ✅ FIXED: Wrap in Suspense for client-side hooks */}
      <Suspense fallback={<RegisterFormSkeleton />}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
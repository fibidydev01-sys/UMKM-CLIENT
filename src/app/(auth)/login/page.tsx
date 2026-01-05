import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout, LoginForm } from '@/components/auth';
import { Skeleton } from '@/components/ui/skeleton';

// ==========================================
// LOGIN PAGE
// ==========================================

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke dashboard toko Anda',
};

// ==========================================
// LOADING SKELETON
// ==========================================

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  );
}

// ==========================================
// PAGE COMPONENT
// ==========================================

export default function LoginPage() {
  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      description="Masuk ke dashboard untuk mengelola toko Anda"
    >
      {/* ✅ FIXED: Wrap in Suspense because LoginForm uses useSearchParams via useLogin hook */}
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
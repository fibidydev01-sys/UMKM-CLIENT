import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout, ForgotPasswordForm } from '@/components/auth';
import { Skeleton } from '@/components/ui/skeleton';

// ==========================================
// FORGOT PASSWORD PAGE
// ==========================================

export const metadata: Metadata = {
  title: 'Lupa Password',
  description: 'Reset password akun Anda',
};

// ==========================================
// LOADING SKELETON
// ==========================================

function ForgotPasswordFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-28 mx-auto" />
    </div>
  );
}

// ==========================================
// PAGE COMPONENT
// ==========================================

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Lupa Password?"
      description="Jangan khawatir, kami akan membantu Anda"
    >
      {/* ✅ FIXED: Wrap in Suspense for client-side hooks */}
      <Suspense fallback={<ForgotPasswordFormSkeleton />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
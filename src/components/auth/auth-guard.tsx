'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  useAuthHydrated,
  useIsAuthenticated,
  useAuthChecked,
  useAuthStore,
} from '@/stores';
import { authApi } from '@/lib/api';

// ==========================================
// AUTH GUARD COMPONENT
// ==========================================

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isHydrated = useAuthHydrated();
  const isAuthenticated = useIsAuthenticated();
  const isChecked = useAuthChecked();

  const { setTenant, setChecked } = useAuthStore();
  const hasRedirectedRef = useRef(false);
  const hasCheckedRef = useRef(false);

  // Check auth status on mount
  useEffect(() => {
    if (!isHydrated || hasCheckedRef.current || isChecked) return;

    hasCheckedRef.current = true;

    const checkAuth = async () => {
      try {
        const response = await authApi.status();

        if (response.authenticated && response.tenant) {
          setTenant(response.tenant);
        } else {
          setTenant(null);
        }
      } catch {
        setTenant(null);
      } finally {
        setChecked(true);
      }
    };

    checkAuth();
  }, [isHydrated, isChecked, setTenant, setChecked]);

  // Handle redirect
  useEffect(() => {
    if (!isHydrated || !isChecked) return;
    if (hasRedirectedRef.current) return;

    if (requireAuth && !isAuthenticated) {
      hasRedirectedRef.current = true;
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${redirectTo}?from=${returnUrl}`);
    }
  }, [isHydrated, isChecked, isAuthenticated, requireAuth, redirectTo, pathname, router]);

  // Loading state
  if (!isHydrated || !isChecked) {
    return <LoadingScreen message="Memeriksa autentikasi..." />;
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    return <LoadingScreen message="Mengalihkan..." />;
  }

  return <>{children}</>;
}

// ==========================================
// GUEST GUARD
// ==========================================

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestGuard({
  children,
  redirectTo = '/dashboard',
}: GuestGuardProps) {
  const router = useRouter();

  const isHydrated = useAuthHydrated();
  const isAuthenticated = useIsAuthenticated();
  const isChecked = useAuthChecked();

  const { setTenant, setChecked } = useAuthStore();
  const hasRedirectedRef = useRef(false);
  const hasCheckedRef = useRef(false);

  // Check auth status on mount
  useEffect(() => {
    if (!isHydrated || hasCheckedRef.current || isChecked) return;

    hasCheckedRef.current = true;

    const checkAuth = async () => {
      try {
        const response = await authApi.status();

        if (response.authenticated && response.tenant) {
          setTenant(response.tenant);
        } else {
          setTenant(null);
        }
      } catch {
        setTenant(null);
      } finally {
        setChecked(true);
      }
    };

    checkAuth();
  }, [isHydrated, isChecked, setTenant, setChecked]);

  // Handle redirect if authenticated
  useEffect(() => {
    if (!isHydrated || !isChecked) return;
    if (hasRedirectedRef.current) return;

    if (isAuthenticated) {
      hasRedirectedRef.current = true;
      router.replace(redirectTo);
    }
  }, [isHydrated, isChecked, isAuthenticated, redirectTo, router]);

  // During check, show children
  if (!isHydrated || !isChecked) {
    return <>{children}</>;
  }

  // Authenticated - show loading while redirecting
  if (isAuthenticated) {
    return <LoadingScreen message="Anda sudah login..." />;
  }

  return <>{children}</>;
}

// ==========================================
// LOADING SCREEN
// ==========================================

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-3 rounded-full bg-primary/10 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">{message}</p>
          <p className="text-xs text-muted-foreground">Mohon tunggu sebentar</p>
        </div>
      </div>
    </div>
  );
}
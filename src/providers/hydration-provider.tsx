'use client';

import { useSyncExternalStore } from 'react';

// ==========================================
// HYDRATION HOOKS (using useSyncExternalStore)
// ✅ No ESLint errors!
// ==========================================

/**
 * Empty subscribe - for client-only values
 */
const emptySubscribe = () => () => { };

/**
 * ✅ Hook: Check if component is hydrated
 * Uses useSyncExternalStore - NO useEffect/useState needed!
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // Client: true after hydration
    () => false   // Server: false during SSR
  );
}

// ==========================================
// HYDRATION PROVIDER (Simplified)
// Just passes children through - actual hydration handled by hooks
// ==========================================

interface HydrationProviderProps {
  children: React.ReactNode;
}

export function HydrationProvider({ children }: HydrationProviderProps) {
  // No state, no effects - just pass through
  // Hydration is handled by useSyncExternalStore in individual hooks
  return <>{children}</>;
}

// ==========================================
// HYDRATION BOUNDARY
// Show fallback until hydrated
// ==========================================

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationBoundary({
  children,
  fallback = null,
}: HydrationBoundaryProps) {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
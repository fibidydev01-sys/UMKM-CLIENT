'use client';

import { useSyncExternalStore } from 'react';

// Empty subscribe function (mount state doesn't change)
const emptySubscribe = () => () => { };

/**
 * Check if component is mounted/hydrated
 * Uses useSyncExternalStore for React Compiler compatibility
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // Client: always true after hydration
    () => false   // Server: always false
  );
}

/**
 * Alias for useMounted
 */
export function useIsClient(): boolean {
  return useMounted();
}

/**
 * Hook specifically for hydration state
 * Returns true immediately on client-side navigation
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
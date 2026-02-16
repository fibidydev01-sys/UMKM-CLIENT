"use client";

import { useState, useCallback, useMemo } from 'react';
import { useTenant } from './use-tenant';
import { useProducts } from './use-products';
import {
  calculateOnboardingProgress,
  OnboardingProgress
} from '@/lib/onboarding';

// ============================================
// USE ONBOARDING HOOK
// ============================================

const DISMISSED_KEY = 'onboarding_dismissed';
const DISMISSED_AT_KEY = 'onboarding_dismissed_at';

interface UseOnboardingReturn {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  isDismissed: boolean;
  error: string | null;
  dismissOnboarding: () => void;
  restoreOnboarding: () => void;
  refreshProgress: () => void;
}

export function useOnboarding(): UseOnboardingReturn {
  const { tenant } = useTenant();
  const { products } = useProducts();

  // ✅ FIX 1: Lazy initialization from localStorage (no useEffect needed!)
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  });

  // ✅ FIX 2: Derive both progress AND error from useMemo (no useState for error!)
  const { progress, error } = useMemo(() => {
    if (!tenant) {
      return { progress: null, error: null };
    }

    try {
      const productsCount = products?.length || 0;
      const result = calculateOnboardingProgress(tenant, productsCount);
      return { progress: result, error: null };
    } catch (err) {
      console.error('Failed to calculate progress:', err);
      return { progress: null, error: 'Failed to calculate progress' };
    }
  }, [tenant, products]);

  // Dismiss onboarding
  const dismissOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISSED_KEY, 'true');
      localStorage.setItem(DISMISSED_AT_KEY, new Date().toISOString());
    }
    setIsDismissed(true);
  }, []);

  // Restore onboarding
  const restoreOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DISMISSED_KEY);
      localStorage.removeItem(DISMISSED_AT_KEY);
    }
    setIsDismissed(false);
  }, []);

  // Refresh progress (force recalculation)
  const refreshProgress = useCallback(() => {
    // This will trigger recalculation via useMemo when tenant/products change
    // For now, this is a placeholder for potential API refresh
  }, []);

  // Only wait for tenant! Products can be 0 (no problem for calculation)
  // Progress calculation is INSTANT - no need to wait for products API!
  const isLoading = !tenant;

  return {
    progress,
    isLoading,
    isDismissed,
    error,
    dismissOnboarding,
    restoreOnboarding,
    refreshProgress,
  };
}
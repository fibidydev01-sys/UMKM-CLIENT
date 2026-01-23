"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const { products, isLoading: productsLoading } = useProducts();

  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage for dismissed state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(DISMISSED_KEY);
      setIsDismissed(dismissed === 'true');
    }
  }, []);

  // Calculate progress
  const progress = useMemo(() => {
    if (!tenant) return null;

    try {
      const productsCount = products?.length || 0;
      return calculateOnboardingProgress(tenant, productsCount);
    } catch (err) {
      setError('Failed to calculate progress');
      return null;
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

  // ✅ FIX: Only wait for tenant! Products can be 0 (no problem for calculation)
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

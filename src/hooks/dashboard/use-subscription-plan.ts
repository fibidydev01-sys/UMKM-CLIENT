'use client';

// ==========================================
// USE SUBSCRIPTION PLAN HOOK
// File: src/hooks/dashboard/use-subscription-plan.ts
//
// Reads blockVariantLimit from API (plan-limits.ts backend).
//
// ⚠️ FIX: Infinity tidak bisa di-serialize JSON (jadi null).
// Backend kirim 999999 untuk BUSINESS.
// Frontend treat null / >= 999 sebagai Infinity (unlimited).
// ==========================================

import { useState, useEffect } from 'react';
import { subscriptionApi } from '@/lib/api/subscription';

export interface SubscriptionPlanInfo {
  plan: 'STARTER' | 'BUSINESS';
  blockVariantLimit: number; // 3 untuk STARTER, Infinity untuk BUSINESS
  isLoading: boolean;
  isBusiness: boolean;
}

/**
 * Normalize limit dari API:
 * - null / undefined / 0 → Infinity (unlimited)
 * - >= 999 → Infinity (backend kirim 999999 untuk unlimited)
 * - angka valid (misal 3) → pakai apa adanya
 */
function normalizeLimit(raw: number | null | undefined): number {
  if (raw == null || raw === 0 || raw >= 999) return Infinity;
  return raw;
}

export function useSubscriptionPlan(): SubscriptionPlanInfo {
  const [plan, setPlan] = useState<'STARTER' | 'BUSINESS'>('STARTER');
  const [blockVariantLimit, setBlockVariantLimit] = useState<number>(Infinity); // default safe: jangan lock semua
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    subscriptionApi
      .getMyPlan()
      .then((info) => {
        const rawPlan = info.subscription.plan;
        const rawLimit = info.limits.componentBlockVariants;

        setPlan(rawPlan);

        // Normalize: null/999999/Infinity → Infinity (unlock semua untuk BUSINESS)
        // Angka kecil (3) → pakai apa adanya (STARTER)
        setBlockVariantLimit(normalizeLimit(rawLimit));
      })
      .catch(() => {
        // Fallback aman: jangan lock apapun kalau fetch gagal
        setPlan('STARTER');
        setBlockVariantLimit(Infinity);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return {
    plan,
    blockVariantLimit,
    isLoading,
    isBusiness: plan === 'BUSINESS',
  };
}
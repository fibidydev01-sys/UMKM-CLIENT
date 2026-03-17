'use client';

/**
 * useXenditPayment Hook
 *
 * Pengganti useSnapPayment — Xendit Invoice pakai hosted page,
 * tidak perlu load CDN script apapun.
 *
 * Flow:
 *   1. Hit POST /api/payment/subscribe → dapat invoice_url
 *   2. Redirect full page ke invoice_url (hosted Xendit checkout)
 *   3. Xendit redirect balik ke success_redirect_url / failure_redirect_url
 *      yang sudah di-set di backend (xendit.service.ts)
 *
 * ```tsx
 * const { isPaying, error, pay } = useXenditPayment();
 * await pay(); // auto-redirect ke Xendit checkout
 * ```
 */

import { useState, useCallback } from 'react';
import { subscriptionApi, type CreatePaymentResponse } from '@/lib/api/subscription';

export function useXenditPayment() {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = useCallback(async () => {
    setIsPaying(true);
    setError(null);

    try {
      const response: CreatePaymentResponse =
        await subscriptionApi.createUpgradePayment();

      // Redirect ke Xendit hosted invoice page
      // User pilih metode bayar di sana (VA, QRIS, e-wallet, dll)
      window.location.href = response.invoice_url;

      // Note: setIsPaying(false) tidak dipanggil karena
      // halaman akan redirect — state tidak relevan lagi
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
      setIsPaying(false);
    }
  }, []);

  return { isPaying, error, pay };
}
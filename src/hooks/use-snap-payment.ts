'use client';

import { useEffect, useState, useCallback } from 'react';

const SNAP_URL_SANDBOX = 'https://app.sandbox.midtrans.com/snap/snap.js';
const SNAP_URL_PRODUCTION = 'https://app.midtrans.com/snap/snap.js';

interface UseSnapPaymentOptions {
  clientKey: string;
  isProduction?: boolean;
}

/**
 * Hook untuk load Midtrans Snap.js dan trigger payment popup.
 *
 * ```tsx
 * const { isLoaded, pay } = useSnapPayment({ clientKey: '...' });
 * pay(token, { onSuccess, onPending, onError, onClose });
 * ```
 */
export function useSnapPayment({ clientKey, isProduction = false }: UseSnapPaymentOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Sudah loaded
    if (window.snap) {
      setIsLoaded(true);
      return;
    }

    // Script sudah ada di DOM tapi belum loaded
    const existingScript = document.querySelector('script[src*="snap.js"]') as HTMLScriptElement;
    if (existingScript) {
      const onLoad = () => setIsLoaded(true);
      const onError = () => setError('Gagal memuat sistem pembayaran');
      existingScript.addEventListener('load', onLoad);
      existingScript.addEventListener('error', onError);
      return () => {
        existingScript.removeEventListener('load', onLoad);
        existingScript.removeEventListener('error', onError);
      };
    }

    // Load script baru
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = isProduction ? SNAP_URL_PRODUCTION : SNAP_URL_SANDBOX;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      setError('Gagal memuat sistem pembayaran');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  }, [clientKey, isProduction]);

  const pay = useCallback(
    (snapToken: string, options?: SnapOptions) => {
      if (!isLoaded || !window.snap) {
        console.error('Snap.js belum siap');
        return;
      }
      window.snap.pay(snapToken, {
        onSuccess: (result) => options?.onSuccess?.(result),
        onPending: (result) => options?.onPending?.(result),
        onError: (result) => options?.onError?.(result),
        onClose: () => options?.onClose?.(),
      });
    },
    [isLoaded],
  );

  return { isLoaded, isLoading, error, pay };
}

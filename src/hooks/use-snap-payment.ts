/**
 * useSnapPayment Hook
 *
 * Loads Midtrans Snap.js and triggers the payment popup.
 *
 * ```tsx
 * const { isLoaded, pay } = useSnapPayment({ clientKey: '...' });
 * pay(token, { onSuccess, onPending, onError, onClose });
 * ```
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

const SNAP_URL_SANDBOX = 'https://app.sandbox.midtrans.com/snap/snap.js';
const SNAP_URL_PRODUCTION = 'https://app.midtrans.com/snap/snap.js';

interface UseSnapPaymentOptions {
  clientKey: string;
  isProduction?: boolean;
}

export function useSnapPayment({ clientKey, isProduction = false }: UseSnapPaymentOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already loaded before effect runs
    const checkInitialLoad = () => {
      if (window.snap) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkInitialLoad()) return;

    // Script already in DOM but not yet loaded
    const existingScript = document.querySelector('script[src*="snap.js"]') as HTMLScriptElement;
    if (existingScript) {
      const onLoad = () => setIsLoaded(true);
      const onError = () => setError('Failed to load payment system');
      existingScript.addEventListener('load', onLoad);
      existingScript.addEventListener('error', onError);
      return () => {
        existingScript.removeEventListener('load', onLoad);
        existingScript.removeEventListener('error', onError);
      };
    }

    // Create script — set loading state in event handlers only
    const script = document.createElement('script');
    script.src = isProduction ? SNAP_URL_PRODUCTION : SNAP_URL_SANDBOX;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    // Set loading state before adding to DOM (not in effect body)
    const startLoading = () => setIsLoading(true);
    startLoading();

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      setError('Failed to load payment system');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  }, [clientKey, isProduction]);

  const pay = useCallback(
    (snapToken: string, options?: SnapOptions) => {
      if (!isLoaded || !window.snap) {
        console.error('[useSnapPayment] Snap.js not ready');
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
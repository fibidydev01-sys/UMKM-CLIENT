'use client';

// ==========================================
// PWA HOOK
// Re-export from provider for convenience
// ==========================================

// Main hook - re-export from provider
export { usePWA } from '@/components/pwa/pwa-provider';

// ==========================================
// PWA UTILITIES
// ==========================================

/**
 * Check if the app is running as PWA (installed)
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if PWA install is supported
 */
export function isPWASupported(): boolean {
  if (typeof window === 'undefined') return false;

  return 'serviceWorker' in navigator;
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android/.test(navigator.userAgent);
}

/**
 * Get PWA display mode
 */
export function getPWADisplayMode():
  | 'browser'
  | 'standalone'
  | 'minimal-ui'
  | 'fullscreen' {
  if (typeof window === 'undefined') return 'browser';

  const displayModes = ['standalone', 'minimal-ui', 'fullscreen'] as const;

  for (const mode of displayModes) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) {
      return mode;
    }
  }

  return 'browser';
}
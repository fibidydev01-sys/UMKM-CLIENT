'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { InstallPrompt } from './install-prompt';

// ==========================================
// PWA CONTEXT TYPES
// ==========================================

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  installApp: () => Promise<void>;
  dismissInstall: () => void;
}

// ==========================================
// PWA CONTEXT
// ==========================================

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isInstalled: false,
  isOnline: true,
  installApp: async () => { },
  dismissInstall: () => { },
});

export const usePWA = () => useContext(PWAContext);

// ==========================================
// PWA PROVIDER
// ==========================================

interface PWAProviderProps {
  children: React.ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isIOSStandalone = (window.navigator as any).standalone === true;
    return isStandalone || isIOSStandalone;
  });
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  });
  const [showPrompt, setShowPrompt] = useState(false);

  // ==========================================
  // HANDLE INSTALL PROMPT EVENT
  // ==========================================
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedAt = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);

      // Show prompt if not dismissed or dismissed more than 7 days ago
      if (!dismissed || daysSinceDismissed > 7) {
        // Delay showing prompt for better UX
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // ==========================================
  // HANDLE ONLINE/OFFLINE STATUS
  // ==========================================
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ==========================================
  // REGISTER SERVICE WORKER
  // ==========================================
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('[PWA] SW registration failed:', error);
        });
    }
  }, []);

  // ==========================================
  // INSTALL APP HANDLER
  // ==========================================
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowPrompt(false);
    } catch (error) {
      console.error('[PWA] Install failed:', error);
    }
  }, [deferredPrompt]);

  // ==========================================
  // DISMISS INSTALL HANDLER
  // ==========================================
  const dismissInstall = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isOnline,
        installApp,
        dismissInstall,
      }}
    >
      {children}

      {/* Install Prompt */}
      {showPrompt && !isInstalled && (
        <InstallPrompt onInstall={installApp} onDismiss={dismissInstall} />
      )}
    </PWAContext.Provider>
  );
}
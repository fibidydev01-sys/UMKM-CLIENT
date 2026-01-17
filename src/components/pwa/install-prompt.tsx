'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ==========================================
// INSTALL PROMPT COMPONENT
// Shows banner to install PWA
// ==========================================

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  });

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleInstall = () => {
    if (isIOS) {
      // iOS doesn't support beforeinstallprompt
      // Show instructions instead
      alert(
        'Untuk install di iPhone/iPad:\n\n' +
        '1. Tap tombol Share (📤)\n' +
        '2. Scroll ke bawah\n' +
        '3. Tap "Add to Home Screen"\n' +
        '4. Tap "Add"'
      );
    } else {
      onInstall();
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ease-out',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="mx-auto max-w-lg">
        <div className="relative rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 p-4 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg">
              <Smartphone className="h-7 w-7 text-pink-500" />
            </div>

            {/* Content */}
            <div className="flex-1 pr-6">
              <h3 className="text-lg font-bold text-white">Install Fibidy</h3>
              <p className="mt-1 text-sm text-white/90">
                {isIOS
                  ? 'Tambahkan ke Home Screen untuk akses lebih cepat!'
                  : 'Install aplikasi untuk pengalaman terbaik!'}
              </p>

              {/* Features */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['Akses Cepat', 'Offline Mode', 'Notifikasi'].map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleInstall}
                  className="bg-white text-pink-600 hover:bg-white/90"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isIOS ? 'Cara Install' : 'Install Sekarang'}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  Nanti Saja
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

// ══════════════════════════════════════════════════════════════
// COOKIE CONSENT — V1.0 Raycast Standard
// Bottom bar full width, functional only, accept saja
// localStorage key: fibidy_cookie_consent
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay sedikit biar ga langsung muncul saat halaman load
    const timer = setTimeout(() => {
      const accepted = localStorage.getItem('fibidy_cookie_consent');
      if (!accepted) setVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fibidy_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'border-t border-border/60 bg-background/95 backdrop-blur-xl',
        'animate-in slide-in-from-bottom duration-300'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">

          {/* Text */}
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            {/* Dot indicator */}
            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5 sm:mt-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kami menggunakan cookie fungsional yang diperlukan untuk menjalankan platform ini.{' '}
              <Link
                href="/privacy"
                className="text-foreground font-medium hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Pelajari lebih lanjut
              </Link>
            </p>
          </div>

          {/* CTA */}
          <Button
            size="sm"
            onClick={handleAccept}
            className="shrink-0 h-9 px-5 text-sm font-semibold"
          >
            Saya mengerti
          </Button>

        </div>
      </div>
    </div>
  );
}
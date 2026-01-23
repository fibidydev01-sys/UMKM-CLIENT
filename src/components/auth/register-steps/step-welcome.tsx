'use client';

import { Store, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ==========================================
// TYPES
// ==========================================

interface StepWelcomeProps {
  onNext: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="space-y-8 py-8">
      {/* Hero Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
            <Store className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400">
            <Sparkles className="w-5 h-5 text-yellow-900" />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Buat Toko Online Gratis
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Mulai jualan online dalam hitungan menit. Kelola produk, pesanan, dan pelanggan dengan mudah.
        </p>
      </div>

      {/* Features List */}
      <div className="grid gap-4 max-w-sm mx-auto">
        {[
          '✨ Toko online gratis selamanya',
          '📦 Kelola produk & stok dengan mudah',
          '📱 WhatsApp terintegrasi',
          '📊 Dashboard lengkap untuk bisnis',
        ].map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
          >
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="button"
          size="lg"
          onClick={onNext}
          className="w-full max-w-xs group"
        >
          Mulai Sekarang
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

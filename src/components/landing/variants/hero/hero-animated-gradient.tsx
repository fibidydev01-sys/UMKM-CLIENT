'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { LightRays } from '@/components/ui/light-rays';
import { WordRotate } from '@/components/ui/word-rotate';

interface HeroAnimatedGradientProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Variant: Animated Gradient
 *
 * Dynamic animated gradient background with light rays
 * Modern and eye-catching with rotating words effect
 */
export function HeroAnimatedGradient({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  logo,
  storeName,
}: HeroAnimatedGradientProps) {
  // Split title for word rotation if it contains multiple words
  const titleWords = title.split(' ');
  const hasMultipleWords = titleWords.length > 1;

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-600 animate-gradient-xy" />
        <LightRays />
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 py-16 text-center space-y-8">
        {/* Logo */}
        {logo && (
          <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden border-4 border-white/80 shadow-2xl bg-white/20 backdrop-blur-sm">
            <OptimizedImage
              src={logo}
              alt={storeName || title}
              fill
              crop="fill"
              gravity="auto"
              className="object-cover"
            />
          </div>
        )}

        {/* Title with word rotation */}
        <div className="space-y-4">
          {hasMultipleWords ? (
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              {titleWords.slice(0, -2).join(' ')}{' '}
              <WordRotate
                words={[titleWords[titleWords.length - 1], 'Premium', 'Berkualitas', 'Terbaik']}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
              />
            </h1>
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-lg font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {showCta && (
          <div className="pt-6">
            <Link href={ctaLink}>
              <Button
                size="lg"
                className="gap-2 text-lg px-8 py-6 shadow-2xl bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all"
              >
                {ctaText}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Decorative elements */}
        <div className="flex justify-center gap-12 pt-8">
          <div className="text-white/80">
            <p className="text-3xl font-bold">1000+</p>
            <p className="text-sm">Produk</p>
          </div>
          <div className="text-white/80">
            <p className="text-3xl font-bold">5000+</p>
            <p className="text-sm">Pelanggan</p>
          </div>
          <div className="text-white/80">
            <p className="text-3xl font-bold">4.9⭐</p>
            <p className="text-sm">Rating</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        :global(.animate-gradient-xy) {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/lib/utils';

interface HeroParallaxProps {
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
 * Hero Variant: Parallax
 *
 * Parallax scrolling effect with layered content
 * Creates depth and modern feel with smooth animations
 */
export function HeroParallax({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroParallaxProps) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const scrolled = Math.max(0, -rect.top);
        setScrollY(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[700px] flex items-center justify-center overflow-hidden rounded-xl"
    >
      {/* Parallax Background Layers */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {backgroundImage ? (
          <OptimizedImage
            src={backgroundImage}
            alt={storeName || title}
            fill
            crop="fill"
            gravity="auto"
            sizes="100vw"
            priority
            loading="eager"
            fetchPriority="high"
            className="object-cover scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Floating geometric shapes for parallax effect */}
      <div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      <div
        className="absolute top-40 right-20 w-32 h-32 rounded-full bg-purple-500/10 blur-xl"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-pink-500/10 blur-xl"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />

      {/* Content with parallax */}
      <div
        className="relative z-10 max-w-5xl px-6 py-16"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
          opacity: Math.max(0, 1 - scrollY / 400),
        }}
      >
        <div className="text-center space-y-8">
          {/* Logo */}
          {logo && (
            <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl animate-float">
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

          {/* Title */}
          <h1
            className={cn(
              'text-4xl md:text-6xl lg:text-7xl font-bold',
              backgroundImage ? 'text-white drop-shadow-2xl' : 'text-foreground'
            )}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={cn(
                'text-lg md:text-2xl max-w-3xl mx-auto',
                backgroundImage ? 'text-white/90 drop-shadow-lg' : 'text-muted-foreground'
              )}
            >
              {subtitle}
            </p>
          )}

          {showCta && (
            <div className="pt-8">
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="gap-2 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  {ctaText}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        :global(.animate-float) {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Prism from '@/components/ui/prism/Prism';
import { Card } from '@/components/ui/card';

interface Hero2Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero2({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
}: Hero2Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background - Prism */}
      <div className="absolute inset-0 opacity-20">
        <Prism
          height={3.5}
          baseWidth={5.5}
          animationType="rotate"
          glow={1.2}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          bloom={1}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-12 lg:py-0">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Title - Extra Bold */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tight"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0"
              >
                {subtitle}
              </motion.p>
            )}

            {/* CTA */}
            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex justify-center lg:justify-start pt-2"
              >
                <Link href={ctaLink}>
                  <InteractiveHoverButton className="min-w-[180px] text-base px-8 py-5 font-semibold gap-2">
                    <Download className="h-5 w-5" />
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <Card className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted">
              {backgroundImage ? (
                <OptimizedImage
                  src={backgroundImage}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {logo ? (
                    <OptimizedImage src={logo} alt={title} fill className="object-contain p-20" />
                  ) : (
                    <div className="text-9xl opacity-20">
                      <Package className="h-full w-full" />
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
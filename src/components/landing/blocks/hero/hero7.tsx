'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Circle } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card } from '@/components/ui/card';
import ColorBlends from '@/components/ui/color-blends/ColorBends';

interface Hero7Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero7({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  logo,
}: Hero7Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background py-20">
      {/* Background - ColorBlends */}
      <div className="absolute inset-0 opacity-30">
        <ColorBlends
          colors={['#5227FF', '#FF9FFC', '#B19EEF', '#8B5CF6', '#EC4899']}
          blur={80}
          speed={2}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-12"
        >
          {/* Small Logo Top */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md ring-1 ring-border">
                <OptimizedImage src={logo} alt="Logo" fill className="object-cover" />
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
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
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[180px] text-base px-8 py-5 font-semibold gap-2">
                  {ctaText}
                  <ChevronRight className="h-5 w-5" />
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Large Dot Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="pt-8"
          >
            <Card className="relative h-[400px] md:h-[500px] overflow-hidden bg-muted/50 backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                {/* Dot Pattern - Diamond Shape */}
                <div className="grid grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2 md:gap-3">
                  {[...Array(240)].map((_, i) => {
                    const row = Math.floor(i / 20);
                    const col = i % 20;
                    const centerRow = 6;
                    const centerCol = 10;
                    const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
                    const maxDistance = 16;
                    const size = Math.max(0, 1 - distance / maxDistance);

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: size * 0.6, scale: size }}
                        transition={{ delay: 0.6 + (i * 0.002), duration: 0.3 }}
                      >
                        <Circle
                          className="text-foreground fill-foreground"
                          style={{ width: `${4 + size * 8}px`, height: `${4 + size * 8}px` }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
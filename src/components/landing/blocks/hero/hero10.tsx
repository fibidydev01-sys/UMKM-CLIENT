'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PixelBlast from '@/components/ui/pixel-blast/PixelBlast';

interface Hero10Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero10({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
}: Hero10Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background py-20">
      {/* Background - PixelBlast */}
      <div className="absolute inset-0 opacity-30">
        <PixelBlast
          particleColor="#5227FF"
          particleCount={100}
          speed={2}
          spread={1.5}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-8 mb-20"
        >
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
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Dual CTA */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[180px] text-base px-8 py-5 font-semibold">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
              <Button variant="outline" size="lg" className="min-w-[180px] text-base px-8 py-5 h-auto" asChild>
                <Link href="#about">Secondary</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Large Image Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted shadow-2xl">
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
                  <div className="relative w-full h-full p-20">
                    <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="text-9xl opacity-10">🎨</div>
                )}
              </div>
            )}
            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/20 to-transparent" />
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
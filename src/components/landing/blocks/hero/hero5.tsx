'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Circle } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card } from '@/components/ui/card';
import Silk from '@/components/ui/silk/silk';

interface Hero5Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero5({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
}: Hero5Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background py-20">
      {/* Background - Silk */}
      <div className="absolute inset-0 opacity-15">
        <Silk speed={3} scale={1.5} color="#7B7481" noiseIntensity={1.2} rotation={0} />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-8 mb-16"
        >
          {/* Logo Small */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg ring-2 ring-border">
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
        </motion.div>

        {/* Large Image with Dot Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative h-[400px] md:h-[500px] overflow-hidden bg-muted">
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
                {/* Dot Pattern */}
                <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-3 md:gap-4 p-8">
                  {[...Array(128)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.3, scale: 1 }}
                      transition={{ delay: 0.6 + (i * 0.005), duration: 0.3 }}
                    >
                      <Circle className="h-2 w-2 md:h-3 md:w-3 fill-foreground text-foreground" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
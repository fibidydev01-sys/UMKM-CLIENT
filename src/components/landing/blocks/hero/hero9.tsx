'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Play } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LightRays from '@/components/ui/light-rays/LightRays';

interface Hero9Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero9({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
}: Hero9Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex items-center">
      {/* Background - LightRays */}
      <div className="absolute inset-0 opacity-20">
        <LightRays
          rayCount={12}
          rayColor="#5227FF"
          speed={1.5}
          spread={0.3}
          opacity={0.4}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto lg:mx-0">
          {/* Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Alert className="bg-primary/5 border-primary/20">
              <Bell className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi eaque distinctio iusto voluptas voluptatum sed!
              </AlertDescription>
            </Alert>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-8"
          >
            {/* Title - Extra Bold Left Aligned */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tight max-w-3xl"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base md:text-lg text-muted-foreground max-w-xl"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Dual CTA */}
            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-4 pt-2"
              >
                <Link href={ctaLink}>
                  <InteractiveHoverButton className="min-w-[180px] text-base px-8 py-5 font-semibold">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
                <Button variant="outline" size="lg" className="min-w-[180px] text-base px-8 py-5 h-auto gap-2">
                  <Play className="h-5 w-5" />
                  Watch video
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
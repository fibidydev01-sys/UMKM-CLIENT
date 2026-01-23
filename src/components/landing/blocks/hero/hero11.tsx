'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';

/**
 * Hero2 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - heroTitle: Marketing headline
 * @prop subtitle - heroSubtitle: Value proposition
 * @prop ctaText - heroCtaText: CTA button text
 * @prop ctaLink - heroCtaLink: CTA button link
 * @prop backgroundImage - heroBackgroundImage: Cloudinary URL (1920x800px)
 * @prop logo - logo: Cloudinary URL (200x200px)
 * @prop storeName - name: Store name
 */
interface Hero11Props {
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
 * Hero Block: hero11
 * Design: Split Screen
 * Mobile: Stacked (image first) → Desktop: Side-by-side (content first)
 */
export function Hero11({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero11Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[600px] md:min-h-[700px] lg:min-h-screen py-8 sm:py-12 md:py-16 lg:py-20">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            {/* Logo */}
            {logo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl">
                  <OptimizedImage
                    src={logo}
                    alt={storeName || title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm md:text-base">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                {storeName || 'Featured'}
              </Badge>
            </motion.div>

            {/* Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-3 sm:space-y-4 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* CTA */}
            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex justify-center lg:justify-start pt-2"
              >
                <Link href={ctaLink} className="w-full sm:w-auto">
                  <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-5">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2"
          >
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={storeName || title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
                <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl opacity-20">🎨</span>
              </div>
            )}

            {/* Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
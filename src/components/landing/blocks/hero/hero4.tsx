'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import LightPillar from '@/components/ui/light-pillar/LightPillar';

interface Hero4Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

const testimonialAvatars = [
  { initials: 'JD', color: 'bg-blue-500' },
  { initials: 'SM', color: 'bg-green-500' },
  { initials: 'AR', color: 'bg-purple-500' },
  { initials: 'KL', color: 'bg-pink-500' },
  { initials: 'MT', color: 'bg-orange-500' },
];

export function Hero4({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
}: Hero4Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center">
      {/* Background - LightPillar */}
      <div className="absolute inset-0 opacity-25">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1.2}
          rotationSpeed={0.3}
          glowAmount={0.006}
          pillarWidth={2.5}
          quality="high"
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center space-y-10"
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
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
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
                <InteractiveHoverButton className="min-w-[200px] text-base md:text-lg px-8 py-5 font-semibold">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center gap-6 pt-8"
          >
            {/* Avatars */}
            <div className="flex items-center -space-x-3">
              {testimonialAvatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  <Avatar className={`h-12 w-12 border-2 border-background ${avatar.color}`}>
                    <AvatarFallback className="text-white font-semibold">
                      {avatar.initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">5.0</span>
                <span className="text-sm text-muted-foreground">from 200+ reviews</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
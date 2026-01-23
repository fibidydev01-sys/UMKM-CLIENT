'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Slash, Type, Settings, Layers } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Aurora from '@/components/ui/aurora/Aurora';

interface Hero6Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

const techIcons = [
  { Icon: Slash, label: 'shadcn/ui' },
  { Icon: Type, label: 'TypeScript' },
  { Icon: Settings, label: 'React' },
  { Icon: Layers, label: 'Next.js' },
];

export function Hero6({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  logo,
}: Hero6Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background - Aurora */}
      <div className="absolute inset-0 opacity-40">
        <Aurora
          colors={['#5227FF', '#FF9FFC', '#B19EEF', '#8B5CF6']}
          blur={60}
          speed={3}
          scale={1}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-10"
        >
          {/* Logo Card */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <Card className="p-4 bg-background/80 backdrop-blur-xl border-primary/20 shadow-2xl">
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  <OptimizedImage src={logo} alt="Logo" fill className="object-contain" />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
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
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[180px] text-base px-8 py-5 font-semibold">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
              <Button variant="outline" size="lg" className="min-w-[180px] text-base px-8 py-5 h-auto gap-2" asChild>
                <Link href="#about">
                  Learn more
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          )}

          {/* Tech Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pt-8"
          >
            <p className="text-sm text-muted-foreground mb-6">Built with open-source technologies</p>
            <div className="flex items-center justify-center gap-6">
              {techIcons.map(({ Icon, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                  className="group"
                >
                  <Card className="p-3 bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
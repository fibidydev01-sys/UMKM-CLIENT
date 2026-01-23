'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Shield, ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DarkVeil from '@/components/ui/dark-veil/DarkVeil';

interface Hero3Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

const techLogos = [
  { name: 'shadcn/ui', icon: '//shadcn/ui' },
  { name: 'NEXT.', icon: 'NEXT.' },
  { name: 'tailwindcss', icon: '~tailwindcss' },
  { name: 'Vercel', icon: '▲Vercel' },
];

export function Hero3({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
}: Hero3Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background py-20">
      {/* Background - DarkVeil */}
      <div className="absolute inset-0 opacity-30">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0.1}
          scanlineIntensity={0}
          speed={0.3}
          warpAmount={0.5}
          resolutionScale={0.5}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-8 mb-16"
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
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[180px] text-base px-8 py-5 font-semibold gap-2">
                  {ctaText}
                  <ChevronRight className="h-5 w-5" />
                </InteractiveHoverButton>
              </Link>
              <Button variant="outline" size="lg" className="min-w-[180px] text-base px-8 py-5 h-auto" asChild>
                <Link href="#about">Learn more</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16"
        >
          {/* Card 1 */}
          <Card className="relative h-[300px] md:h-[350px] overflow-hidden group bg-muted/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all">
            <div className="absolute inset-0 flex items-center justify-center">
              {backgroundImage ? (
                <OptimizedImage src={backgroundImage} alt="Feature 1" fill className="object-cover opacity-20" />
              ) : (
                <Zap className="h-32 w-32 text-primary/20" />
              )}
            </div>
            <div className="absolute bottom-4 right-4">
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link href="#feature1">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Card 2 */}
          <Card className="relative h-[300px] md:h-[350px] overflow-hidden group bg-muted/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all">
            <div className="absolute inset-0 flex items-center justify-center">
              {logo ? (
                <OptimizedImage src={logo} alt="Feature 2" fill className="object-contain p-20 opacity-50" />
              ) : (
                <Shield className="h-32 w-32 text-primary/20" />
              )}
            </div>
            <div className="absolute bottom-4 right-4">
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link href="#feature2">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Tech Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {techLogos.map((tech, index) => (
            <div
              key={index}
              className="text-muted-foreground/60 text-xl md:text-2xl font-semibold hover:text-foreground transition-colors"
            >
              {tech.icon}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
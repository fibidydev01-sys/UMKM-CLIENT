'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {  Code, Database, Cpu, Zap } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import FloatingLines from '@/components/ui/floating-lines/FloatingLines';

interface Hero8Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

const techBadges = [
  { Icon: Code, label: 'React' },
  { Icon: Database, label: 'Supabase' },
  { Icon: Cpu, label: 'TypeScript' },
  { Icon: Zap, label: 'Vercel' },
];

export function Hero8({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  logo,
}: Hero8Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background - FloatingLines */}
      <div className="absolute inset-0 opacity-25">
        <FloatingLines
          lineColor="#5227FF"
          particleColor="#FF9FFC"
          particleCount={50}
          lineCount={8}
          speed={1}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

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
              <Card className="relative p-6 bg-background/90 backdrop-blur-xl border-primary/10 shadow-2xl">
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  <OptimizedImage src={logo} alt="Logo" fill className="object-contain" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-lg" />
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

          {/* CTA */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[200px] text-base md:text-lg px-8 py-5 font-semibold">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Tech Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pt-6"
          >
            <p className="text-sm text-muted-foreground mb-6">Built with open-source technologies</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {techBadges.map(({ Icon, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                >
                  <Badge variant="secondary" className="px-4 py-2 text-sm gap-2 bg-muted/50 hover:bg-muted transition-colors">
                    <Icon className="h-4 w-4" />
                    {label}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
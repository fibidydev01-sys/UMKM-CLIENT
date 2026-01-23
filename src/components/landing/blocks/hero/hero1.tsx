'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Box, Layers, Zap, Package, Grid3x3, Blocks } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LiquidEther from '@/components/ui/liquid-ether/LiquidEther';

interface Hero1Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

const floatingIcons = [
  { Icon: Box, position: { top: '15%', left: '8%' }, delay: 0 },
  { Icon: Layers, position: { top: '25%', right: '12%' }, delay: 0.2 },
  { Icon: Zap, position: { top: '45%', left: '5%' }, delay: 0.4 },
  { Icon: Package, position: { bottom: '30%', left: '15%' }, delay: 0.6 },
  { Icon: Grid3x3, position: { bottom: '20%', right: '18%' }, delay: 0.8 },
  { Icon: Blocks, position: { top: '60%', right: '8%' }, delay: 1.0 },
  { Icon: Box, position: { top: '35%', left: '25%' }, delay: 0.3 },
  { Icon: Package, position: { bottom: '45%', right: '25%' }, delay: 0.7 },
];

export function Hero1({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  logo,
  storeName,
}: Hero1Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background - LiquidEther */}
      <div className="absolute inset-0 opacity-40">
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          autoDemo={true}
          autoSpeed={0.3}
          resolution={0.5}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {floatingIcons.map(({ Icon, position, delay }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: delay,
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 3,
            }}
            className="absolute"
            style={position}
          >
            <Card className="p-4 bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg">
              <Icon className="h-8 w-8 text-primary" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-primary/5 border-primary/20">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              {storeName || 'Welcome'}
            </Badge>
          </motion.div>

          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-xl ring-2 ring-border">
                <OptimizedImage src={logo} alt={storeName || 'Logo'} fill className="object-cover" />
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
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
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[200px] text-base md:text-lg px-8 py-5 font-semibold">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
              <Button variant="outline" size="lg" className="min-w-[200px] text-base md:text-lg px-8 py-5 h-auto gap-2" asChild>
                <Link href="#products">
                  Lihat Produk
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
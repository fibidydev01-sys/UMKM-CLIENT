'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Circle } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card } from '@/components/ui/card';

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
      {/* Animated Iridescent Background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,_92,_246,_0.3),_transparent_50%)] animate-pulse"
          style={{ animationDuration: '6s' }} />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_rgba(139,_92,_246,_0.2),_rgba(236,_72,_153,_0.2),_rgba(139,_92,_246,_0.2))] animate-spin-slow" />
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
                      transition={{ delay: 0.6 + i * 0.005, duration: 0.3 }}
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

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        :global(.animate-gradient-shift) {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }
        
        :global(.animate-spin-slow) {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
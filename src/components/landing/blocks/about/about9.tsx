'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ScrollFloat from '@/components/ui/scroll-float/ScrollFloat';

interface About9Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export function About9({ title, subtitle, content, image }: About9Props) {
  return (
    <section id="about" className="relative min-h-screen">
      {image && (
        <div className="absolute inset-0 -z-10">
          <OptimizedImage src={image} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
      )}
      {!image && <div className="absolute inset-0 -z-10 bg-gray-900" />}

      <div className="relative z-10 py-32 md:py-40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl text-center">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            stagger={0.03}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">{title}</h2>
          </ScrollFloat>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-white/90 mb-8"
            >
              {subtitle}
            </motion.p>
          )}

          {content && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base md:text-lg text-white/80 leading-relaxed"
            >
              {content}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
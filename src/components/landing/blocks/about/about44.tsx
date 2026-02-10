// About44.tsx
'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import FluidGlass from '@/components/ui/fluid-glass/FluidGlass';
import Crosshair from '@/components/ui/crosshair/Crosshair';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';
import ScrollFloat from '@/components/ui/scroll-float/ScrollFloat';

interface About44Props {
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

export function About44({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About44Props) {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-20 overflow-hidden bg-slate-50"
    >
      {/* Crosshair Cursor */}
      <Crosshair containerRef={containerRef} color="#3b82f6" targeted />

      {/* Subtle Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with True Focus */}
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            blurAmount={5}
            borderColor="#3b82f6"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <ScrollFloat
                animationDuration={1}
                ease="back.out(1.5)"
                scrollStart="center bottom"
                scrollEnd="bottom top"
                stagger={0.02}
              >
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </ScrollFloat>
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Fluid Glass 3D */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200"
          >
            <FluidGlass
              mode="lens"
              scale={0.25}
              ior={1.15}
              thickness={2}
              transmission={1}
              roughness={0}
              chromaticAberration={0.05}
              anisotropy={0.01}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {feature.icon && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-blue-50 border border-blue-100">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-1 text-slate-900">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
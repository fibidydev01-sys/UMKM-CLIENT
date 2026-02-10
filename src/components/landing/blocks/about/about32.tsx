// About32.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import DecayCard from '@/components/ui/decay-card/DecayCard';
import GlareHover from '@/components/ui/glare-hover/GlareHover';
import SplitText from '@/components/ui/split-text/SplitText';
import FadeContent from '@/components/ui/fade-content/FadeContent';

interface About32Props {
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

export function About32({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About32Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-white">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Split Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SplitText
            text={title}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-900"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
          />
          {subtitle && (
            <FadeContent delay={300} duration={1}>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            </FadeContent>
          )}
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12"
          >
            <GlareHover
              glareColor="#3b82f6"
              glareIntensity={0.3}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200"
            >
              <p className="text-slate-600 leading-relaxed text-lg text-center">
                {content}
              </p>
            </GlareHover>
          </motion.div>
        )}

        {/* Decay Cards Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <DecayCard
                  image={feature.icon || image}
                  title={feature.title}
                  description={feature.description}
                  decaySpeed={0.5}
                  particleColor="#3b82f6"
                  particleCount={30}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
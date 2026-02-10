// About35.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Dock from '@/components/ui/dock/Dock';
import TargetCursor from '@/components/ui/target-cursor/TargetCursor';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';
import Shuffle from '@/components/ui/shuffle/Shuffle';

interface About35Props {
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

export function About35({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About35Props) {
  const dockItems = features.map((feature, index) => ({
    icon: (
      <div className="relative w-full h-full">
        <OptimizedImage
          src={feature.icon || '/placeholder-icon.png'}
          alt={feature.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    ),
    label: feature.title,
    onClick: () => console.log(`Clicked: ${feature.title}`),
  }));

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50/30"
    >
      {/* Target Cursor */}
      <TargetCursor
        targetColor="#3b82f6"
        targetSize={40}
        innerSize={8}
        ringCount={2}
        pulseSpeed={1.5}
      />

      {/* Depth Shadows */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-slate-400/10 rounded-full blur-3xl" />

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
              <Shuffle
                text={subtitle}
                shuffleDirection="right"
                duration={0.35}
                ease="power3.out"
                stagger={0.03}
                triggerOnce={true}
                className="text-slate-600 text-lg max-w-2xl mx-auto"
              />
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-slate-600 leading-relaxed text-lg">
                {content}
              </p>
            )}

            {/* Features List */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.slice(0, 3).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <h3 className="font-bold mb-2 text-lg text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Dock Navigation */}
        {dockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Dock
              items={dockItems}
              panelHeight={68}
              baseItemSize={50}
              magnification={70}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
// About11.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import TextPressure from '@/components/ui/text-pressure/TextPressure';
import SpotlightCard from '@/components/ui/spotlight-card/SpotlightCard';

interface About11Props {
  title: string;
  content?: string;
  image?: string;
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export function About11({
  title,
  content,
  image,
  features = [],
}: About11Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Content & Image Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Main Image - KIRI */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Title + Content - KANAN */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Title with TextPressure */}
            <div className="h-24">
              <TextPressure
                text={title}
                flex
                alpha={false}
                stroke={false}
                width
                weight
                italic
                textColor="hsl(var(--foreground))"
                strokeColor="hsl(var(--primary))"
                minFontSize={32}
              />
            </div>

            {/* Content */}
            {content && (
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            )}
          </motion.div>
        </div>

        {/* Features - SLIM 4 COLUMNS */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <SpotlightCard
                  key={index}
                  spotlightColor="rgba(255, 105, 180, 0.6)"
                  className="bg-black border border-white/10 hover:border-pink-500/50 transition-colors duration-300"
                >
                  <div className="p-6 space-y-3 text-center">
                    <h3 className="font-semibold text-base text-white">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
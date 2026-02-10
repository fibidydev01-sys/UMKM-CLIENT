// About15.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Plasma from '@/components/ui/plasma/Plasma';
import DecayCard from '@/components/ui/decay-card/DecayCard';
import Lightning from '@/components/ui/lightning/Lightning';

interface About15Props {
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

export function About15({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About15Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Plasma Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Plasma
          color="hsl(var(--primary))"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>

      {/* Lightning Overlay */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <Lightning hue={260} xOffset={0} speed={1} intensity={1} size={1} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          </motion.div>
        )}

        {/* Main Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Decay Cards Grid */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateX: -90 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <DecayCard
                  image={feature.icon || ''}
                  title={feature.title}
                  description={feature.description}
                  decaySpeed={1.5}
                  revealOnHover
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
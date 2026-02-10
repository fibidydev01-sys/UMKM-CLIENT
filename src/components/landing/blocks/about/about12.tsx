// About12.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Hyperspeed from '@/components/ui/hyperspeed/Hyperspeed';
import Stack from '@/components/ui/stack/Stack';
import FallingText from '@/components/ui/falling-text/FallingText';

interface About12Props {
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

export function About12({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About12Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Hyperspeed
          effectOptions={{
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            speedUp: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <FallingText
            text={title}
            delay={100}
            className="text-4xl md:text-5xl font-black mb-4"
          />
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

        {/* Stack Cards */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Main Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Features as Stack */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Stack>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-card border shadow-lg"
                  >
                    {feature.icon && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden mb-4">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold mb-2 text-xl">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </Stack>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
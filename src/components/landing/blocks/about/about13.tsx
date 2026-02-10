// About13.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface About13Props {
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

export function About13({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About13Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
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

        {/* Grid Layout - IMAGE KIRI + FEATURES KANAN */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image - KIRI */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl h-full">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Features - KANAN (SLIM) */}
          {features.length > 0 && (
            <div className="grid grid-cols-1 gap-4 h-full content-center">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4 rounded-xl bg-card/80 backdrop-blur-sm border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {feature.icon && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
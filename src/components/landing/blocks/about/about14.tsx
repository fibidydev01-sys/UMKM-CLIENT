// About14.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import PixelSnow from '@/components/ui/pixel-snow/PixelSnow';
import GlassSurface from '@/components/ui/glass-surface/GlassSurface';
import FluidGlass from '@/components/ui/fluid-glass/FluidGlass';

interface About14Props {
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

export function About14({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About14Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Pixel Snow Background */}
      <div className="absolute inset-0 z-0">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={125}
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
          <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Fluid Glass Effect */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-[500px]"
            >
              <FluidGlass
                mode="lens"
                scale={0.25}
                ior={1.15}
                thickness={2}
                transmission={1}
                roughness={0}
              />
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
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            )}

            {/* Features with Glass Surface */}
            {features.length > 0 && (
              <div className="space-y-4 pt-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassSurface
                      width="100%"
                      height={100}
                      borderRadius={16}
                      displace={0.3}
                      distortionScale={-180}
                      opacity={0.93}
                    >
                      <div className="p-4 flex items-center gap-4">
                        {feature.icon && (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <OptimizedImage
                              src={feature.icon}
                              alt={feature.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </GlassSurface>
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
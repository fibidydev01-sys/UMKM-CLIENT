// About24.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import TextPressure from '@/components/ui/text-pressure/TextPressure';
import GlassSurface from '@/components/ui/glass-surface/GlassSurface';
import ScrollFloat from '@/components/ui/scroll-float/ScrollFloat';
import GradientText from '@/components/ui/gradient-text/GradientText';

interface About24Props {
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

export function About24({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About24Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-tr from-pink-50 via-white to-pink-100/40"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Text Pressure */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="relative h-40 mb-6">
            <TextPressure
              text={title}
              flex
              width
              weight
              italic={false}
              textColor="#1a1a1a"
              strokeColor="#ec4899"
              minFontSize={48}
            />
          </div>
          {subtitle && (
            <ScrollFloat
              animationDuration={1}
              ease="back.out(1.5)"
              scrollStart="center bottom"
              scrollEnd="bottom top"
              stagger={0.02}
            >
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            </ScrollFloat>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image with Glass Surface */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassSurface
                width="100%"
                height={500}
                borderRadius={24}
                displace={0.5}
                distortionScale={-180}
                brightness={60}
                opacity={0.95}
                className="overflow-hidden"
              >
                <div className="relative w-full h-full">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </GlassSurface>
            </motion.div>
          )}

          {/* Content with Glass Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={16}
                opacity={0.9}
                className="p-6 mb-6"
              >
                <GradientText
                  colors={['#ec4899', '#f472b6', '#fbcfe8', '#ec4899']}
                  animationSpeed={6}
                  showBorder={false}
                  className="text-lg leading-relaxed"
                >
                  {content}
                </GradientText>
              </GlassSurface>
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
                  >
                    <GlassSurface
                      width="100%"
                      height="auto"
                      borderRadius={12}
                      opacity={0.85}
                      className="p-4 hover:opacity-95 transition-opacity"
                    >
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
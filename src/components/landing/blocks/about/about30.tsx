// About30.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Stack from '@/components/ui/stack/Stack';
import TextType from '@/components/ui/text-type/TextType';
import ScrollFloat from '@/components/ui/scroll-float/ScrollFloat';
import FuzzyText from '@/components/ui/fuzzy-text/FuzzyText';

interface About30Props {
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

export function About30({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About30Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-50">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-slate-100/50" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-300/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Fuzzy Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
              {title}
            </h2>
          </FuzzyText>
          {subtitle && (
            <div className="mt-6">
              <TextType
                texts={[subtitle]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                deletingSpeed={50}
                className="text-slate-600 text-lg max-w-2xl mx-auto"
              />
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Stack Slider */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[500px]"
          >
            <Stack
              images={[
                image || 'https://picsum.photos/800/600?random=1',
                'https://picsum.photos/800/600?random=2',
                'https://picsum.photos/800/600?random=3',
                'https://picsum.photos/800/600?random=4',
              ]}
              autoPlay
              playSpeed={3000}
              perspective={1000}
              rotationAngle={5}
            />
          </motion.div>

          {/* Content with Scroll Float */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <ScrollFloat
                animationDuration={1}
                ease="back.out(1.5)"
                scrollStart="center bottom"
                scrollEnd="bottom top"
                stagger={0.02}
              >
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  {content}
                </p>
              </ScrollFloat>
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
                    <div className="flex items-center gap-4">
                      {feature.icon && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-blue-100">
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
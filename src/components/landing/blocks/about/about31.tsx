// About31.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import CardSwap from '@/components/ui/card-swap/CardSwap';
import PixelTransition from '@/components/ui/pixel-transition/PixelTransition';
import CircularText from '@/components/ui/circular-text/CircularText';
import Magnet from '@/components/ui/magnet/Magnet';

interface About31Props {
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

export function About31({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About31Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
    >
      {/* Circular Text Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 pointer-events-none">
        <CircularText
          text="✦ INNOVATION ✦ TECHNOLOGY ✦ DIGITAL ✦ "
          onHover="speedUp"
          spinDuration={20}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Pixel Transition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <PixelTransition
            text={title}
            pixelSize={4}
            transitionSpeed={0.5}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-900"
          />
          {subtitle && (
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Card Swap */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[500px]"
          >
            <CardSwap
              cards={[
                {
                  image: image || 'https://picsum.photos/600/800?random=1',
                  title: 'Front',
                  description: content,
                },
                {
                  image: 'https://picsum.photos/600/800?random=2',
                  title: 'Back',
                  description: 'Discover more about our services',
                },
              ]}
              autoSwap
              swapInterval={4000}
              swapDirection="horizontal"
            />
          </motion.div>

          {/* Features with Magnet Effect */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Magnet padding={40} magnetStrength={50}>
                      <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all">
                        <div className="flex items-start gap-4">
                          {feature.icon && (
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-blue-100 bg-blue-50">
                              <OptimizedImage
                                src={feature.icon}
                                alt={feature.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold mb-2 text-lg text-slate-900">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Magnet>
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
// About27.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import DomeGallery from '@/components/ui/dome-gallery/DomeGallery';
import GradientText from '@/components/ui/gradient-text/GradientText';
import SplitText from '@/components/ui/split-text/SplitText';
import Magnet from '@/components/ui/magnet/Magnet';

interface About27Props {
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

export function About27({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About27Props) {
  const galleryImages = [
    image || 'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
  ];

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Gradient Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <GradientText
            colors={['#0f172a', '#3b82f6', '#60a5fa', '#0f172a']}
            animationSpeed={8}
            showBorder={false}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            {title}
          </GradientText>
          {subtitle && (
            <SplitText
              text={subtitle}
              className="text-slate-600 text-lg max-w-2xl mx-auto"
              delay={50}
              duration={1}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
            />
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Dome Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[600px]"
          >
            <DomeGallery
              images={galleryImages}
              autoRotate
              rotationSpeed={0.3}
              radius={300}
              itemWidth={200}
              itemHeight={150}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {/* Features */}
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
                    <Magnet padding={30} magnetStrength={40}>
                      <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all">
                        <div className="flex items-start gap-4">
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
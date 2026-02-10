// About48.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import GlareHover from '@/components/ui/glare-hover/GlareHover';
import ScrollReveal from '@/components/ui/scroll-reveal/ScrollReveal';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';
import Counter from '@/components/ui/counter/Counter';

interface About48Props {
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

export function About48({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About48Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50"
    >
      {/* Subtle Blue Glows */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-400/15 rounded-full blur-3xl" />

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
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>

        {/* Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-16 mb-16"
        >
          <div className="text-center">
            <Counter
              value={500}
              places={[100, 10, 1]}
              fontSize={56}
              padding={5}
              gap={5}
              textColor="#0f172a"
              fontWeight={900}
              digitPlaceHolders
            />
            <p className="text-slate-600 mt-2 font-semibold text-lg">
              Projects
            </p>
          </div>
          <div className="text-center">
            <Counter
              value={250}
              places={[100, 10, 1]}
              fontSize={56}
              padding={5}
              gap={5}
              textColor="#0f172a"
              fontWeight={900}
              digitPlaceHolders
            />
            <p className="text-slate-600 mt-2 font-semibold text-lg">Clients</p>
          </div>
          <div className="text-center">
            <Counter
              value={99}
              places={[10, 1]}
              fontSize={56}
              padding={5}
              gap={5}
              textColor="#0f172a"
              fontWeight={900}
              digitPlaceHolders
            />
            <p className="text-slate-600 mt-2 font-semibold text-lg">
              Satisfaction
            </p>
          </div>
        </motion.div>

        {/* Content with Scroll Reveal */}
        {content && (
          <div className="max-w-3xl mx-auto mb-12">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur
              baseRotation={3}
              blurStrength={4}
            >
              <GlareHover
                glareColor="#3b82f6"
                glareIntensity={0.3}
                className="p-8 rounded-3xl bg-white border border-slate-200"
              >
                <p className="text-slate-600 leading-relaxed text-lg text-center">
                  {content}
                </p>
              </GlareHover>
            </ScrollReveal>
          </div>
        )}

        {/* Glare Hover Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlareHover
                  glareColor="#3b82f6"
                  glareIntensity={0.4}
                  className="p-6 rounded-2xl bg-white border border-slate-200 h-full"
                >
                  {feature.icon && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden mb-4 bg-blue-50 border border-blue-100">
                      <OptimizedImage
                        src={feature.icon}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold mb-2 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </GlareHover>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
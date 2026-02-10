// About43.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Lanyard from '@/components/ui/lanyard/Lanyard';
import AnimatedContent from '@/components/ui/animated-content/AnimatedContent';
import GradientText from '@/components/ui/gradient-text/GradientText';
import SplitText from '@/components/ui/split-text/SplitText';

interface About43Props {
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

export function About43({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About43Props) {
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
            animationSpeed={7}
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
          {/* 3D Lanyard Physics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[600px] flex items-center justify-center bg-slate-900/5 rounded-3xl border border-slate-200"
          >
            <Lanyard position={[0, 0, 24]} gravity={[0, -40, 0]} />
          </motion.div>

          {/* Animated Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <AnimatedContent animation="fade-in" delay={300} duration={800}>
              {content && (
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  {content}
                </p>
              )}
            </AnimatedContent>

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <AnimatedContent
                    key={index}
                    animation="slide-up"
                    delay={400 + index * 100}
                    duration={600}
                  >
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all">
                      <div className="flex items-start gap-4">
                        {feature.icon && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-blue-50 border border-blue-100">
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
                    </div>
                  </AnimatedContent>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
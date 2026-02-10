// About34.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ScrollStack, { ScrollStackItem } from '@/components/ui/scroll-stack/ScrollStack';
import LaserFlow from '@/components/ui/laser-flow/LaserFlow';
import GradientText from '@/components/ui/gradient-text/GradientText';
import ClickSpark from '@/components/ui/click-spark/ClickSpark';

interface About34Props {
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

export function About34({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About34Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-50">
      {/* Laser Flow Cursor */}
      <LaserFlow
        laserColor="#3b82f6"
        laserWidth={2}
        particleCount={20}
        fadeSpeed={0.95}
        maxLength={100}
      />

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
            animationSpeed={6}
            showBorder={false}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            {title}
          </GradientText>
          {subtitle && (
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Scroll Stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <ScrollStack>
            <ScrollStackItem>
              <div className="p-12 rounded-3xl bg-white border border-slate-200">
                <h2 className="text-3xl font-bold mb-6 text-slate-900">
                  Introduction
                </h2>
                {content && (
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {content}
                  </p>
                )}
              </div>
            </ScrollStackItem>

            <ScrollStackItem>
              <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200">
                <h2 className="text-3xl font-bold mb-6 text-slate-900">
                  Our Vision
                </h2>
                {image && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                    <OptimizedImage
                      src={image}
                      alt="Vision"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-slate-600 leading-relaxed text-lg">
                  Creating innovative solutions for tomorrow's challenges.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem>
              <div className="p-12 rounded-3xl bg-white border border-slate-200">
                <h2 className="text-3xl font-bold mb-6 text-slate-900">
                  Our Approach
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {features.slice(0, 4).map((feature, index) => (
                    <ClickSpark
                      key={index}
                      sparkColor="#3b82f6"
                      sparkSize={8}
                      sparkRadius={12}
                      sparkCount={6}
                      duration={400}
                    >
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h3 className="font-bold mb-2 text-slate-900">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {feature.description}
                        </p>
                      </div>
                    </ClickSpark>
                  ))}
                </div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </motion.div>
      </div>
    </section>
  );
}
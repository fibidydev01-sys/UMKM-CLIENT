// About47.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Ribbons from '@/components/ui/ribbons/Ribbons';
import ElectricBorder from '@/components/ui/electric-border/ElectricBorder';
import GradientText from '@/components/ui/gradient-text/GradientText';
import ClickSpark from '@/components/ui/click-spark/ClickSpark';

interface About47Props {
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

export function About47({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About47Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-white">
      {/* Ribbons Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Ribbons
          baseThickness={30}
          colors={['#3b82f6']}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={true}
          enableShaderEffect={false}
        />
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30" />

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
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Main Content with Electric Border */}
        {content && image && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-12"
          >
            <ElectricBorder
              borderColor="#3b82f6"
              borderWidth={2}
              glowIntensity={0.5}
              animationSpeed={2}
              className="rounded-3xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8 p-8 bg-white">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <ClickSpark
                    sparkColor="#3b82f6"
                    sparkSize={10}
                    sparkRadius={15}
                    sparkCount={8}
                    duration={400}
                  >
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {content}
                    </p>
                  </ClickSpark>
                </div>
              </div>
            </ElectricBorder>
          </motion.div>
        )}

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ElectricBorder
                  borderColor="#3b82f6"
                  borderWidth={1}
                  glowIntensity={0.3}
                  animationSpeed={1.5}
                  className="rounded-2xl h-full"
                >
                  <div className="p-6 bg-white text-center h-full">
                    {feature.icon && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-blue-100">
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
                  </div>
                </ElectricBorder>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
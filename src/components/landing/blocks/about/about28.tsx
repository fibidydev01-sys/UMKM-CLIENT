// About28.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ChromaGrid from '@/components/ui/chroma-grid/ChromaGrid';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import DecryptedText from '@/components/ui/decrypted-text/DecryptedText';
import ElasticSlider from '@/components/ui/elastic-slider/ElasticSlider';

interface About28Props {
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

export function About28({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About28Props) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-white">
      {/* Subtle Slate Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-100/30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Shiny Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <ShinyText
            text={title}
            speed={2}
            color="#0f172a"
            shineColor="#3b82f6"
            spread={120}
            direction="left"
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <div className="mt-6">
              <DecryptedText
                text={subtitle}
                animateOn="view"
                speed={60}
                className="text-slate-600 text-lg max-w-2xl mx-auto"
              />
            </div>
          )}
        </motion.div>

        {/* Content with Interactive Slider */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
              <p className="text-slate-600 leading-relaxed text-lg text-center mb-8">
                {content}
              </p>
              <ElasticSlider
                startingValue={0}
                defaultValue={sliderValue}
                maxValue={100}
                isStepped={false}
                stepSize={1}
                leftIcon={<span className="text-slate-400">🔉</span>}
                rightIcon={<span className="text-slate-900">🔊</span>}
              />
            </div>
          </motion.div>
        )}

        {/* Chroma Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-12 h-[500px]"
        >
          <ChromaGrid
            items={features.map((feature, index) => ({
              id: index,
              image: feature.icon || image,
              title: feature.title,
              description: feature.description,
            }))}
            columns={3}
            gap={16}
            chromaIntensity={0.3}
            glowColor="#3b82f6"
          />
        </motion.div>

        {/* Features List */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-lg hover:border-blue-300 transition-all"
              >
                {feature.icon && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-slate-100">
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
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
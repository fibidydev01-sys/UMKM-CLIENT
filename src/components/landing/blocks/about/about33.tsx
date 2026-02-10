// About33.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import PixelCard from '@/components/ui/pixel-card/PixelCard';
import ElectricBorder from '@/components/ui/electric-border/ElectricBorder';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import AnimatedContent from '@/components/ui/animated-content/AnimatedContent';

interface About33Props {
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

export function About33({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About33Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-100/40"
    >
      {/* Blue Glow Accents */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-slate-500/15 rounded-full blur-3xl" />

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
            speed={2.5}
            color="#0f172a"
            shineColor="#3b82f6"
            spread={140}
            direction="right"
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4">
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
            className="max-w-4xl mx-auto mb-12"
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
                <AnimatedContent
                  animation="fade-in"
                  delay={300}
                  duration={800}
                  className="flex flex-col justify-center"
                >
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {content}
                  </p>
                </AnimatedContent>
              </div>
            </ElectricBorder>
          </motion.div>
        )}

        {/* Pixel Cards Grid */}
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
                <PixelCard
                  image={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  pixelSize={8}
                  hoverPixelSize={4}
                  transitionSpeed={0.3}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
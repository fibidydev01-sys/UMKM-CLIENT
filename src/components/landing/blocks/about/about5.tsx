'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import GradientText from '@/components/ui/gradient-text/GradientText';

interface About5Props {
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

export function About5({ title, subtitle, image, features = [] }: About5Props) {
  return (
    <section id="about" className="relative py-16 md:py-24 min-h-[600px] flex items-center">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <OptimizedImage src={image} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-gray-900" />
      )}

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <GradientText
            colors={["#ffffff", "#a5b4fc", "#818cf8", "#a5b4fc", "#ffffff"]}
            animationSpeed={6}
            showBorder={false}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            {title}
          </GradientText>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/80 mt-4 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {features.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all"
              >
                {feature.icon && (
                  <div className="text-5xl md:text-6xl mb-4">
                    {feature.icon}
                  </div>
                )}
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
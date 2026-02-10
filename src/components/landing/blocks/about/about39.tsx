// About39.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import InfiniteMenu from '@/components/ui/infinite-menu/InfiniteMenu';
import GlassIcons from '@/components/ui/glass-icons/GlassIcons';
import GradientText from '@/components/ui/gradient-text/GradientText';
import ClickSpark from '@/components/ui/click-spark/ClickSpark';

interface About39Props {
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

export function About39({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About39Props) {
  const menuItems = features.map((feature) => ({
    image: feature.icon || 'https://picsum.photos/300/300?grayscale',
    link: '#',
    title: feature.title,
    description: feature.description,
  }));

  const glassIconItems = features.slice(0, 6).map((feature, index) => ({
    icon: <span className="text-2xl">🎯</span>,
    color: ['blue', 'purple', 'indigo', 'cyan', 'sky', 'violet'][index] as any,
    label: feature.title,
  }));

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-50">
      {/* Blue Gradient Accents */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl" />

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
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Infinite Menu */}
        {menuItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-[400px] mb-12 rounded-3xl overflow-hidden"
          >
            <InfiniteMenu items={menuItems} scale={1} />
          </motion.div>
        )}

        {/* Content with Click Spark */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12"
          >
            <ClickSpark
              sparkColor="#3b82f6"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <p className="text-slate-600 leading-relaxed text-lg text-center p-8 rounded-2xl bg-white border border-slate-200">
                {content}
              </p>
            </ClickSpark>
          </motion.div>
        )}

        {/* Glass Icons */}
        {glassIconItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-[300px] max-w-4xl mx-auto"
          >
            <GlassIcons
              items={glassIconItems}
              className="custom-glass-icons"
              colorful={true}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
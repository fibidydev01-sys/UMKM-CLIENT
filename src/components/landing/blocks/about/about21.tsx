// About21.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import FallingText from '@/components/ui/falling-text/FallingText';
import ReflectiveCard from '@/components/ui/reflective-card/ReflectiveCard';
import TextCursor from '@/components/ui/text-cursor/TextCursor';
import BlurText from '@/components/ui/blur-text/BlurText';

interface About21Props {
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

export function About21({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About21Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-pink-50/80 via-white to-pink-100/60"
    >
      {/* Text Cursor Effect */}
      <TextCursor
        text="✨"
        spacing={80}
        followMouseDirection
        randomFloat
        exitDuration={0.3}
        removalInterval={20}
        maxPoints={10}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Falling Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="h-32 mb-4">
            <FallingText
              text={title}
              highlightWords={title.split(' ').slice(0, 2)}
              highlightClass="text-primary font-black"
              trigger="view"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.56}
              fontSize="3rem"
              mouseConstraintStiffness={0.9}
            />
          </div>
          {subtitle && (
            <BlurText
              text={subtitle}
              delay={300}
              animateBy="words"
              direction="top"
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          </motion.div>
        )}

        {/* Reflective Cards Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ReflectiveCard
                  image={feature.icon || image}
                  title={feature.title}
                  description={feature.description}
                  glowColor="#ec4899"
                  reflectionOpacity={0.4}
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
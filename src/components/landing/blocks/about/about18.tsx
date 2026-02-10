// About18.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ScrollReveal from '@/components/ui/scroll-reveal/ScrollReveal';
import Masonry from '@/components/ui/masonry/Masonry';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';
import Shuffle from '@/components/ui/shuffle/Shuffle';

interface About18Props {
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

export function About18({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About18Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-background"
    >
      {/* Subtle Pink Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with True Focus */}
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            blurAmount={5}
            borderColor="#ec4899"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-4"
            >
              <Shuffle
                text={subtitle}
                shuffleDirection="right"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
              />
            </motion.div>
          )}
        </div>

        {/* Content with Scroll Reveal */}
        {content && (
          <div className="max-w-3xl mx-auto mb-12">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur
              baseRotation={3}
              blurStrength={4}
            >
              <p className="text-muted-foreground leading-relaxed text-lg text-center">
                {content}
              </p>
            </ScrollReveal>
          </div>
        )}

        {/* Masonry Grid */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <Masonry
              items={features.map((feature, index) => ({
                id: index,
                content: (
                  <div className="p-6 rounded-2xl bg-white border border-pink-100 hover:shadow-lg hover:border-primary/50 transition-all h-full">
                    {feature.icon && (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden mb-4">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ),
              }))}
              columns={3}
              gap={16}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
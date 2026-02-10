// About20.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ScrollFloat from '@/components/ui/scroll-float/ScrollFloat';
import MagicBento from '@/components/ui/magic-bento/MagicBento';
import GradientText from '@/components/ui/gradient-text/GradientText';
import ClickSpark from '@/components/ui/click-spark/ClickSpark';

interface About20Props {
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

export function About20({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About20Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-background"
    >
      {/* Subtle Pink Radial Gradients */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Scroll Float */}
        <div className="text-center mb-16">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          </ScrollFloat>

          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <GradientText
                colors={['#ec4899', '#f472b6', '#fbcfe8', '#ec4899']}
                animationSpeed={6}
                showBorder={false}
                className="text-lg max-w-2xl mx-auto"
              >
                {subtitle}
              </GradientText>
            </motion.div>
          )}
        </div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <ClickSpark
              sparkColor="#ec4899"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <p className="text-muted-foreground leading-relaxed text-lg p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100">
                {content}
              </p>
            </ClickSpark>
          </motion.div>
        )}

        {/* Main Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            </div>
          </motion.div>
        )}

        {/* Magic Bento Grid */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <MagicBento
              items={features.map((feature, index) => ({
                id: index,
                size:
                  index === 0 ? 'large' : index % 3 === 0 ? 'medium' : 'small',
                content: (
                  <div className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-white to-pink-50/50 rounded-2xl border border-pink-100 hover:shadow-xl hover:border-primary/50 transition-all">
                    {feature.icon && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-4 border-2 border-pink-100">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold mb-2 text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ),
              }))}
              gap={16}
              columns={3}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
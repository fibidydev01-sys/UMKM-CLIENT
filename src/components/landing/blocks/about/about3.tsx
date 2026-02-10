'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BlurText from '@/components/ui/blur-text/BlurText';

interface About3Props {
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

export function About3({ title, subtitle, content, features = [] }: About3Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <BlurText
                text={title}
                delay={150}
                animateBy="words"
                direction="top"
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center"
              />
            </div>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg md:text-xl text-muted-foreground mt-4 text-center"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {content && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify"
            >
              {content}
            </motion.p>
          )}
        </div>

        <div className="space-y-16 md:space-y-24">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                {feature.icon && (
                  <div className={`relative ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <AspectRatio ratio={4 / 3} className="rounded-2xl overflow-hidden shadow-2xl">
                      <OptimizedImage
                        src={feature.icon}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </AspectRatio>
                  </div>
                )}
                <div className={isEven ? 'md:order-2' : 'md:order-1'}>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
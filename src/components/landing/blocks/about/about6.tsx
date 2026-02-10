'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ShinyText from '@/components/ui/shiny-text/ShinyText';

interface About6Props {
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

export function About6({ title, subtitle, content, features = [] }: About6Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
          )}
          {content && (
            <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{content}</p>
          )}
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-12">
            {features.map((milestone, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                  <div className={`pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <ShinyText
                      text={milestone.title}
                      speed={3}
                      color="hsl(var(--primary))"
                      shineColor="hsl(var(--primary))"
                      spread={120}
                      direction="left"
                      className="text-2xl md:text-3xl font-bold"
                    />
                    <p className="text-muted-foreground mt-2 leading-relaxed">{milestone.description}</p>
                    {milestone.icon && (
                      <div className="relative aspect-video rounded-xl overflow-hidden mt-4 shadow-lg">
                        <OptimizedImage src={milestone.icon} alt={`${milestone.title} milestone`} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
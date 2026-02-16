'use client';

import { motion, type Variants } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface About2Props {
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

export function About2({ title, subtitle, image, features = [] }: About2Props) {
  // Animation untuk split text effect
  const words = title.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const wordVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          >
            {words.map((text, index) => (
              <motion.span
                key={index}
                variants={wordVariant}
                className="inline-block mr-[0.25em]"
              >
                {text}
              </motion.span>
            ))}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-center">
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            >
              <OptimizedImage src={image} alt={title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          )}

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
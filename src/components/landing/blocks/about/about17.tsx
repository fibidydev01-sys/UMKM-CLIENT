// About17.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import Carousel from '@/components/ui/carousel-custom/Carousel';
import DecryptedText from '@/components/ui/decrypted-text/DecryptedText';
import GradientText from '@/components/ui/gradient-text/GradientText';

interface About17Props {
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

export function About17({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About17Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-white via-pink-50/30 to-white"
    >
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
            color="#1a1a1a"
            shineColor="#ec4899"
            spread={120}
            direction="left"
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <DecryptedText
              text={subtitle}
              animateOn="view"
              speed={60}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        {/* Content with Gradient Text */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <GradientText
              colors={['#ec4899', '#f472b6', '#ec4899']}
              animationSpeed={8}
              showBorder={false}
              className="text-xl font-semibold mb-4"
            >
              {content}
            </GradientText>
          </motion.div>
        )}

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-[500px] mb-12"
        >
          <Carousel
            baseWidth={300}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </motion.div>

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-200 text-center hover:shadow-xl hover:border-primary/50 transition-all"
              >
                {feature.icon && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-pink-100">
                    <OptimizedImage
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-bold mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
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
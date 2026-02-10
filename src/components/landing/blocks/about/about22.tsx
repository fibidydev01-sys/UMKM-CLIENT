// About22.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ASCIIText from '@/components/ui/ascii-text/ASCIIText';
import TiltedCard from '@/components/ui/tilted-card/TiltedCard';
import SplitText from '@/components/ui/split-text/SplitText';
import Magnet from '@/components/ui/magnet/Magnet';

interface About22Props {
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

export function About22({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About22Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-background"
    >
      {/* Subtle Pink Radial Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-pink-100/40 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with ASCII Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="mb-6">
            <ASCIIText
              text={title}
              font="ANSI Shadow"
              colored
              gradient={['#ec4899', '#f472b6']}
              animateOn="view"
              speed={30}
            />
          </div>
          {subtitle && (
            <SplitText
              text={subtitle}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              delay={50}
              duration={1}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
            />
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Tilted Card */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Magnet padding={50} magnetStrength={30}>
                <TiltedCard
                  image={image}
                  title={title}
                  description={content}
                  tiltIntensity={15}
                  glowColor="#ec4899"
                  shadowIntensity={0.3}
                />
              </Magnet>
            </motion.div>
          )}

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white border border-pink-100 hover:shadow-xl hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {feature.icon && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-pink-200">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-2 text-lg">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
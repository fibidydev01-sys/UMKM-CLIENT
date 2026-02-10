// About19.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import TextType from '@/components/ui/text-type/TextType';
import CircularGallery from '@/components/ui/circular-gallery/CircularGallery';
import FuzzyText from '@/components/ui/fuzzy-text/FuzzyText';
import CircularText from '@/components/ui/circular-text/CircularText';

interface About19Props {
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

export function About19({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About19Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-tr from-pink-50/50 via-white to-pink-100/30"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Fuzzy Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          {/* Circular Text Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-20 pointer-events-none">
            <CircularText
              text="✦ ABOUT US ✦ OUR STORY ✦ "
              onHover="speedUp"
              spinDuration={20}
            />
          </div>

          <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
            <h2 className="text-4xl md:text-5xl font-black mb-4 relative z-10">
              {title}
            </h2>
          </FuzzyText>

          {subtitle && (
            <div className="mt-6">
              <TextType
                texts={[subtitle]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                deletingSpeed={50}
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
              />
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Circular Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px]"
          >
            <CircularGallery
              images={[
                image || 'https://picsum.photos/600/600?random=1',
                'https://picsum.photos/600/600?random=2',
                'https://picsum.photos/600/600?random=3',
                'https://picsum.photos/600/600?random=4',
              ]}
              radius={200}
              itemSize={120}
              autoRotate
              rotationSpeed={0.5}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4 pt-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 hover:shadow-md transition-all"
                  >
                    {feature.icon && (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-pink-200">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
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
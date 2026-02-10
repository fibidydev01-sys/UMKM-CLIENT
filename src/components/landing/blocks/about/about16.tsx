// About16.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import SplitText from '@/components/ui/split-text/SplitText';
import BlurText from '@/components/ui/blur-text/BlurText';
import AnimatedList from '@/components/ui/animated-list/AnimatedList';
import Magnet from '@/components/ui/magnet/Magnet';

interface About16Props {
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

export function About16({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About16Props) {
  const listItems = features.map((f) => `${f.title}: ${f.description}`);

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100/50"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Split Text */}
        <div className="text-center mb-16">
          <SplitText
            text={title}
            className="text-4xl md:text-5xl font-black mb-4"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
          />
          {subtitle && (
            <BlurText
              text={subtitle}
              delay={200}
              animateBy="words"
              direction="top"
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            />
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image with Magnet Effect */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Magnet padding={50} magnetStrength={50}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
              </Magnet>
            </motion.div>
          )}

          {/* Animated List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {listItems.length > 0 && (
              <div className="h-[400px] rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-200 p-4">
                <AnimatedList
                  items={listItems}
                  onItemSelect={(item, index) => console.log(item, index)}
                  showGradients
                  enableArrowNavigation
                  displayScrollbar
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
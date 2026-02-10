// About29.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import FlyingPosters from '@/components/ui/flying-posters/FlyingPosters';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';
import Shuffle from '@/components/ui/shuffle/Shuffle';
import ClickSpark from '@/components/ui/click-spark/ClickSpark';

interface About29Props {
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

export function About29({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About29Props) {
  const posters = [
    {
      image: image || 'https://picsum.photos/400/600?random=1',
      title: 'Project 1',
    },
    { image: 'https://picsum.photos/400/600?random=2', title: 'Project 2' },
    { image: 'https://picsum.photos/400/600?random=3', title: 'Project 3' },
    { image: 'https://picsum.photos/400/600?random=4', title: 'Project 4' },
  ];

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-tr from-slate-100 via-blue-50/30 to-slate-50"
    >
      {/* Blue-Gray Radial Accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-slate-400/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with True Focus */}
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            blurAmount={5}
            borderColor="#3b82f6"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <Shuffle
                text={subtitle}
                shuffleDirection="right"
                duration={0.35}
                ease="power3.out"
                stagger={0.03}
                triggerOnce={true}
                className="text-slate-600 text-lg max-w-2xl mx-auto"
              />
            </motion.div>
          )}
        </div>

        {/* Flying Posters */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-[600px] mb-12"
        >
          <FlyingPosters
            posters={posters}
            autoPlay
            playSpeed={1}
            perspective={1200}
            rotationIntensity={15}
          />
        </motion.div>

        {/* Content with Click Spark */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12"
          >
            <ClickSpark
              sparkColor="#3b82f6"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <p className="text-slate-600 leading-relaxed text-lg text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200">
                {content}
              </p>
            </ClickSpark>
          </motion.div>
        )}

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all"
              >
                {feature.icon && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden mb-4">
                    <OptimizedImage
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-bold mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
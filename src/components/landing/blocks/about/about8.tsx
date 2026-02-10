'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import RotatingText from '@/components/ui/rotating-text/RotatingText';

interface About8Props {
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

export function About8({ title, subtitle, content, features = [] }: About8Props) {
  const [activeTab, setActiveTab] = useState(0);

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground inline-flex items-center gap-3 flex-wrap justify-center">
            {title}{' '}
            {features.length > 0 && (
              <RotatingText
                texts={features.map((f) => f.title)}
                mainClassName="px-3 py-1 bg-primary text-primary-foreground rounded-lg"
                staggerFrom="last"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.025}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={3000}
              />
            )}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {content && (
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8">{content}</p>
        )}

        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {features.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === i
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6 p-8 rounded-2xl bg-muted/50"
              >
                {features[activeTab]?.icon && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
                    <OptimizedImage
                      src={features[activeTab].icon}
                      alt={features[activeTab].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {features[activeTab]?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
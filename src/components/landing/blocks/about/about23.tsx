// About23.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import CurvedLoop from '@/components/ui/curved-loop/CurvedLoop';
import SpotlightCard from '@/components/ui/spotlight-card/SpotlightCard';
import DecryptedText from '@/components/ui/decrypted-text/DecryptedText';
import ShinyText from '@/components/ui/shiny-text/ShinyText';

interface About23Props {
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

export function About23({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About23Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Pink accent glows */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />

      {/* Curved Loop Background */}
      <div className="absolute inset-0 opacity-10">
        <CurvedLoop
          marqueeText="✦ ABOUT US ✦ OUR STORY ✦ "
          speed={2}
          curveAmount={400}
          direction="right"
          interactive={false}
        />
      </div>

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
            speed={3}
            color="#ffffff"
            shineColor="#ec4899"
            spread={150}
            direction="right"
            className="text-4xl md:text-5xl font-black mb-4 text-white"
          />
          {subtitle && (
            <div className="mt-6">
              <DecryptedText
                text={subtitle}
                animateOn="view"
                speed={60}
                className="text-pink-200 text-lg max-w-2xl mx-auto"
              />
            </div>
          )}
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-slate-300 leading-relaxed text-lg">{content}</p>
          </motion.div>
        )}

        {/* Spotlight Cards Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <SpotlightCard
                  image={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  spotlightColor="#ec4899"
                  spotlightSize={200}
                  className="h-full bg-slate-800/50 border-slate-700"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
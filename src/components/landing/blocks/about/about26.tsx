// About26.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ScrollReveal from '@/components/ui/scroll-reveal/ScrollReveal';
import ProfileCard from '@/components/ui/profile-card/ProfileCard';
import BlurText from '@/components/ui/blur-text/BlurText';
import Counter from '@/components/ui/counter/Counter';

interface About26Props {
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

export function About26({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About26Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-50">
      {/* Subtle Blue-Gray Radial Glows */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-slate-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur
            baseRotation={3}
            blurStrength={4}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
              {title}
            </h2>
          </ScrollReveal>
          {subtitle && (
            <BlurText
              text={subtitle}
              delay={200}
              animateBy="words"
              direction="top"
              className="text-slate-600 text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-12 mb-16"
        >
          <div className="text-center">
            <Counter
              value={150}
              places={[100, 10, 1]}
              fontSize={48}
              padding={5}
              gap={5}
              textColor="#0f172a"
              fontWeight={900}
              digitPlaceHolders
            />
            <p className="text-slate-600 mt-2 font-semibold">Projects</p>
          </div>
          <div className="text-center">
            <Counter
              value={98}
              places={[10, 1]}
              fontSize={48}
              padding={5}
              gap={5}
              textColor="#0f172a"
              fontWeight={900}
              digitPlaceHolders
            />
            <p className="text-slate-600 mt-2 font-semibold">Clients</p>
          </div>
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-slate-600 leading-relaxed text-lg">{content}</p>
          </motion.div>
        )}

        {/* Profile Cards Grid */}
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
                <ProfileCard
                  image={feature.icon || image}
                  name={feature.title}
                  role={feature.description}
                  borderColor="#3b82f6"
                  backgroundColor="#ffffff"
                  className="h-full hover:shadow-xl transition-shadow"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
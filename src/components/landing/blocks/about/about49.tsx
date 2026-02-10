// About49.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import MetaBalls from '@/components/ui/meta-balls/MetaBalls';
import StarBorder from '@/components/ui/star-border/StarBorder';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import FuzzyText from '@/components/ui/fuzzy-text/FuzzyText';

interface About49Props {
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

export function About49({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About49Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-slate-950 min-h-screen"
    >
      {/* Meta Balls Background */}
      <div className="absolute inset-0 opacity-20">
        <MetaBalls
          color="#3b82f6"
          cursorBallColor="#60a5fa"
          cursorBallSize={2}
          ballCount={15}
          animationSize={30}
          enableMouseInteraction
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1}
          speed={0.3}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Fuzzy Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              {title}
            </h2>
          </FuzzyText>
          {subtitle && (
            <ShinyText
              text={subtitle}
              speed={3}
              color="#cbd5e1"
              shineColor="#3b82f6"
              spread={150}
              className="text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        {/* Main Content with Star Border */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <StarBorder
              as="div"
              color="primary"
              speed="5s"
              className="p-8 rounded-3xl bg-slate-900/80 backdrop-blur-sm"
            >
              <p className="text-slate-300 leading-relaxed text-lg text-center">
                {content}
              </p>
            </StarBorder>
          </motion.div>
        )}

        {/* Main Image with Star Border */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <StarBorder as="div" color="primary" speed="5s">
              <div className="relative aspect-video rounded-3xl overflow-hidden">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>
            </StarBorder>
          </motion.div>
        )}

        {/* Features with Star Border */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <StarBorder
                  as="div"
                  color="primary"
                  speed="4s"
                  className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-sm h-full"
                >
                  {feature.icon && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden mb-4 border border-blue-500/30">
                      <OptimizedImage
                        src={feature.icon}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold mb-2 text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {feature.description}
                  </p>
                </StarBorder>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
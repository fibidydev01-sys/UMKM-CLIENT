// About40.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import CardNav from '@/components/ui/card-nav/CardNav';
import Cubes from '@/components/ui/cubes/Cubes';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';
import Shuffle from '@/components/ui/shuffle/Shuffle';

interface About40Props {
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

export function About40({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About40Props) {
  const navItems = features.slice(0, 3).map((feature, index) => ({
    label: feature.title,
    bgColor: ['#0D1B2A', '#1B263B', '#415A77'][index] || '#0D1B2A',
    textColor: '#fff',
    links: [
      { label: 'Learn More', ariaLabel: `Learn more about ${feature.title}` },
      { label: 'Get Started', ariaLabel: `Get started with ${feature.title}` },
    ],
  }));

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-900">
      {/* Cubes Background */}
      <div className="absolute inset-0 opacity-30">
        <Cubes
          gridSize={8}
          maxAngle={45}
          radius={3}
          borderStyle="1px solid #3b82f6"
          faceColor="#1e293b"
          rippleColor="#3b82f6"
          rippleSpeed={1.5}
          autoAnimate
          rippleOnClick
        />
      </div>

      {/* Card Navigation */}
      {navItems.length > 0 && (
        <div className="fixed top-8 left-8 z-50">
          <CardNav
            logo="/logo.svg"
            logoAlt="Company Logo"
            items={navItems}
            baseColor="#fff"
            menuColor="#000"
            buttonBgColor="#3b82f6"
            buttonTextColor="#fff"
            ease="power3.out"
            theme="dark"
          />
        </div>
      )}

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
                className="text-slate-300 text-lg max-w-2xl mx-auto"
              />
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-blue-500/30">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-slate-300 leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {feature.icon && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-blue-500/30">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-1 text-slate-100">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">
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
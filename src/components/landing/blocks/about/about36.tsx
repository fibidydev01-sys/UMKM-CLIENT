// About36.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import MagnetLines from '@/components/ui/magnet-lines/MagnetLines';
import BubbleMenu from '@/components/ui/bubble-menu/BubbleMenu';
import BlurText from '@/components/ui/blur-text/BlurText';
import GradualBlur from '@/components/ui/gradual-blur/GradualBlur';

interface About36Props {
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

export function About36({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About36Props) {
  const menuItems = features.slice(0, 5).map((feature, index) => ({
    label: feature.title,
    href: `#${feature.title.toLowerCase().replace(/\s+/g, '-')}`,
    ariaLabel: feature.title,
    rotation: index % 2 === 0 ? -8 : 8,
    hoverStyles: {
      bgColor: '#3b82f6',
      textColor: '#ffffff',
    },
  }));

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-50"
    >
      {/* Magnet Lines Background */}
      <div className="absolute inset-0 opacity-20">
        <MagnetLines
          lineColor="#3b82f6"
          lineWidth={2}
          magnetStrength={100}
          lineCount={15}
          connectionDistance={150}
        />
      </div>

      {/* Bubble Menu */}
      {menuItems.length > 0 && (
        <div className="fixed top-8 right-8 z-50">
          <BubbleMenu
            logo={<span className="font-bold text-slate-900">A</span>}
            items={menuItems}
            menuAriaLabel="Toggle navigation"
            menuBg="#ffffff"
            menuContentColor="#0f172a"
            useFixedPosition={true}
            animationEase="back.out(1.5)"
            animationDuration={0.5}
            staggerDelay={0.12}
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Blur Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
            {title}
          </h2>
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

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image with Gradual Blur */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-3xl overflow-hidden"
            >
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <GradualBlur
                target="self"
                position="bottom"
                height="7rem"
                strength={2}
                divCount={5}
                curve="bezier"
                exponential
                opacity={1}
              />
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
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {feature.icon && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-blue-50 border border-blue-100">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-1 text-slate-900">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600">
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
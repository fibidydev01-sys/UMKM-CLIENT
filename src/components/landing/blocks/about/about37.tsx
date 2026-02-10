// About37.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import GooeyNav from '@/components/ui/gooey-nav/GooeyNav';
import StickerPeel from '@/components/ui/sticker-peel/StickerPeel';
import ScrollFloat from '@/components/ui/scroll-float/ScrollFloat';
import DecryptedText from '@/components/ui/decrypted-text/DecryptedText';

interface About37Props {
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

export function About37({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About37Props) {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-white">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-blue-50/20" />

      {/* Gooey Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <GooeyNav
          items={navItems}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Scroll Float */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
              {title}
            </h2>
          </ScrollFloat>
          {subtitle && (
            <DecryptedText
              text={subtitle}
              animateOn="view"
              speed={60}
              className="text-slate-600 text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        {/* Sticker Peel Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative h-[400px] rounded-3xl bg-slate-50 border border-slate-200 p-8">
            {content && (
              <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
                {content}
              </p>
            )}

            {/* Sticker Peel Effect */}
            {image && (
              <div className="absolute bottom-8 right-8">
                <StickerPeel
                  imageSrc={image}
                  width={150}
                  rotate={-5}
                  peelBackHoverPct={30}
                  peelBackActivePct={40}
                  shadowIntensity={0.5}
                  lightingIntensity={0.1}
                  initialPosition={{ x: 0, y: 0 }}
                  peelDirection={45}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-lg hover:border-blue-300 transition-all"
              >
                {feature.icon && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-blue-100">
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
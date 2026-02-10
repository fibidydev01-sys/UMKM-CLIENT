// About42.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import StaggeredMenu from '@/components/ui/staggered-menu/StaggeredMenu';
import PixelTrail from '@/components/ui/pixel-trail/PixelTrail';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import DecryptedText from '@/components/ui/decrypted-text/DecryptedText';

interface About42Props {
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

export function About42({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About42Props) {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' },
  ];

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen"
    >
      {/* Pixel Trail Cursor */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <PixelTrail
          gridSize={50}
          trailSize={0.1}
          maxAge={250}
          interpolate={5}
          color="#3b82f6"
          gooeyFilter={{ id: 'custom-goo-filter', strength: 2 }}
          gooeyEnabled
          gooStrength={2}
        />
      </div>

      {/* Staggered Menu */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#3b82f6', '#60a5fa']}
        logoUrl="/logo.svg"
        accentColor="#3b82f6"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />

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
            shineColor="#3b82f6"
            spread={150}
            direction="right"
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <div className="mt-6">
              <DecryptedText
                text={subtitle}
                animateOn="view"
                speed={60}
                className="text-slate-300 text-lg max-w-2xl mx-auto"
              />
            </div>
          )}
        </motion.div>

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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
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
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 transition-all"
                  >
                    <h3 className="font-bold mb-2 text-slate-100">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {feature.description}
                    </p>
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
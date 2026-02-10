// About41.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import PillNav from '@/components/ui/pill-nav/PillNav';
import Folder from '@/components/ui/folder/Folder';
import ASCIIText from '@/components/ui/ascii-text/ASCIIText';
import BlurText from '@/components/ui/blur-text/BlurText';

interface About41Props {
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

export function About41({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About41Props) {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-white">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-blue-50/20" />

      {/* Pill Navigation */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <PillNav
          logo="/logo.svg"
          logoAlt="Logo"
          items={navItems}
          activeHref="/about"
          baseColor="#0f172a"
          pillColor="#3b82f6"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#0f172a"
          theme="light"
          initialLoadAnimation={true}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-24">
        {/* Header with ASCII Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="mb-6">
            <ASCIIText
              text={title}
              font="Standard"
              colored
              gradient={['#0f172a', '#3b82f6']}
              animateOn="view"
              speed={30}
            />
          </div>
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
          {/* Folder Animation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[500px] flex items-center justify-center"
          >
            <Folder color="#3b82f6" size={2} className="custom-folder" />
          </motion.div>

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
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all"
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
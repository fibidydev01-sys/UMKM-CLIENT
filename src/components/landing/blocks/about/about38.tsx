// About38.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import FlowingMenu from '@/components/ui/flowing-menu/FlowingMenu';
import ModelViewer from '@/components/ui/model-viewer/ModelViewer';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import FuzzyText from '@/components/ui/fuzzy-text/FuzzyText';

interface About38Props {
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

export function About38({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About38Props) {
  const menuItems = features.slice(0, 4).map((feature) => ({
    link: '#',
    text: feature.title,
    image: feature.icon || 'https://picsum.photos/600/400?random=1',
  }));

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50"
    >
      {/* Flowing Menu */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <FlowingMenu
          items={menuItems}
          speed={15}
          textColor="#ffffff"
          bgColor="#0f172a"
          marqueeBgColor="#3b82f6"
          marqueeTextColor="#ffffff"
          borderColor="#3b82f6"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-24">
        {/* Header with Fuzzy & Shiny Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
              {title}
            </h2>
          </FuzzyText>
          {subtitle && (
            <ShinyText
              text={subtitle}
              speed={2}
              color="#64748b"
              shineColor="#3b82f6"
              spread={120}
              className="text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* 3D Model Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden bg-slate-900/5 border border-slate-200"
          >
            <ModelViewer
              url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
              width="100%"
              height={500}
              modelXOffset={0.5}
              modelYOffset={0}
              enableMouseParallax
              enableHoverRotation
              environmentPreset="sunset"
              fadeIn={true}
              autoRotate={true}
              autoRotateSpeed={0.35}
              showScreenshotButton={false}
            />
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold mb-2 text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">
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
// About45.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ImageTrail from '@/components/ui/image-trail/ImageTrail';
import BlobCursor from '@/components/ui/blob-cursor/BlobCursor';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import FuzzyText from '@/components/ui/fuzzy-text/FuzzyText';

interface About45Props {
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

export function About45({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About45Props) {
  const trailImages = [
    image || 'https://picsum.photos/id/287/300/300',
    'https://picsum.photos/id/1001/300/300',
    'https://picsum.photos/id/1025/300/300',
    'https://picsum.photos/id/1026/300/300',
    'https://picsum.photos/id/1027/300/300',
    'https://picsum.photos/id/1028/300/300',
  ];

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50/30"
    >
      {/* Blob Cursor */}
      <BlobCursor
        blobType="circle"
        fillColor="#3b82f6"
        trailCount={3}
        sizes={[60, 125, 75]}
        innerSizes={[20, 35, 25]}
        innerColor="rgba(255,255,255,0.8)"
        opacities={[0.6, 0.6, 0.6]}
        shadowColor="rgba(0,0,0,0.75)"
        shadowBlur={5}
        shadowOffsetX={10}
        shadowOffsetY={10}
        filterStdDeviation={30}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={100}
      />

      <div className="container mx-auto px-4 relative z-10">
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

        {/* Image Trail */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-[500px] mb-12 rounded-3xl overflow-hidden bg-slate-900/5 border border-slate-200"
        >
          <ImageTrail items={trailImages} variant="1" />
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
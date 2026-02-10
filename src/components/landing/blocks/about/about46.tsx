// About46.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import MetallicPaint from '@/components/ui/metallic-paint/MetallicPaint';
import Noise from '@/components/ui/noise/Noise';
import CircularText from '@/components/ui/circular-text/CircularText';
import Magnet from '@/components/ui/magnet/Magnet';

interface About46Props {
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

export function About46({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About46Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-900">
      {/* Noise Background */}
      <div className="absolute inset-0 opacity-30">
        <Noise
          patternSize={250}
          patternScaleX={2}
          patternScaleY={2}
          patternRefreshInterval={2}
          patternAlpha={15}
        />
      </div>

      {/* Circular Text Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none">
        <CircularText
          text="✦ METALLIC ✦ DESIGN ✦ INNOVATION ✦ "
          onHover="speedUp"
          spinDuration={25}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Metallic Paint */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="h-[200px] mb-8">
            <MetallicPaint
              imageSrc="/logo.svg"
              seed={42}
              scale={4}
              patternSharpness={1}
              noiseScale={0.5}
              speed={0.3}
              liquid={0.75}
              mouseAnimation={true}
              brightness={2}
              contrast={0.5}
              refraction={0.01}
              blur={0.015}
              chromaticSpread={2}
              fresnel={1}
              angle={0}
              waveAmplitude={1}
              distortion={1}
              contour={0.2}
              lightColor="#ffffff"
              darkColor="#000000"
              tintColor="#3b82f6"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
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
              <Magnet padding={50} magnetStrength={50}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-blue-500/30">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </div>
              </Magnet>
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
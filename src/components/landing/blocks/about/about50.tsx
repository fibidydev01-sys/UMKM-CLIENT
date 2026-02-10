// About50.tsx - THE ULTIMATE FINALE!
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import GradientText from '@/components/ui/gradient-text/GradientText';
import SplitText from '@/components/ui/split-text/SplitText';
import MagicBento from '@/components/ui/magic-bento/MagicBento';
import ElectricBorder from '@/components/ui/electric-border/ElectricBorder';
import GlareHover from '@/components/ui/glare-hover/GlareHover';
import Counter from '@/components/ui/counter/Counter';
import ClickSpark from '@/components/ui/click-spark/ClickSpark';
import Magnet from '@/components/ui/magnet/Magnet';

interface About50Props {
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

export function About50({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About50Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Multi-Layer Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent" />

      {/* Animated Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Epic Header with Gradient Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <GradientText
            colors={['#ffffff', '#3b82f6', '#60a5fa', '#ffffff']}
            animationSpeed={6}
            showBorder={false}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {title}
          </GradientText>
          {subtitle && (
            <SplitText
              text={subtitle}
              className="text-slate-300 text-xl max-w-3xl mx-auto"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            />
          )}
        </motion.div>

        {/* Epic Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-12 mb-16"
        >
          <ElectricBorder
            borderColor="#3b82f6"
            borderWidth={2}
            glowIntensity={0.8}
            animationSpeed={2}
            className="rounded-2xl"
          >
            <div className="p-8 bg-slate-800/80 backdrop-blur-sm text-center">
              <Counter
                value={1000}
                places={[1000, 100, 10, 1]}
                fontSize={48}
                padding={5}
                gap={5}
                textColor="#ffffff"
                fontWeight={900}
                digitPlaceHolders
              />
              <p className="text-slate-300 mt-2 font-semibold">Projects</p>
            </div>
          </ElectricBorder>

          <ElectricBorder
            borderColor="#60a5fa"
            borderWidth={2}
            glowIntensity={0.8}
            animationSpeed={2}
            className="rounded-2xl"
          >
            <div className="p-8 bg-slate-800/80 backdrop-blur-sm text-center">
              <Counter
                value={500}
                places={[100, 10, 1]}
                fontSize={48}
                padding={5}
                gap={5}
                textColor="#ffffff"
                fontWeight={900}
                digitPlaceHolders
              />
              <p className="text-slate-300 mt-2 font-semibold">Clients</p>
            </div>
          </ElectricBorder>
        </motion.div>

        {/* Main Content with Electric Border & Glare */}
        {content && image && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto mb-16"
          >
            <ElectricBorder
              borderColor="#3b82f6"
              borderWidth={3}
              glowIntensity={0.7}
              animationSpeed={2}
              className="rounded-3xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8 p-8 bg-slate-800/80 backdrop-blur-sm">
                <Magnet padding={50} magnetStrength={60}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-blue-500/30">
                    <OptimizedImage
                      src={image}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Magnet>
                <div className="flex flex-col justify-center">
                  <ClickSpark
                    sparkColor="#3b82f6"
                    sparkSize={12}
                    sparkRadius={20}
                    sparkCount={10}
                    duration={400}
                  >
                    <GlareHover
                      glareColor="#3b82f6"
                      glareIntensity={0.4}
                      className="p-6 rounded-2xl bg-slate-900/50"
                    >
                      <p className="text-slate-200 leading-relaxed text-lg">
                        {content}
                      </p>
                    </GlareHover>
                  </ClickSpark>
                </div>
              </div>
            </ElectricBorder>
          </motion.div>
        )}

        {/* Magic Bento Grid - The Ultimate Showcase */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <MagicBento
              items={features.map((feature, index) => ({
                id: index,
                size:
                  index === 0 ? 'large' : index % 3 === 0 ? 'medium' : 'small',
                content: (
                  <ElectricBorder
                    borderColor="#3b82f6"
                    borderWidth={2}
                    glowIntensity={0.5}
                    animationSpeed={1.5}
                    className="rounded-2xl h-full"
                  >
                    <GlareHover
                      glareColor="#3b82f6"
                      glareIntensity={0.3}
                      className="p-6 h-full flex flex-col justify-between bg-slate-800/80 backdrop-blur-sm"
                    >
                      {feature.icon && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-4 border-2 border-blue-500/30">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-2 text-xl text-slate-100">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </GlareHover>
                  </ElectricBorder>
                ),
              }))}
              gap={16}
              columns={3}
            />
          </motion.div>
        )}

        {/* Epic Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 text-sm uppercase tracking-wider">
            🎉 Component #50 - The Ultimate Finale! 🎉
          </p>
        </motion.div>
      </div>
    </section>
  );
}
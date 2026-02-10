// About25.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import BounceCards from '@/components/ui/bounce-cards/BounceCards';
import Stepper, { Step } from '@/components/ui/stepper/Stepper';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';
import Shuffle from '@/components/ui/shuffle/Shuffle';

interface About25Props {
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

export function About25({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About25Props) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-background"
    >
      {/* Soft Pink Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-transparent to-pink-100/30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with True Focus */}
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            blurAmount={5}
            borderColor="#ec4899"
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
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
              />
            </motion.div>
          )}
        </div>

        {/* Content with Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-xl">
            <Stepper
              initialStep={1}
              onStepChange={(step) => setCurrentStep(step)}
              onFinalStepCompleted={() => console.log('All steps completed!')}
              backButtonText="Previous"
              nextButtonText="Next"
            >
              <Step>
                <div className="text-center py-8">
                  <h2 className="text-3xl font-bold mb-4">Welcome! 👋</h2>
                  {content && (
                    <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
                      {content}
                    </p>
                  )}
                </div>
              </Step>

              <Step>
                <div className="py-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Our Features
                  </h2>
                  {image && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-pink-100">
                      <OptimizedImage
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Step>

              <Step>
                <div className="py-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Why Choose Us?
                  </h2>
                  <div className="grid gap-4">
                    {features.slice(0, 3).map((feature, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-white border border-pink-100"
                      >
                        <div className="flex items-center gap-4">
                          {feature.icon && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <OptimizedImage
                                src={feature.icon}
                                alt={feature.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Step>

              <Step>
                <div className="text-center py-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Start! 🚀
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Let's work together to make something amazing.
                  </p>
                </div>
              </Step>
            </Stepper>
          </div>
        </motion.div>

        {/* Bounce Cards Grid */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <BounceCards
              items={features.map((feature, index) => ({
                id: index,
                image: feature.icon,
                title: feature.title,
                description: feature.description,
              }))}
              columns={3}
              gap={16}
              bounceIntensity={1.05}
              hoverScale={1.08}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
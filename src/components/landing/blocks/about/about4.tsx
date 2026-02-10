'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import DecryptedText from '@/components/ui/decrypted-text/DecryptedText';

interface About4Props {
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

export function About4({ title, content, image, features = [] }: About4Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1300px]">
        <div className="mb-12 md:mb-16">
          <DecryptedText
            text={title}
            speed={50}
            maxIterations={10}
            animateOn="view"
            revealDirection="start"
            sequential
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          />
        </div>

        <div className="space-y-8">
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full"
            >
              <AspectRatio ratio={21 / 9} className="rounded-2xl overflow-hidden shadow-2xl">
                <OptimizedImage src={image} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </AspectRatio>
            </motion.div>
          )}

          {content && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {content}
            </motion.p>
          )}

          {features.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border hover:bg-muted/50 transition-colors h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                          {feature.icon ? (
                            <span className="text-base">{feature.icon}</span>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 text-center">
                          <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">
                            {feature.title}
                          </h3>
                          {feature.description && (
                            <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface About1Props {
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

/**
 * About Block: about1
 * Design: GRID - Image left, Content right
 */
export function About1({ title, subtitle, content, image, features = [] }: About1Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Image */}
        {image && (
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {content && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {content}
            </p>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
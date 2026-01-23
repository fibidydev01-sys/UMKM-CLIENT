'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Quote } from 'lucide-react';

interface About7Props {
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
 * About Block: about7
 * Design: STORYTELLING - Narrative emotional layout
 */
export function About7({ title, subtitle, content, image, features = [] }: About7Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      {/* Storytelling Header */}
      <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          {title}
        </h2>
      </div>

      {/* Full Width Image with Overlay Quote */}
      {image && (
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12 md:mb-16">
          <OptimizedImage
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Quote Overlay */}
          {subtitle && (
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-8 md:px-12">
                <Quote className="h-10 w-10 text-white/40 mb-4" />
                <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content + Features */}
      <div className="max-w-5xl mx-auto">
        {content && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center mb-12">
            {content}
          </p>
        )}

        {/* Features - Horizontal scroll on mobile, grid on desktop */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 hover:border-primary/20 transition-colors"
              >
                {feature.icon && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden mb-4 shadow-md">
                    <OptimizedImage
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                {feature.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
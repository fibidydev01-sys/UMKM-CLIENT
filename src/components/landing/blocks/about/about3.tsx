'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { CheckCircle } from 'lucide-react';

interface About3Props {
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
 * About Block: about3
 * Design: CENTERED - Content focused, image below
 */
export function About3({ title, subtitle, content, image, features = [] }: About3Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Centered Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mt-4">{subtitle}</p>
          )}
        </div>

        {/* Content */}
        {content && (
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center mb-10">
            {content}
          </p>
        )}

        {/* Features - Horizontal Pills */}
        {features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-foreground"
              >
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{feature.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Image Below */}
        {image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
            <OptimizedImage
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
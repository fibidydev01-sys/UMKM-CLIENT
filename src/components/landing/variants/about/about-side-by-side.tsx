'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface AboutSideBySideProps {
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
 * About Variant: Side by Side
 *
 * Classic side-by-side layout with image and content
 * Clean and professional presentation
 */
export function AboutSideBySide({ title, subtitle, content, image, features = [] }: AboutSideBySideProps) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        {image && (
          <div className="order-2 md:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                unoptimized={image.startsWith('http')}
              />
            </div>
          </div>
        )}

        {/* Right: Content */}
        <div className="order-1 md:order-2 space-y-6">
          {content && (
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
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

'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AboutCenteredProps {
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
 * About Variant: Centered
 *
 * Centered layout with focus on content
 * Minimal and elegant design
 */
export function AboutCentered({ title, subtitle, content, image, features = [] }: AboutCenteredProps) {
  return (
    <section id="about" className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Centered Header */}
        <div className="text-center space-y-4 mb-12">
          {subtitle && (
            <p className="text-primary font-medium uppercase tracking-wider text-sm">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h2>

          {content && (
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              {content}
            </p>
          )}
        </div>

        {/* Centered Image */}
        {image && (
          <div className="relative aspect-video max-w-2xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
          </div>
        )}

        {/* Centered Features Grid */}
        {features.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                {feature.description && (
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

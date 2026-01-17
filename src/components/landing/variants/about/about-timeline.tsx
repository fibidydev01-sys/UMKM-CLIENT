'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

interface AboutTimelineProps {
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
 * About Variant: Timeline
 *
 * Vertical timeline layout showing journey/milestones
 * Great for showing company history or process steps
 */
export function AboutTimeline({ title, subtitle, content, image, features = [] }: AboutTimelineProps) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        {content && (
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            {content}
          </p>
        )}
      </div>

      {/* Timeline Image */}
      {image && (
        <div className="relative aspect-[21/9] max-w-4xl mx-auto mb-12 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized={image.startsWith('http')}
          />
        </div>
      )}

      {/* Vertical Timeline */}
      {features.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-14">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>

                  {/* Content Card */}
                  <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        {feature.description && (
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        )}
                      </div>
                      {/* Timeline Index */}
                      <div className="text-4xl font-bold text-primary/20">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

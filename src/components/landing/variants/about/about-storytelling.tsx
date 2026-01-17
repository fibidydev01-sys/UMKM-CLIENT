'use client';

import Image from 'next/image';
import { Quote } from 'lucide-react';

interface AboutStorytellingProps {
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
 * About Variant: Storytelling
 *
 * Narrative-focused layout with emotional connection
 * Story-driven content with emphasis on journey
 */
export function AboutStorytelling({ title, subtitle, content, image, features = [] }: AboutStorytellingProps) {
  return (
    <section id="about" className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Story Header */}
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>
        </div>

        {/* Hero Image */}
        {image && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
          </div>
        )}

        {/* Story Content */}
        {content && (
          <div className="mb-12">
            <div className="relative">
              {/* Quote Icon */}
              <Quote className="absolute -top-4 -left-4 h-16 w-16 text-primary/10" />

              <div className="prose prose-lg max-w-none pl-8">
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic">
                  "{content}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Story Chapters/Milestones */}
        {features.length > 0 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">Our Journey</h3>
              <div className="w-20 h-1 bg-primary mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
                >
                  {/* Chapter number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xl font-bold pt-2">{feature.title}</h4>
                    {feature.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>

                  {/* Decorative element */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-tl-full -z-10 group-hover:bg-primary/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closing line */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-muted-foreground italic">
            And the story continues...
          </p>
        </div>
      </div>
    </section>
  );
}

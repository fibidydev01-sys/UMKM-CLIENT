'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';

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

/**
 * About Block: about4
 * Design: TIMELINE - Vertical milestones
 */
export function About4({ title, subtitle, content, image, features = [] }: About4Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Image + Content */}
        <div className="space-y-6">
          {image && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}
          {content && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {content}
            </p>
          )}
        </div>

        {/* Right: Timeline Features */}
        {features.length > 0 && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>

                  {/* Content */}
                  <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
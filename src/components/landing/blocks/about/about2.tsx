'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';

interface About2Props {
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
 * About Block: about2
 * Design: SIDE BY SIDE + Feature Cards Gallery
 */
export function About2({ title, subtitle, content, image, features = [] }: About2Props) {
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
        {/* Left: Main Image */}
        {image && (
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">
            <OptimizedImage
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Right: Content + Features Gallery */}
        <div className="space-y-8">
          {content && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {content}
            </p>
          )}

          {/* Features as Image Cards */}
          {features.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-xl border bg-card p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  {/* Feature Image */}
                  {feature.icon && (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                      <OptimizedImage
                        src={feature.icon}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
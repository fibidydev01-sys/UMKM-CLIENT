'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';

interface About6Props {
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
 * About Block: about6
 * Design: MAGAZINE - Bold editorial style
 */
export function About6({ title, subtitle, content, image, features = [] }: About6Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      {/* Large Editorial Header */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl md:text-2xl text-muted-foreground mt-6 max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
        {/* Left: Large Image */}
        <div className="lg:col-span-3">
          {image && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Right: Content + Stacked Features */}
        <div className="lg:col-span-2 space-y-8">
          {content && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {content}
            </p>
          )}

          {/* Features - Stacked with dividers */}
          {features.length > 0 && (
            <div className="space-y-0 divide-y divide-border">
              {features.map((feature, index) => (
                <div key={index} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    {feature.icon && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
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
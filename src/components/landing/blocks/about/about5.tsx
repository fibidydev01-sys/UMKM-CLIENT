'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card, CardContent } from '@/components/ui/card';

interface About5Props {
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
 * About Block: about5
 * Design: CARDS - Bento-style feature grid
 */
export function About5({ title, subtitle, content, image, features = [] }: About5Props) {
  return (
    <section id="about" className="py-16 md:py-24">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
        {content && (
          <p className="text-base text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
            {content}
          </p>
        )}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Image Card - Spans 2 columns on lg */}
        {image && (
          <Card className="md:col-span-2 lg:col-span-2 overflow-hidden border-0 shadow-xl">
            <div className="relative aspect-[2/1] md:aspect-[16/9]">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/90 text-lg font-medium">{subtitle}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Feature Cards */}
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300"
          >
            <CardContent className="p-6">
              {/* Feature Icon/Image */}
              {feature.icon && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden mb-4 bg-primary/10">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
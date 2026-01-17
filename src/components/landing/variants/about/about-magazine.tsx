'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface AboutMagazineProps {
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
 * About Variant: Magazine
 *
 * Bold editorial magazine-style layout
 * Large typography, visual hierarchy, editorial feel
 */
export function AboutMagazine({ title, subtitle, content, image, features = [] }: AboutMagazineProps) {
  return (
    <section id="about" className="py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - Editorial Content */}
        <div className="space-y-8">
          {/* Magazine Header */}
          <div>
            {subtitle && (
              <Badge variant="outline" className="mb-4 uppercase tracking-wider">
                {subtitle}
              </Badge>
            )}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {title}
            </h2>
            {content && (
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-muted-foreground leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left">
                  {content}
                </p>
              </div>
            )}
          </div>

          {/* Features as editorial highlights */}
          {features.length > 0 && (
            <div className="space-y-6 pt-6 border-t">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-muted-foreground">{feature.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Visual */}
        <div className="space-y-6">
          {/* Main Image */}
          {image && (
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                unoptimized={image.startsWith('http')}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Additional features as sidebar */}
          {features.length > 3 && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h4 className="font-bold text-lg">More Highlights</h4>
              <div className="grid gap-3">
                {features.slice(3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-md">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      {feature.description && (
                        <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

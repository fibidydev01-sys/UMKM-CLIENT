'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface About1Props {
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

export function About1({ title, subtitle, content, image, features = [] }: About1Props) {
  return (
    <section id="about" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT — Image ── */}
          {image && (
            <div className="w-full">
              <div className="overflow-hidden border border-border rounded-2xl">
                <div className="aspect-[3/4] relative w-full">
                  <OptimizedImage src={image} alt={title} fill className="object-cover" />
                </div>
              </div>
            </div>
          )}

          {/* ── RIGHT — Text + Features ── */}
          <div className="flex flex-col justify-center">

            {/* Eyebrow */}
            <div className="mb-5 flex items-center gap-3 max-w-[260px]">
              <Separator className="flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground whitespace-nowrap font-medium">
                Tentang Kami
              </span>
              <Separator className="flex-1 bg-border" />
            </div>

            {/* Title */}
            <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-black leading-[1.05] tracking-tight text-foreground mb-4">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-md">
                {subtitle}
              </p>
            )}

            {/* Content */}
            {content && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
                {content}
              </p>
            )}

            {/* Features Grid */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <Card key={index} className="border border-border bg-card rounded-xl">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      {feature.icon && (
                        <span className="text-3xl mb-3">{feature.icon}</span>
                      )}
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      {feature.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
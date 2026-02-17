'use client';

import { Separator } from '@/components/ui/separator';
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

export function About5({ title, subtitle, content, features = [] }: About5Props) {
  return (
    <section id="about" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">

        {/* ── Header — center ── */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-3 max-w-[260px]">
            <Separator className="flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground whitespace-nowrap font-medium">
              Tentang Kami
            </span>
            <Separator className="flex-1 bg-border" />
          </div>

          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-black leading-[1.05] tracking-tight text-foreground mb-4 max-w-2xl">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}

          {content && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mt-3">
              {content}
            </p>
          )}
        </div>

        {/* ── Features Grid 4 col ── */}
        {features.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border bg-card rounded-xl">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  {feature.icon && (
                    <span className="text-3xl mb-3">{feature.icon}</span>
                  )}
                  <h3 className="text-sm font-semibold text-foreground mb-2">
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
    </section>
  );
}
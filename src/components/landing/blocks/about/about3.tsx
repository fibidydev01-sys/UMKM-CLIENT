'use client';

import { Separator } from '@/components/ui/separator';

interface About3Props {
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

export function About3({ title, subtitle, content, features = [] }: About3Props) {
  return (
    <section id="about" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">

        {/* ── Header Center full width ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-5 flex items-center gap-4 w-full max-w-xs sm:max-w-sm">
            <Separator className="flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap font-medium">
              Tentang Kami
            </span>
            <Separator className="flex-1 bg-border" />
          </div>

          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-black leading-[1.05] tracking-tight text-foreground max-w-2xl">
            {title}
          </h2>
        </div>

        {/* ── Split 50/50 — Deskripsi KIRI sejajar List KANAN ── */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* LEFT — Deskripsi justify, top-aligned */}
          <div className="pt-4">
            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed text-justify mb-4">
                {subtitle}
              </p>
            )}
            {content && (
              <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                {content}
              </p>
            )}
          </div>

          {/* RIGHT — Features List */}
          {features.length > 0 && (
            <div className="divide-y divide-border">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 py-4">
                  {feature.icon && (
                    <span className="text-sm text-muted-foreground shrink-0 w-10">{feature.icon}</span>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-0.5">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    )}
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
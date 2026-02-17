'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials1Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials1
 * Design: GRID CARDS - 3 column with hover effects
 * Typography: Matched to Hero1 (font-black, tracking-tight, uppercase eyebrow)
 */
export function Testimonials1({ items, title, subtitle }: Testimonials1Props) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 md:py-24">
      {/* Header — Hero1 style */}
      <div className="text-center mb-12 md:mb-16">

        {/* Eyebrow — same as Hero1 */}
        <div className="mb-5 flex items-center justify-center gap-3 max-w-[260px] mx-auto">
          <Separator className="flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground whitespace-nowrap font-medium">
            Testimoni
          </span>
          <Separator className="flex-1 bg-border" />
        </div>

        {/* Title — Hero1 font-black tracking-tight */}
        <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-black leading-[1.0] tracking-tight text-foreground max-w-2xl mx-auto">
          {title}
        </h2>

        {/* Subtitle — Hero1 text-sm muted */}
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mt-4">
            {subtitle}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}`;
          const { type: avatarType } = getImageSource(item.avatar);

          return (
            <Card
              key={key}
              className="
                w-full
                md:w-[calc(50%-12px)]
                lg:w-[calc(33.333%-16px)]
                flex flex-col
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
                border-border/50
              "
            >
              <CardContent className="p-6 flex flex-col flex-1">
                {/* Decorative mark — Hero1 eyebrow style */}
                <span className="text-[10px] uppercase tracking-[0.28em] text-primary/50 font-medium mb-4 block">
                  ★ Ulasan
                </span>

                {/* Content */}
                <p className="text-sm text-foreground leading-relaxed mb-6 flex-1">
                  &quot;{item.content}&quot;
                </p>

                {/* Author — pinned at bottom */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50 shrink-0">
                  <Avatar className="h-10 w-10 ring-2 ring-background shadow">
                    {avatarType !== 'none' ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={40}
                        height={40}
                        crop="thumb"
                        gravity="face"
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    {/* Name — Hero1 font-black style */}
                    <p className="font-black text-[13px] tracking-tight text-foreground leading-none">
                      {item.name}
                    </p>
                    {item.role && (
                      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-1 font-medium">
                        {item.role}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
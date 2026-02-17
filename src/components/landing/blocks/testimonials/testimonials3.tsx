'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials3Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials3
 * Design: QUOTE HIGHLIGHT - Large featured quote style
 * Typography: Matched to Hero1 (font-black, tracking-tight, uppercase eyebrow)
 */
export function Testimonials3({ items, title, subtitle }: Testimonials3Props) {
  if (items.length === 0) return null;

  const featuredItem = items[0];
  const otherItems = items.slice(1, 4);
  const { type: featuredAvatarType } = getImageSource(featuredItem.avatar);

  return (
    <section id="testimonials" className="py-16 md:py-24">
      {/* Header — Hero1 style */}
      <div className="text-center mb-12 md:mb-16">

        {/* Eyebrow */}
        <div className="mb-5 flex items-center justify-center gap-3 max-w-[260px] mx-auto">
          <Separator className="flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground whitespace-nowrap font-medium">
            Testimoni
          </span>
          <Separator className="flex-1 bg-border" />
        </div>

        {/* Title */}
        <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-black leading-[1.0] tracking-tight text-foreground max-w-2xl mx-auto">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mt-4">
            {subtitle}
          </p>
        )}
      </div>

      {/* Featured Quote */}
      <div className="max-w-3xl mx-auto mb-10 md:mb-12">
        <div className="relative bg-primary/5 rounded-2xl p-6 md:p-8 border border-border/40">

          {/* Badge — Hero1 badge style */}
          <Badge
            variant="outline"
            className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium border-border text-muted-foreground bg-background"
          >
            Unggulan
          </Badge>

          <p className="text-base md:text-lg font-semibold text-foreground text-center leading-relaxed mb-6 mt-2">
            &quot;{featuredItem.content}&quot;
          </p>

          <div className="flex items-center justify-center gap-3">
            <Avatar className="h-12 w-12 ring-4 ring-background shadow-md">
              {featuredAvatarType !== 'none' ? (
                <OptimizedImage
                  src={featuredItem.avatar}
                  alt={featuredItem.name}
                  width={48}
                  height={48}
                  crop="thumb"
                  gravity="face"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {featuredItem.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-left">
              {/* Name — font-black tracking-tight */}
              <p className="font-black text-[14px] tracking-tight text-foreground leading-none">
                {featuredItem.name}
              </p>
              {featuredItem.role && (
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-1 font-medium">
                  {featuredItem.role}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other Testimonials */}
      {otherItems.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {otherItems.map((item, index) => {
            const { type: avatarType } = getImageSource(item.avatar);
            return (
              <div
                key={item.id || index}
                className="
                  w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]
                  flex flex-col
                  bg-card border border-border/50 rounded-xl p-5
                "
              >
                {/* Eyebrow mark */}
                <span className="text-[10px] uppercase tracking-[0.28em] text-primary/40 font-medium mb-3 block">
                  ★ Ulasan
                </span>

                <p className="text-sm text-foreground leading-relaxed mb-4 flex-1">
                  &quot;{item.content}&quot;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <Avatar className="h-9 w-9 shrink-0">
                    {avatarType !== 'none' ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={36}
                        height={36}
                        crop="thumb"
                        gravity="face"
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {item.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-black text-[12px] tracking-tight text-foreground leading-none">
                      {item.name}
                    </p>
                    {item.role && (
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1 font-medium">
                        {item.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
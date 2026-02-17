'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials4Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials4
 * Design: SINGLE FOCUS - Card quote, avatar tabs selector
 * Typography: Matched to Hero1 (font-black, tracking-tight, uppercase eyebrow)
 */
export function Testimonials4({ items, title, subtitle }: Testimonials4Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

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

      <div className="max-w-2xl mx-auto">
        {/* Card */}
        <Card className="border-0 shadow-lg bg-card mb-8">
          <CardContent className="p-6 md:p-8 text-center flex flex-col items-center min-h-[220px] justify-center">
            {/* Eyebrow inside card */}
            <span className="text-[10px] uppercase tracking-[0.28em] text-primary/50 font-medium mb-5 block">
              ★ Ulasan Pelanggan
            </span>

            {/* Content */}
            <p className="text-sm text-foreground leading-relaxed">
              &quot;{activeItem.content}&quot;
            </p>
          </CardContent>
        </Card>

        {/* Name + Role — Hero1 font-black + uppercase tracking */}
        <div className="text-center mb-5">
          <p className="font-black text-[16px] tracking-tight text-foreground leading-none">
            {activeItem.name}
          </p>
          {activeItem.role && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-2 font-medium">
              {activeItem.role}
            </p>
          )}
        </div>

        {/* Avatar Tabs */}
        <div className="flex justify-center gap-3">
          {items.map((item, index) => {
            const { type: avatarType } = getImageSource(item.avatar);
            const isActive = index === activeIndex;
            return (
              <button
                key={item.id || index}
                onClick={() => setActiveIndex(index)}
                className={`rounded-full transition-all duration-300 ${isActive
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                  : 'opacity-40 hover:opacity-70'
                  }`}
                aria-label={item.name}
              >
                <Avatar className="h-11 w-11">
                  {avatarType !== 'none' ? (
                    <OptimizedImage
                      src={item.avatar}
                      alt={item.name}
                      width={44}
                      height={44}
                      crop="thumb"
                      gravity="face"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
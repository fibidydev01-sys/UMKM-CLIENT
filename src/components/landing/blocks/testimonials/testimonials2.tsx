'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials2Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials2
 * Design: CAROUSEL SLIDER - Navigation arrows + dots
 * Typography: Matched to Hero1 (font-black, tracking-tight, uppercase eyebrow)
 */
export function Testimonials2({ items, title, subtitle }: Testimonials2Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const currentItem = items[currentIndex];
  const { type: avatarType } = getImageSource(currentItem.avatar);

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

      {/* Carousel */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 rounded-full shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 rounded-full shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Card */}
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="p-6 md:p-8 text-center">
              {/* Eyebrow inside card */}
              <span className="text-[10px] uppercase tracking-[0.28em] text-primary/50 font-medium mb-5 block">
                ★ Ulasan Pelanggan
              </span>

              {/* Content */}
              <p className="text-sm text-foreground leading-relaxed mb-6">
                &quot;{currentItem.content}&quot;
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-12 w-12 ring-4 ring-primary/10">
                  {avatarType !== 'none' ? (
                    <OptimizedImage
                      src={currentItem.avatar}
                      alt={currentItem.name}
                      width={48}
                      height={48}
                      crop="thumb"
                      gravity="face"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {currentItem.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  {/* Name — font-black tracking-tight */}
                  <p className="font-black text-[14px] tracking-tight text-foreground leading-none">
                    {currentItem.name}
                  </p>
                  {currentItem.role && (
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-1 font-medium">
                      {currentItem.role}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'w-6 bg-primary'
                : 'w-1.5 bg-muted-foreground/30'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
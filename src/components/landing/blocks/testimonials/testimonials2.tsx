'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* Carousel */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 rounded-full shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 rounded-full shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Card */}
          <Card className="border-0 shadow-xl bg-card">
            <CardContent className="p-8 md:p-12 text-center">
              {/* Rating */}
              {typeof currentItem.rating === 'number' && currentItem.rating > 0 && (
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`star-${i}`}
                      className={`h-5 w-5 ${i < currentItem.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                &quot;{currentItem.content}&quot;
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-14 w-14 ring-4 ring-primary/10">
                  {avatarType !== 'none' ? (
                    <OptimizedImage
                      src={currentItem.avatar}
                      alt={currentItem.name}
                      width={56}
                      height={56}
                      crop="thumb"
                      gravity="face"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {currentItem.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-lg">{currentItem.name}</p>
                  {currentItem.role && (
                    <p className="text-muted-foreground">{currentItem.role}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
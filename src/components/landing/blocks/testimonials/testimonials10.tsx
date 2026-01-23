'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';

/**
 * Testimonials2 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - testimonialsTitle: Section heading
 * @prop subtitle - testimonialsSubtitle: Section subheading
 * @prop items - testimonials: Array<{name, role, content, avatar?, rating?}>
 */
interface Testimonials10Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials10
 * Design: Card Slider
 */
export function Testimonials10({
  items,
  title,
  subtitle,
}: Testimonials10Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  // Get 3 items starting from currentIndex (with wrap around)
  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="pointer-events-auto rounded-full shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="pointer-events-auto rounded-full shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
          {visibleItems.map((item, index) => {
            const key = item.id || `testimonial-${currentIndex + index}`;
            const { type: avatarType } = getImageSource(item.avatar);

            return (
              <Card
                key={key}
                className={`relative transition-all duration-300 ${
                  index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'
                }`}
              >
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />

                  {typeof item.rating === 'number' && item.rating > 0 && (
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`${key}-star-${i}`}
                          className={`h-4 w-4 ${
                            i < item.rating!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-muted-foreground mb-4 italic">
                    &quot;{item.content}&quot;
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 overflow-hidden">
                      {avatarType !== 'none' ? (
                        <OptimizedImage
                          src={item.avatar}
                          alt={item.name}
                          width={40}
                          height={40}
                          crop="thumb"
                          gravity="face"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <AvatarFallback>
                          {item.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.role && (
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

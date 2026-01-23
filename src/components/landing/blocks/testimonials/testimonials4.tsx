'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
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
 * Design: SINGLE FOCUS - One testimonial centered, clickable avatars
 */
export function Testimonials4({ items, title, subtitle }: Testimonials4Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];
  const { type: activeAvatarType } = getImageSource(activeItem.avatar);

  return (
    <section id="testimonials" className="py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      <div className="max-w-3xl mx-auto text-center">
        {/* Quote Icon */}
        <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />

        {/* Rating */}
        {typeof activeItem.rating === 'number' && activeItem.rating > 0 && (
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={`star-${i}`}
                className={`h-5 w-5 ${i < activeItem.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
                  }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <p className="text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed mb-8">
          &quot;{activeItem.content}&quot;
        </p>

        {/* Active Author */}
        <div className="mb-10">
          <p className="font-bold text-foreground text-xl">{activeItem.name}</p>
          {activeItem.role && (
            <p className="text-muted-foreground mt-1">{activeItem.role}</p>
          )}
        </div>

        {/* Avatar Selector */}
        <div className="flex justify-center gap-3">
          {items.map((item, index) => {
            const { type: avatarType } = getImageSource(item.avatar);
            return (
              <button
                key={item.id || index}
                onClick={() => setActiveIndex(index)}
                className={`relative transition-all duration-300 ${index === activeIndex
                  ? 'scale-110 ring-4 ring-primary ring-offset-2 ring-offset-background rounded-full'
                  : 'opacity-50 hover:opacity-80'
                  }`}
              >
                <Avatar className="h-12 w-12 md:h-14 md:w-14">
                  {avatarType !== 'none' ? (
                    <OptimizedImage
                      src={item.avatar}
                      alt={item.name}
                      width={56}
                      height={56}
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
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
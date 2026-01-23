'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
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
 */
export function Testimonials3({ items, title, subtitle }: Testimonials3Props) {
  if (items.length === 0) return null;

  const featuredItem = items[0];
  const otherItems = items.slice(1, 4);
  const { type: featuredAvatarType } = getImageSource(featuredItem.avatar);

  return (
    <section id="testimonials" className="py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* Featured Quote */}
      <div className="max-w-4xl mx-auto mb-12 md:mb-16">
        <div className="relative bg-primary/5 rounded-3xl p-8 md:p-12">
          <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/20" />

          {/* Rating */}
          {typeof featuredItem.rating === 'number' && featuredItem.rating > 0 && (
            <div className="flex gap-1 mb-6 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`featured-star-${i}`}
                  className={`h-6 w-6 ${i < featuredItem.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
                    }`}
                />
              ))}
            </div>
          )}

          <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground text-center leading-relaxed mb-8">
            &quot;{featuredItem.content}&quot;
          </p>

          <div className="flex items-center justify-center gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-background shadow-lg">
              {featuredAvatarType !== 'none' ? (
                <OptimizedImage
                  src={featuredItem.avatar}
                  alt={featuredItem.name}
                  width={56}
                  height={56}
                  crop="thumb"
                  gravity="face"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {featuredItem.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-left">
              <p className="font-bold text-foreground text-lg">{featuredItem.name}</p>
              {featuredItem.role && (
                <p className="text-muted-foreground">{featuredItem.role}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other Testimonials */}
      {otherItems.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {otherItems.map((item, index) => {
            const { type: avatarType } = getImageSource(item.avatar);
            return (
              <div key={item.id || index} className="bg-card border rounded-xl p-6">
                <p className="text-foreground mb-4">&quot;{item.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
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
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.name}</p>
                    {item.role && <p className="text-xs text-muted-foreground">{item.role}</p>}
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
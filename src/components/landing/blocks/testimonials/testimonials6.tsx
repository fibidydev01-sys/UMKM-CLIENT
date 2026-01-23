'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials6Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials6
 * Design: SOCIAL PROOF - Compact social-media style cards
 */
export function Testimonials6({ items, title, subtitle }: Testimonials6Props) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* Social Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}`;
          const { type: avatarType } = getImageSource(item.avatar);

          return (
            <div
              key={key}
              className="bg-card border border-border/50 rounded-xl p-5 hover:bg-muted/50 transition-colors"
            >
              {/* Header: Avatar + Name */}
              <div className="flex items-center gap-3 mb-3">
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
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                  {item.role && (
                    <p className="text-xs text-muted-foreground truncate">{item.role}</p>
                  )}
                </div>
              </div>

              {/* Content - Compact */}
              <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                &quot;{item.content}&quot;
              </p>

              {/* Rating */}
              {typeof item.rating === 'number' && item.rating > 0 && (
                <div className="flex gap-0.5 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`${key}-star-${i}`}
                      className={`h-3.5 w-3.5 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
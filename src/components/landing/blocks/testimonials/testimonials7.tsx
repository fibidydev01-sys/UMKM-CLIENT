'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials7Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials7
 * Design: MARQUEE - Auto-scrolling infinite carousel
 */
export function Testimonials7({ items, title, subtitle }: Testimonials7Props) {
  if (items.length === 0) return null;

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <section id="testimonials" className="py-16 md:py-24 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Scrolling Row */}
        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
          {duplicatedItems.map((item, index) => {
            const key = `${item.id || 'testimonial'}-${index}`;
            const { type: avatarType } = getImageSource(item.avatar);

            return (
              <div
                key={key}
                className="flex-shrink-0 w-[350px] bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
              >
                {/* Rating */}
                {typeof item.rating === 'number' && item.rating > 0 && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`${key}-star-${i}`}
                        className={`h-4 w-4 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
                          }`}
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                <p className="text-foreground leading-relaxed mb-5 line-clamp-4">
                  &quot;{item.content}&quot;
                </p>

                {/* Author */}
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
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    {item.role && (
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add keyframes via style tag */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
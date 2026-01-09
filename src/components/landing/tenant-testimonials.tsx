'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import type { TenantLandingConfig, Testimonial } from '@/types';

interface TenantTestimonialsProps {
  config?: TenantLandingConfig['testimonials'];
}

export function TenantTestimonials({ config }: TenantTestimonialsProps) {
  const title = config?.title || 'Testimoni';
  const subtitle = config?.subtitle || '';

  // Get raw items
  const rawItems = config?.config?.items;

  // Handle nested array bug - [[item1, item2]] instead of [item1, item2]
  let normalizedItems = rawItems;

  // Flatten nested arrays
  if (Array.isArray(normalizedItems)) {
    while (normalizedItems.length === 1 && Array.isArray(normalizedItems[0])) {
      normalizedItems = normalizedItems[0];
    }
  }

  // Filter valid items
  let items: Testimonial[] = [];

  if (Array.isArray(normalizedItems)) {
    items = normalizedItems.filter((item): item is Testimonial => {
      if (!item || typeof item !== 'object') return false;
      if (typeof item.name !== 'string' || !item.name.trim()) return false;
      if (typeof item.content !== 'string' || !item.content.trim()) return false;
      return true;
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}-${item.name.replace(/\s+/g, '-')}`;

          return (
            <Card key={key} className="relative">
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />

                {/* Rating */}
                {typeof item.rating === 'number' && item.rating > 0 && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`${key}-star-${i}`}
                        className={`h-4 w-4 ${i < item.rating!
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted'
                          }`}
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                <p className="text-muted-foreground mb-4 italic">
                  &quot;{item.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {item.avatar && (
                      <AvatarImage src={item.avatar} alt={item.name} />
                    )}
                    <AvatarFallback>
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
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
    </section>
  );
}
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import type { TenantLandingConfig } from '@/types';

interface TenantTestimonialsProps {
  config?: TenantLandingConfig['testimonials'];
}

export function TenantTestimonials({ config }: TenantTestimonialsProps) {
  const title = config?.title || 'Testimoni';
  const subtitle = config?.subtitle || '';
  const items = config?.config?.items || [];

  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="relative">
            <CardContent className="pt-6">
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />

              {/* Rating */}
              {item.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`${item.id}-star-${i}`}
                      className={`h-4 w-4 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <p className="text-muted-foreground mb-4 italic">&quot;{item.content}&quot;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.role && <p className="text-sm text-muted-foreground">{item.role}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
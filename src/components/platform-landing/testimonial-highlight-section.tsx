// ══════════════════════════════════════════════════════════════
// TESTIMONIAL HIGHLIGHT SECTION - V8.1 Copywriting
// Featured testimonial with results (single highlight)
// ══════════════════════════════════════════════════════════════

import { Star, Quote, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (Icons instead of emojis)
// ══════════════════════════════════════════════════════════════

const featuredTestimonial = {
  quote: `Akhirnya bengkel gue punya alamat online. Sekarang orang bisa liat daftar service dan tarifnya langsung. Yang paling gue suka, Fibidy AI ngebantu nulis deskripsi bengkel. Hasilnya lebih profesional dari yang gue bisa tulis sendiri.`,
  author: {
    name: 'Mas Anto',
    role: 'Bengkel Motor',
    location: 'Jakarta',
    image: '/testimonials/anto.jpg',
  },
  rating: 5,
  highlights: [
    'Punya alamat online',
    'Deskripsi profesional',
    'Pelanggan bisa liat tarif',
  ],
};

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function TestimonialHighlightSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Star className="h-4 w-4 fill-primary" />
            Cerita Sukses
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Mereka Udah Mulai
          </h2>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* FEATURED TESTIMONIAL                                 */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl bg-background">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Quote */}
                <div className="flex-1">
                  <Quote className="h-12 w-12 text-primary/20 mb-6" />

                  <blockquote className="text-lg md:text-xl leading-relaxed text-foreground mb-6">
                    &quot;{featuredTestimonial.quote}&quot;
                  </blockquote>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: featuredTestimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                      <AvatarImage
                        src={featuredTestimonial.author.image}
                        alt={featuredTestimonial.author.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {featuredTestimonial.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">
                        {featuredTestimonial.author.name}
                      </p>
                      <p className="text-muted-foreground">
                        {featuredTestimonial.author.role}
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        {featuredTestimonial.author.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="md:w-56 flex flex-row md:flex-col gap-3">
                  {featuredTestimonial.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex-1 p-4 rounded-xl bg-primary/5 border border-primary/10"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
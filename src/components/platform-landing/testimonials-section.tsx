// ══════════════════════════════════════════════════════════════
// TESTIMONIALS SECTION - V8.2 (No DottedMap, No Marquee)
// Simple Grid Layout with CSS animations
// ══════════════════════════════════════════════════════════════

'use client';

import { Star, Quote, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/cn';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (Real testimonials, no fake stats)
// ══════════════════════════════════════════════════════════════

const testimonials = [
  {
    name: 'Mas Anto',
    role: 'Bengkel Motor',
    location: 'Jakarta',
    content: 'Akhirnya bengkel gue punya alamat online. Sekarang orang bisa liat daftar service dan tarifnya.',
    rating: 5,
  },
  {
    name: 'Mbak Dian',
    role: 'Salon',
    location: 'Bandung',
    content: 'Fibidy AI ngebantu banget nulis deskripsi salon. Hasilnya lebih profesional dari yang gue bisa tulis sendiri.',
    rating: 5,
  },
  {
    name: 'Bu Sari',
    role: 'Toko Kue',
    location: 'Surabaya',
    content: 'Pelan-pelan ada yang nemuin toko kue gue dari Google. Padahal gue cuma rajin update menu aja.',
    rating: 5,
  },
  {
    name: 'Pak Hadi',
    role: 'Laundry',
    location: 'Yogyakarta',
    content: 'Sekarang pelanggan laundry bisa langsung booking dari link. Gak perlu chat panjang lebar dulu.',
    rating: 5,
  },
  {
    name: 'Mas Budi',
    role: 'Service AC',
    location: 'Semarang',
    content: 'Pelanggan bisa liat tarif service langsung. Gak perlu bolak-balik chat nanya harga.',
    rating: 5,
  },
  {
    name: 'Mbak Rina',
    role: 'Catering',
    location: 'Bali',
    content: 'Order catering jadi lebih rapi. Detailnya langsung masuk WhatsApp, tinggal konfirmasi.',
    rating: 5,
  },
];

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENT: Testimonial Card
// ══════════════════════════════════════════════════════════════

function TestimonialCard({
  testimonial,
  className,
  style,
}: {
  testimonial: typeof testimonials[0];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Card
      className={cn(
        "border-none shadow-md hover:shadow-lg transition-all duration-300 group bg-background/95 backdrop-blur-sm h-full",
        className
      )}
      style={style}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <Quote className="h-8 w-8 text-primary/20 mb-4 group-hover:text-primary/40 transition-colors flex-shrink-0" />

        <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
          &quot;{testimonial.content}&quot;
        </p>

        <div className="mt-auto">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {testimonial.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">
                {testimonial.role}
              </p>
              <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {testimonial.location}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Dari Berbagai <span className="text-primary">Jenis Usaha</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Produk, jasa, atau gabungan semuanya bisa pakai Fibidy.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* TESTIMONIALS GRID (replaces Marquee)                 */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* CATEGORY BADGES (instead of fake stats)              */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="pt-12 border-t mt-16">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Dipakai oleh berbagai jenis usaha:
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {['Bengkel', 'Salon', 'Toko Kue', 'Laundry', 'Service AC', 'Catering', 'Pet Shop', 'Fotografi', 'Gym', 'Kost'].map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground"
              >
                {category}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full bg-primary/10 text-sm text-primary font-medium">
              +5 lainnya
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
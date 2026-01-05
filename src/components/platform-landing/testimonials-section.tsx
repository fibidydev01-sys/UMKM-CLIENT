'use client';

import { Star, Quote, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DottedMap } from '@/components/ui/dotted-map';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Siti Rahayu',
    role: 'Pemilik Toko Kue Siti',
    location: 'Bandung',
    content: 'Dulu saya cuma jualan lewat WA status, sekarang sudah punya toko online sendiri. Orderan naik 3x lipat dalam sebulan!',
    rating: 5,
    coordinates: { lat: -6.9175, lng: 107.6191 },
  },
  {
    name: 'Ahmad Fadli',
    role: 'Owner Fadli Fashion',
    location: 'Jakarta',
    content: 'Fitur WhatsApp checkout-nya mantap. Pelanggan tinggal klik, langsung masuk chat WA saya lengkap dengan detail pesanan.',
    rating: 5,
    coordinates: { lat: -6.2088, lng: 106.8456 },
  },
  {
    name: 'Maya Putri',
    role: 'Founder Healthy Snacks ID',
    location: 'Surabaya',
    content: 'Gratis tapi lengkap banget fiturnya. Support-nya juga responsif. Recommended untuk yang baru mulai bisnis online!',
    rating: 5,
    coordinates: { lat: -7.2575, lng: 112.7521 },
  },
  {
    name: 'Budi Santoso',
    role: 'Pemilik Warung Kopi Budi',
    location: 'Yogyakarta',
    content: 'Sekarang pelanggan bisa lihat menu dan pesan online. Praktis banget, nggak perlu repot terima telepon satu-satu.',
    rating: 5,
    coordinates: { lat: -7.7956, lng: 110.3695 },
  },
  {
    name: 'Dewi Lestari',
    role: 'Owner Dewi Craft',
    location: 'Bali',
    content: 'Landing page-nya bikin toko saya keliatan profesional. Pelanggan dari luar kota lebih percaya untuk order.',
    rating: 5,
    coordinates: { lat: -8.4095, lng: 115.1889 },
  },
  {
    name: 'Rudi Hartono',
    role: 'Pemilik Toko Elektronik',
    location: 'Semarang',
    content: 'Fitur manajemen stok sangat membantu. Tidak ada lagi pelanggan kecewa karena order barang yang sudah habis.',
    rating: 5,
    coordinates: { lat: -6.9666, lng: 110.4196 },
  },
];

const stats = [
  { value: '4.9/5', label: 'Rating Pengguna' },
  { value: '10,000+', label: 'UMKM Terdaftar' },
  { value: '34', label: 'Provinsi' },
  { value: '24/7', label: 'Support Online' },
];

const mapDots = testimonials.map((t) => ({
  start: { lat: -6.2088, lng: 106.8456, label: 'Jakarta' },
  end: { lat: t.coordinates.lat, lng: t.coordinates.lng, label: t.location },
}));

// Split testimonials into two rows for marquee
const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card className={cn(
      "w-[350px] border-none shadow-md hover:shadow-lg transition-all duration-300 group bg-background/95 backdrop-blur-sm"
    )}>
      <CardContent className="p-6">
        <Quote className="h-8 w-8 text-primary/20 mb-4 group-hover:text-primary/40 transition-colors" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          &#34;{testimonial.content}&#34;
        </p>

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
      </CardContent>
    </Card>
  );
};

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Dipercaya <span className="text-primary">10,000+</span> UMKM Indonesia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tersebar di 34 provinsi seluruh Indonesia
          </p>
        </div>

        {/* Map Background */}
        <div className="relative mb-16">
          <div className="flex items-center justify-center pointer-events-none opacity-20 mb-12">
            <div className="w-full max-w-4xl aspect-[2/1]">
              <DottedMap
                dots={mapDots}
                lineColor="hsl(var(--primary))"
              />
            </div>
          </div>

          {/* Marquee Testimonials */}
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
            <Marquee pauseOnHover className="[--duration:40s]">
              {firstRow.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:40s]">
              {secondRow.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </Marquee>

            {/* Gradient Fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-12 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
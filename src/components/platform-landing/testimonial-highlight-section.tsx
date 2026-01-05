import { Star, Quote, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const featuredTestimonial = {
  quote: `Dulu saya cuma jualan lewat WA status, orderan sehari paling 2-3. Setelah pakai Fibidy, pelanggan bisa lihat katalog lengkap kapan saja. Sekarang orderan bisa 15-20 per hari! Yang paling saya suka, semua data pelanggan tersimpan rapi jadi bisa follow up untuk promo.`,
  author: {
    name: 'Siti Rahayu',
    role: 'Pemilik Toko Kue Siti',
    location: 'Bandung, Jawa Barat',
    image: '/testimonials/siti.jpg',
  },
  rating: 5,
  results: [
    {
      icon: TrendingUp,
      value: '300%',
      label: 'Kenaikan Omzet',
    },
    {
      icon: ShoppingCart,
      value: '15-20',
      label: 'Order per Hari',
    },
    {
      icon: Users,
      value: '500+',
      label: 'Pelanggan Tercatat',
    },
  ],
};

export function TestimonialHighlightSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            ⭐ Cerita Sukses
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Lihat Bagaimana UMKM Lain Berhasil
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl bg-background">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <Quote className="h-12 w-12 text-primary/20 mb-6" />

                  <blockquote className="text-lg md:text-xl leading-relaxed text-foreground mb-6">
                    &#34;{featuredTestimonial.quote}&#34;
                  </blockquote>

                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: featuredTestimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

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

                <div className="md:w-64 flex flex-row md:flex-col gap-4">
                  {featuredTestimonial.results.map((result) => (
                    <div
                      key={result.label}
                      className="flex-1 p-4 rounded-xl bg-muted/50 text-center"
                    >
                      <result.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">
                        {result.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.label}
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
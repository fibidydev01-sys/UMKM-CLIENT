import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Lightbulb,
  GraduationCap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const articles = [
  {
    title: '10 Tips Sukses Jualan Online untuk Pemula',
    excerpt: 'Pelajari strategi dasar yang terbukti efektif untuk memulai bisnis online dari nol.',
    category: 'Tips Jualan',
    categoryIcon: TrendingUp,
    href: '/blog/tips-sukses-jualan-online',
    readTime: '5 menit',
    date: '2025-01-10',
  },
  {
    title: 'Cara Membuat Foto Produk Menarik dengan HP',
    excerpt: 'Tidak perlu kamera mahal, cukup smartphone dan tips ini untuk foto produk profesional.',
    category: 'Tutorial',
    categoryIcon: GraduationCap,
    href: '/blog/foto-produk-dengan-hp',
    readTime: '7 menit',
    date: '2025-01-08',
  },
  {
    title: 'Kisah Sukses: Dari Warung Kecil ke Omzet 100 Juta',
    excerpt: 'Bagaimana Bu Siti mengembangkan toko kuenya dengan strategi digital yang tepat.',
    category: 'Inspirasi',
    categoryIcon: Lightbulb,
    href: '/blog/kisah-sukses-toko-kue-siti',
    readTime: '4 menit',
    date: '2025-01-05',
  },
];

export function BlogSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <BookOpen className="h-4 w-4" />
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Tips & Insight untuk <span className="text-primary">UMKM</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pelajari strategi sukses jualan online dari para ahli dan sesama UMKM
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((article) => (
            <Card
              key={article.href}
              className="border-none shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-pink-500/10 flex items-center justify-center">
                <article.categoryIcon className="h-12 w-12 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <Link
                    href={article.href}
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Baca
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog">
              Lihat Semua Artikel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
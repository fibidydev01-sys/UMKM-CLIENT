import Link from 'next/link';
import {
  ArrowRight,
  Rocket,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/cn';

const benefits = [
  {
    icon: Zap,
    text: 'Setup 5 menit',
  },
  {
    icon: Shield,
    text: 'Gratis selamanya',
  },
  {
    icon: Clock,
    text: 'Tanpa kartu kredit',
  },
  {
    icon: HeartHandshake,
    text: 'Support responsif',
  },
];

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-pink-600" />

      <DotPattern
        className={cn(
          'absolute inset-0 z-0 opacity-20',
          '[mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]'
        )}
      />

      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-8">
            <Rocket className="h-8 w-8" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Siap Memulai Bisnis Online Anda?
          </h2>

          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Bergabung dengan 10,000+ UMKM Indonesia yang sudah sukses jualan online
            dengan Fibidy. Gratis, mudah, dan tanpa ribet.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-2 text-sm opacity-90"
              >
                <benefit.icon className="h-4 w-4 flex-shrink-0" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-base px-8 h-12 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Link href="/register">
                Daftar Gratis Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base h-12 border-white/30 bg-white/10 hover:bg-white/20 text-white"
            >
              <Link href="/login">Sudah punya akun? Masuk</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm opacity-70 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Dipercaya oleh 10,000+ UMKM di seluruh Indonesia
          </p>
        </div>
      </div>
    </section>
  );
}
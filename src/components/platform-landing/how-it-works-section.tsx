import Link from 'next/link';
import {
  FileText,
  Palette,
  Package,
  Link as LinkIcon,
  MessageCircle,
  Clock,
  Lightbulb,
  Sparkles,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { cn } from '@/lib/cn';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (5 Steps)
// ══════════════════════════════════════════════════════════════

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Daftar & Pilih Kategori',
    description: 'Masukin nama usaha, email, WhatsApp. Pilih kategori bisnis kamu.',
    highlight: 'Langsung dapat alamat: namakamu.fibidy.com',
    time: '2 menit',
    tip: 'Kategori menentukan fitur dan label yang muncul.',
    numberBg: 'bg-blue-500',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
  },
  {
    number: 2,
    icon: Palette,
    title: 'Atur Tampilan & Deskripsi',
    description: 'Pilih warna, upload logo, tulis deskripsi usaha.',
    time: '5-10 menit',
    tip: 'Bingung nulis deskripsi? Fibidy AI kasih pilihan, tinggal pilih.',
    hasFibidyAI: true,
    numberBg: 'bg-purple-500',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
  },
  {
    number: 3,
    icon: Package,
    title: 'Tambahin Produk/Layanan',
    description: 'Upload foto, tulis nama, harga/tarif. Tambahin deskripsi yang lengkap.',
    time: '2-5 menit per item',
    tip: 'Makin lengkap infonya, makin gampang orang nemuin.',
    isImportant: true,
    hasFibidyAI: true,
    numberBg: 'bg-green-500',
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/10',
  },
  {
    number: 4,
    icon: LinkIcon,
    title: 'Share Alamat',
    description: 'Toko udah jadi? Share link-nya! Taro di bio Instagram, share di story WA.',
    tip: 'Makin banyak yang visit, makin bagus buat toko kamu.',
    numberBg: 'bg-orange-500',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/10',
  },
  {
    number: 5,
    icon: MessageCircle,
    title: 'Terima Order/Booking',
    description: 'Pelanggan klik "Pesan" atau "Booking". Langsung masuk WhatsApp kamu!',
    numberBg: 'bg-pink-500',
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-500/10',
  },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT - FIXED: Using Card + Better Vertical Line
// ══════════════════════════════════════════════════════════════

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Cara Kerja
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Gampang Banget
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dari daftar sampe punya toko. Ikutin aja.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* STEPS - FIXED LAYOUT                                 */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* ═══════════════════════════════════════════════ */}
            {/* VERTICAL LINE - FIXED: Positioned to center of  */}
            {/* number circles, full height                      */}
            {/* ═══════════════════════════════════════════════ */}
            <div
              className="absolute left-7 top-8 bottom-8 w-0.5 hidden md:block"
              style={{
                background: 'linear-gradient(to bottom, #3b82f6, #22c55e, #ec4899)',
              }}
            />

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="relative flex gap-4 md:gap-6">
                  {/* ═══════════════════════════════════════════ */}
                  {/* NUMBER CIRCLE - Fixed width for alignment   */}
                  {/* ═══════════════════════════════════════════ */}
                  <div
                    className={cn(
                      'relative z-10 flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg',
                      step.numberBg
                    )}
                  >
                    {step.number}
                  </div>

                  {/* ═══════════════════════════════════════════ */}
                  {/* CARD - Consistent height with min-height    */}
                  {/* ═══════════════════════════════════════════ */}
                  <Card
                    className={cn(
                      'flex-1 transition-all duration-300 hover:shadow-md',
                      step.isImportant && 'ring-2 ring-green-500/30 shadow-md'
                    )}
                  >
                    <CardContent className="p-5">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', step.iconBg)}>
                            <step.icon className={cn('h-5 w-5', step.iconColor)} />
                          </div>
                          <h3 className="font-bold text-lg">{step.title}</h3>
                        </div>

                        {/* Important Badge */}
                        {step.isImportant && (
                          <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium flex items-center gap-1 flex-shrink-0">
                            <Star className="h-3 w-3" />
                            PENTING
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-3">
                        {step.description}
                      </p>

                      {/* Highlight */}
                      {step.highlight && (
                        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                          {step.highlight}
                        </p>
                      )}

                      {/* Meta Row: Time + Tip + Fibidy AI */}
                      <div className="flex flex-wrap items-start gap-3 text-xs">
                        {step.time && (
                          <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
                            <Clock className="h-3 w-3" />
                            {step.time}
                          </span>
                        )}

                        {step.hasFibidyAI && (
                          <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded">
                            <Sparkles className="h-3 w-3" />
                            Fibidy AI
                          </span>
                        )}

                        {step.tip && (
                          <span className="flex items-start gap-1 text-muted-foreground">
                            <Lightbulb className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>{step.tip}</span>
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* CTA                                                  */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mt-16">
          <Link href="/register">
            <InteractiveHoverButton>Mulai Sekarang - Gratis!</InteractiveHoverButton>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Tidak perlu kartu kredit. Langsung bisa pakai.
          </p>
        </div>
      </div>
    </section>
  );
}
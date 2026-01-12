// ══════════════════════════════════════════════════════════════
// HOW IT WORKS SECTION - V8.1 Copywriting
// 5 Steps: Daftar → Setup → Produk → Share → Terima Order
// ══════════════════════════════════════════════════════════════

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
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { cn } from '@/lib/cn';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (5 Steps) - Icons instead of emojis
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
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900/50',
    numberBg: 'bg-blue-500',
    iconColor: 'text-blue-500',
  },
  {
    number: 2,
    icon: Palette,
    title: 'Atur Tampilan & Deskripsi',
    description: 'Pilih warna, upload logo, tulis deskripsi usaha.',
    time: '5-10 menit',
    tip: 'Bingung nulis deskripsi? Fibidy AI kasih pilihan, tinggal pilih.',
    hasFibidyAI: true,
    color: 'purple',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-900/50',
    numberBg: 'bg-purple-500',
    iconColor: 'text-purple-500',
  },
  {
    number: 3,
    icon: Package,
    title: 'Tambahin Produk/Layanan',
    description: 'Upload foto, tulis nama, harga/tarif. Tambahin deskripsi yang lengkap.',
    time: '2-5 menit per item',
    tip: 'Makin lengkap infonya, makin gampang orang nemuin. Bingung nulis? Fibidy AI bantuin.',
    isImportant: true,
    hasFibidyAI: true,
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-900/50',
    numberBg: 'bg-green-500',
    iconColor: 'text-green-500',
  },
  {
    number: 4,
    icon: LinkIcon,
    title: 'Share Alamat',
    description: 'Toko udah jadi? Share link-nya! Taro di bio Instagram, share di story WA, kasih ke pelanggan/klien lama.',
    tip: 'Makin banyak yang visit, makin bagus buat toko kamu.',
    color: 'orange',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-900/50',
    numberBg: 'bg-orange-500',
    iconColor: 'text-orange-500',
  },
  {
    number: 5,
    icon: MessageCircle,
    title: 'Terima Order/Booking',
    description: 'Pelanggan nemuin toko, tertarik, klik "Pesan" atau "Booking". Langsung masuk WhatsApp kamu. Tinggal proses!',
    color: 'pink',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    borderColor: 'border-pink-200 dark:border-pink-900/50',
    numberBg: 'bg-pink-500',
    iconColor: 'text-pink-500',
  },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
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
        {/* STEPS                                                */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-pink-500 opacity-20 hidden md:block" />

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={cn(
                    'relative flex gap-6',
                    step.isImportant && 'scale-[1.02]'
                  )}
                >
                  {/* Number Circle */}
                  <div
                    className={cn(
                      'relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg',
                      step.numberBg
                    )}
                  >
                    {step.number}
                  </div>

                  {/* Card */}
                  <div
                    className={cn(
                      'flex-1 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg',
                      step.bgColor,
                      step.borderColor,
                      step.isImportant && 'ring-2 ring-green-500/30'
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <step.icon className={cn('h-6 w-6', step.iconColor)} />
                        <h3 className="font-bold text-xl">{step.title}</h3>
                      </div>

                      {/* Important Badge */}
                      {step.isImportant && (
                        <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          PENTING
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-3">
                      {step.description}
                    </p>

                    {/* Highlight */}
                    {step.highlight && (
                      <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {step.highlight}
                      </p>
                    )}

                    {/* Time + Tip */}
                    <div className="flex flex-wrap items-start gap-4 text-sm">
                      {step.time && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {step.time}
                        </span>
                      )}

                      {step.tip && (
                        <span className="flex items-start gap-1 text-muted-foreground">
                          <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span>{step.tip}</span>
                        </span>
                      )}

                      {step.hasFibidyAI && (
                        <span className="flex items-center gap-1 text-primary">
                          <Sparkles className="h-4 w-4" />
                          <span className="font-medium">Fibidy AI</span>
                        </span>
                      )}
                    </div>
                  </div>
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
            <InteractiveHoverButton>
              Mulai Sekarang - Gratis!
            </InteractiveHoverButton>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Tidak perlu kartu kredit. Langsung bisa pakai.
          </p>
        </div>
      </div>
    </section>
  );
}
import Link from 'next/link';
import {
  UserPlus,
  Store,
  Rocket,
} from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Daftar Gratis',
    description: 'Isi email dan nomor WhatsApp. Verifikasi akun. Selesai dalam 1 menit.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    numberBg: 'bg-blue-500',
  },
  {
    number: 2,
    icon: Store,
    title: 'Setup Toko',
    description: 'Isi nama toko, upload logo, tambahkan produk pertama Anda dengan mudah.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    numberBg: 'bg-purple-500',
  },
  {
    number: 3,
    icon: Rocket,
    title: 'Mulai Jualan!',
    description: 'Share link toko ke pelanggan. Terima order langsung via WhatsApp.',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    numberBg: 'bg-green-500',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            CARA KERJA
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Mulai Jualan Online dalam 3 Langkah
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tidak perlu skill teknis. Siapapun bisa membuat toko online profesional!
          </p>
        </div>

        {/* Steps Container */}
        <div className="max-w-6xl mx-auto relative">
          {/* VERTICAL LINE - MOBILE */}
          <div className="md:hidden absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 opacity-30" />

          {/* HORIZONTAL LINE - DESKTOP */}
          <div className="hidden md:block absolute top-8 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {/* LAYOUT WRAPPER */}
                  <div className="flex md:flex-col items-start md:items-center gap-6 md:gap-0">

                    {/* NUMBER CIRCLE */}
                    <div className={cn(
                      'relative z-10 flex-shrink-0',
                      'w-16 h-16',
                      'rounded-full',
                      'flex items-center justify-center',
                      'text-white text-xl font-bold',
                      'shadow-lg',
                      step.numberBg
                    )}>
                      {step.number}
                    </div>

                    {/* CARD */}
                    <div className="flex-1 md:mt-8 w-full">
                      <div className={cn(
                        'h-full',
                        'p-6',
                        'rounded-2xl',
                        'border-2',
                        'bg-card',
                        'transition-all duration-300',
                        'hover:shadow-xl hover:-translate-y-1',
                        step.borderColor
                      )}>
                        {/* ICON */}
                        <div className={cn(
                          'w-14 h-14',
                          'rounded-xl',
                          'flex items-center justify-center',
                          'mb-4',
                          step.bgColor
                        )}>
                          <Icon className={cn('w-7 h-7', step.color)} />
                        </div>

                        {/* CONTENT */}
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
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
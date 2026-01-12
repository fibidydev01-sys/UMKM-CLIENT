// ══════════════════════════════════════════════════════════════
// TARGET USER SECTION - V8.1 (NEW COMPONENT)
// "Buat Siapa Fibidy?"
// ══════════════════════════════════════════════════════════════

import {
  ShoppingCart,
  Wrench,
  Coffee,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/cn';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting
// ══════════════════════════════════════════════════════════════

const targetUsers = [
  {
    icon: ShoppingCart,
    emoji: '🛒',
    title: 'Jualan Produk',
    categories: 'Warung • Toko Bangunan • Apotek • Toko Kue • Pet Shop • Frozen Food • Reseller • Oleh-oleh • dll',
    description: 'Tambahin produk, atur harga, pelanggan bisa langsung pesen.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-200 dark:border-blue-900/50',
  },
  {
    icon: Wrench,
    emoji: '🔧',
    title: 'Nawarin Jasa',
    categories: 'Bengkel • Laundry • Service AC • Salon • Barbershop • Percetakan • Fotografi • dll',
    description: 'Tambahin layanan, tarif, pelanggan bisa langsung booking.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-200 dark:border-orange-900/50',
  },
  {
    icon: Coffee,
    emoji: '☕',
    title: 'Produk + Jasa',
    categories: 'Kedai Kopi • Catering • Pet Shop • Gym • Kost • dll',
    description: 'Bisa tambahin menu/produk sekaligus layanan.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-200 dark:border-purple-900/50',
  },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function TargetUserSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Buat Siapa?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Buat Siapa Fibidy?
          </h2>
          <p className="text-lg text-muted-foreground">
            Buat kamu yang:
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* TARGET USER CARDS                                    */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {targetUsers.map((user) => (
            <Card
              key={user.title}
              className={cn(
                'border-2 hover:shadow-lg transition-all duration-300 group',
                user.borderColor
              )}
            >
              <CardContent className="p-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      'group-hover:scale-110 transition-transform duration-300',
                      user.bgColor
                    )}
                  >
                    <span className="text-2xl">{user.emoji}</span>
                  </div>
                  <h3 className="font-bold text-xl">{user.title}</h3>
                </div>

                {/* Categories */}
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {user.categories}
                </p>

                {/* Description */}
                <p className="text-sm text-foreground">
                  {user.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* MICRO-COPY                                           */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
            <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <span>
              Fibidy menyesuaikan sama jenis bisnis kamu.
              <br className="hidden sm:block" />
              Label "Produk" bisa jadi "Menu", "Layanan", "Paket", dll.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
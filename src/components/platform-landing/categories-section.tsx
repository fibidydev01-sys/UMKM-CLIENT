// ══════════════════════════════════════════════════════════════
// CATEGORIES SECTION - V8.1 (NEW COMPONENT)
// "Berbagai Jenis Usaha, Satu Platform"
// 15 Business Categories Grid
// ══════════════════════════════════════════════════════════════

import {
  ShoppingCart,
  Wrench,
  Coffee,
  Package,
  Shirt,
  Cake,
  Pill,
  Wind,
  UtensilsCrossed,
  Scissors,
  Camera,
  Dog,
  Printer,
  Dumbbell,
  Home,
  Lightbulb,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// DATA - 15 Categories from config
// ══════════════════════════════════════════════════════════════

const categories = [
  { icon: ShoppingCart, name: 'Warung Kelontong', color: '#10b981' },
  { icon: Wrench, name: 'Bengkel Motor', color: '#f97316' },
  { icon: Coffee, name: 'Kedai Kopi', color: '#78350f' },
  { icon: Package, name: 'Toko Bangunan', color: '#f59e0b' },
  { icon: Shirt, name: 'Laundry', color: '#3b82f6' },
  { icon: Cake, name: 'Toko Kue', color: '#db2777' },
  { icon: Pill, name: 'Apotek', color: '#ef4444' },
  { icon: Wind, name: 'Service AC', color: '#06b6d4' },
  { icon: UtensilsCrossed, name: 'Catering', color: '#f59e0b' },
  { icon: Scissors, name: 'Salon & Barbershop', color: '#ec4899' },
  { icon: Camera, name: 'Fotografi', color: '#8b5cf6' },
  { icon: Dog, name: 'Pet Shop', color: '#f97316' },
  { icon: Printer, name: 'Percetakan', color: '#4f46e5' },
  { icon: Dumbbell, name: 'Gym & Fitness', color: '#059669' },
  { icon: Home, name: 'Kost & Kontrakan', color: '#0891b2' },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function CategoriesSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            15+ Kategori
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Berbagai Jenis Usaha, Satu Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fibidy menyesuaikan sama jenis bisnis kamu.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* CATEGORIES GRID                                      */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group flex flex-col items-center justify-center p-4 rounded-xl bg-background border hover:border-primary/50 hover:shadow-md transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <category.icon
                  className="h-6 w-6"
                  style={{ color: category.color }}
                />
              </div>

              {/* Name */}
              <span className="text-xs sm:text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {category.name}
              </span>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* MICRO-COPY                                           */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-start gap-2 text-sm text-muted-foreground bg-background rounded-lg px-4 py-3 border">
            <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <span>
              Gak nemu kategori kamu? Tenang, ada opsi &quot;Lainnya&quot;.
              <br className="hidden sm:block" />
              Fibidy tetap bisa dipakai untuk berbagai jenis usaha.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
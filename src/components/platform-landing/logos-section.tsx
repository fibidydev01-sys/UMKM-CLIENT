// ══════════════════════════════════════════════════════════════
// VALUE STRIP SECTION (formerly LogosSection)
// V8.1 - No fake stats, real value propositions
// ══════════════════════════════════════════════════════════════

import { Home, Search, Bot, Ban } from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (Icons instead of emojis)
// ══════════════════════════════════════════════════════════════

const values = [
  {
    icon: Home,
    text: 'Alamat toko sendiri',
    color: 'text-blue-500',
  },
  {
    icon: Search,
    text: 'Lebih gampang dicari',
    color: 'text-green-500',
  },
  {
    icon: Bot,
    text: 'Fibidy AI bantuin nulis',
    color: 'text-purple-500',
  },
  {
    icon: Ban,
    text: 'Tanpa iklan',
    color: 'text-red-500',
  },
];

const stats = [
  { value: '15+', label: 'Kategori Bisnis' },
  { value: '5 menit', label: 'Setup Toko' },
  { value: 'Rp 0', label: 'Biaya Starter' },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function LogosSection() {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* VALUE PROPOSITIONS                                   */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mb-8">
          {values.map((value) => (
            <div
              key={value.text}
              className="flex items-center gap-2 text-sm md:text-base"
            >
              <value.icon className={`h-5 w-5 ${value.color}`} />
              <span className="text-muted-foreground">{value.text}</span>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* STATS (Real, not fake)                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
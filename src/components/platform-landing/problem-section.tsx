// ══════════════════════════════════════════════════════════════
// PROBLEM SECTION - V8.1 Copywriting
// "Pernah ngalamin ini?" - Emotional pain points
// ══════════════════════════════════════════════════════════════

import {
  Search,
  Smartphone,
  FileText,
  Pencil,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (Icons instead of emojis)
// ══════════════════════════════════════════════════════════════

const problems = [
  {
    icon: Search,
    title: '"Orang nyari, tapi gak ketemu"',
    description: 'Jualan atau nawarin jasa lewat story WA. Yang liat? Cuma yang udah save nomor. Orang baru? Gimana mau nemuin kamu?',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Smartphone,
    title: '"Ribet mau pesen atau booking"',
    description: 'Pelanggan mau order atau booking... Tapi harus save nomor dulu, baru bisa buka WhatsApp. Banyak langkah = males duluan.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: FileText,
    title: '"Order atau booking sering ketuker"',
    description: '"Bu, tadi saya pesen yang mana ya?" "Mas, booking jam berapa ya?" Dari chat gak ada catetan rapi. Kalau rame? Pusing.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Pencil,
    title: '"Bingung mau nulis apa"',
    description: 'Mau bikin deskripsi usaha... blank. Mau nulis keterangan layanan... mentok. Tau mau nawarin apa, tapi nyampeinnya yang susah.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Pernah ngalamin ini?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Usaha Bagus, Tapi Susah Dicari
          </h2>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* PROBLEM CARDS                                        */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem) => (
            <Card
              key={problem.title}
              className="border-none shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl ${problem.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <problem.icon className={`h-6 w-6 ${problem.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* TRANSITION TEXT                                      */}
        {/* ════════════════════════════════════════════════════ */}
        <p className="text-center text-muted-foreground mt-12 text-lg">
          Kalau satu aja yang relate...
          <br />
          <span className="text-foreground font-medium">
            tenang, ada cara yang lebih enak.
          </span>
        </p>
      </div>
    </section>
  );
}
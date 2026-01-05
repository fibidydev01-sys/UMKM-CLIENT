import {
  MessageSquareX,
  Clock,
  Wallet,
  BarChart2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const problems = [
  {
    icon: MessageSquareX,
    title: 'Jualan Cuma di WA Status',
    description: 'Produk tenggelam dalam 24 jam. Pelanggan harus scroll jauh untuk lihat katalog lengkap.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Clock,
    title: 'Order Masuk Berantakan',
    description: 'Chat campur aduk, sering lupa follow up, data pelanggan tidak tersimpan rapi.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Wallet,
    title: 'Bikin Website Mahal',
    description: 'Mau bikin toko online sendiri butuh jutaan rupiah dan skill teknis yang tidak punya.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: BarChart2,
    title: 'Tidak Tahu Performa',
    description: 'Berapa omzet bulan ini? Produk mana yang laris? Tidak ada data yang jelas.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">
            Masalah
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Pernah Mengalami Ini?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Banyak UMKM menghadapi tantangan yang sama saat ingin go digital
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem) => (
            <Card
              key={problem.title}
              className="border-none shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${problem.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <problem.icon className={`h-6 w-6 ${problem.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
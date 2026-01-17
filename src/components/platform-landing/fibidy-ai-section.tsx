'use client';

import { useState } from 'react';
import {
  Bot,
  User,
  Wrench,
  Cake,
  Scissors,
  Dog,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (4 Dialog Examples) - NO EMOJIS
// ══════════════════════════════════════════════════════════════

const dialogExamples = [
  {
    id: 'bengkel',
    category: 'Bengkel Motor',
    icon: Wrench,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    conversation: [
      {
        role: 'user',
        message: 'Fibidy, gue punya bengkel motor. Bantuin bikin deskripsi dong',
      },
      {
        role: 'ai',
        message: 'Bengkel motor! Oke, sebelum gue bantuin:\n— Service apa aja? Ganti oli, tune up, body repair?\n— Terima motor apa? Semua atau spesialis?\n— Mau kesannya gimana? Profesional? Terjangkau?',
      },
      {
        role: 'user',
        message: 'Service umum, ganti oli, tune up. Semua motor. Profesional',
      },
      {
        role: 'ai',
        message: 'Sip! Ini pilihannya:',
        options: [
          'Bengkel motor terpercaya untuk semua merk. Service rutin, ganti oli, tune up dikerjakan mekanik berpengalaman.',
          'Motor bermasalah? Serahin ke kami. Dari service ringan sampe tune up, semua ditangani dengan teliti.',
        ],
      },
    ],
  },
  {
    id: 'kue',
    category: 'Toko Kue',
    icon: Cake,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    conversation: [
      {
        role: 'user',
        message: 'Fibidy, gue jualan kue kering lebaran. Bantuin caption dong',
      },
      {
        role: 'ai',
        message: 'Kue kering lebaran! Boleh tau:\n— Kue apa aja? Nastar, kastengel, putri salju?\n— Homemade atau produksi?\n— Target siapa? Keluarga? Corporate?',
      },
      {
        role: 'user',
        message: 'Nastar, kastengel, lidah kucing. Homemade. Keluarga',
      },
      {
        role: 'ai',
        message: 'Mantap! Ini pilihannya:',
        options: [
          'Kue kering homemade untuk lebaran keluarga. Nastar lembut, kastengel gurih, lidah kucing renyah. Dibuat dengan cinta, diantar dengan aman.',
          'Lebaran makin lengkap dengan kue buatan rumah. Resep turun-temurun, rasa yang bikin kangen.',
        ],
      },
    ],
  },
  {
    id: 'salon',
    category: 'Salon',
    icon: Scissors,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    conversation: [
      {
        role: 'user',
        message: 'Gue punya salon. Bantuin bikin promo potong rambut',
      },
      {
        role: 'ai',
        message: 'Salon! Oke, promonya gimana?\n— Diskon berapa persen? Atau harga khusus?\n— Berlaku kapan? Ada syaratnya?\n— Mau kesannya eksklusif atau ramah semua?',
      },
      {
        role: 'user',
        message: 'Diskon 20% weekend ini aja. Ramah semua',
      },
      {
        role: 'ai',
        message: 'Oke! Ini pilihannya:',
        options: [
          'Weekend Special! Potong rambut diskon 20%. Sabtu-Minggu ini aja. Yuk, refresh tampilan!',
          'Mau gaya baru? Pas banget! Diskon 20% potong rambut weekend ini. Booking sekarang sebelum slot penuh!',
        ],
      },
    ],
  },
  {
    id: 'petshop',
    category: 'Pet Shop',
    icon: Dog,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    conversation: [
      {
        role: 'user',
        message: 'Gue punya pet shop, jual makanan + grooming. Bantuin deskripsi toko',
      },
      {
        role: 'ai',
        message: 'Pet shop! Lengkap ya, produk + jasa.\n— Fokusnya hewan apa? Anjing, kucing, atau semua?\n— Grooming-nya include apa aja?\n— Mau kesannya gimana?',
      },
      {
        role: 'user',
        message: 'Anjing kucing. Grooming lengkap. Friendly',
      },
      {
        role: 'ai',
        message: 'Sip! Ini pilihannya:',
        options: [
          'One-stop shop untuk anjing & kucing kesayangan. Makanan premium, aksesoris lucu, plus grooming lengkap. Karena mereka layak yang terbaik!',
          'Pet shop yang ngerti kebutuhan anabul kamu. Dari makanan sampe grooming, semua ada. Yuk, mampir!',
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

function ChatBubble({
  role,
  message,
  options,
}: {
  role: 'user' | 'ai';
  message: string;
  options?: string[];
}) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary/10' : 'bg-gradient-to-br from-primary to-pink-500'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted rounded-tl-sm'
        )}
      >
        <p className="text-sm whitespace-pre-line">{message}</p>

        {/* AI Options */}
        {options && (
          <div className="mt-3 space-y-2">
            {options.map((option, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-background/50 border text-sm"
              >
                <span className="font-medium text-primary">{idx + 1}.</span>{' '}
                <span className="text-foreground">&quot;{option}&quot;</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">Mau yang mana?</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function FibidyAISection() {
  const [activeExample, setActiveExample] = useState(dialogExamples[0]);

  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 gap-2">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Fitur Unggulan</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bingung Mau Nulis Apa?
            <br />
            <span className="text-primary">Ada Fibidy AI</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Asisten yang bantuin kamu rangkai kata.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* MAIN CONTENT                                         */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* LEFT - COPY */}
          <div>
            <div className="text-muted-foreground space-y-4 mb-8 leading-relaxed">
              <p>
                Pernah gak sih, mau nulis deskripsi usaha tapi blank?
                <br />
                Mau bikin keterangan layanan tapi mentok?
              </p>

              <p className="text-foreground font-medium text-lg">
                &quot;Ini enaknya ditulis gimana ya?&quot;
              </p>

              <p>Fibidy AI ada buat itu.</p>

              <p>Tinggal ceritain aja:</p>

              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Kamu nawarin apa (produk/jasa)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Pelanggannya siapa</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Mau kesannya gimana</span>
                </li>
              </ul>

              <p>
                Fibidy AI kasih beberapa pilihan.
                <br />
                Kamu tinggal pilih atau edit.
              </p>

              <p className="text-foreground font-medium">
                Gak perlu jago nulis.
                <br />
                Fibidy AI bantuin cariin kata-katanya.
              </p>
            </div>

            {/* Category Tabs - ICONS instead of emojis */}
            <div className="flex flex-wrap gap-2">
              {dialogExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => setActiveExample(example)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                    activeExample.id === example.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  <example.icon className="h-4 w-4" />
                  <span>{example.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT - CHAT DIALOG */}
          <div>
            <Card className="border-2">
              <CardContent className="p-0">
                {/* Chat Header */}
                <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      activeExample.bgColor
                    )}
                  >
                    <activeExample.icon className={cn('h-5 w-5', activeExample.color)} />
                  </div>
                  <div>
                    <p className="font-semibold">{activeExample.category}</p>
                    <p className="text-xs text-muted-foreground">Contoh percakapan</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {activeExample.conversation.map((msg, idx) => (
                    <ChatBubble
                      key={idx}
                      role={msg.role as 'user' | 'ai'}
                      message={msg.message}
                      options={msg.options}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer - ICON instead of emoji */}
            <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-yellow-500" />
              Fibidy AI ahlinya nulis, bukan bikin desain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
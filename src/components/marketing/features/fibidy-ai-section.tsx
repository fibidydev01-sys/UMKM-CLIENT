'use client';

// ══════════════════════════════════════════════════════════════
// FIBIDY AI SECTION - V10.1
// No Lucide except Bot/User avatar icons
// ══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Bot, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib';

const dialogExamples = [
  {
    id: 'bengkel',
    category: 'Bengkel Motor',
    conversation: [
      { role: 'user', message: 'Fibidy, gue punya bengkel motor. Bantuin bikin deskripsi dong' },
      { role: 'ai', message: 'Bengkel motor! Oke, sebelum gue bantuin:\n— Service apa aja?\n— Terima motor apa?\n— Mau kesannya gimana?' },
      { role: 'user', message: 'Service umum, ganti oli, tune up. Semua motor. Profesional' },
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
    conversation: [
      { role: 'user', message: 'Fibidy, gue jualan kue kering. Bantuin caption dong' },
      { role: 'ai', message: 'Kue kering! Boleh tau:\n— Kue apa aja?\n— Homemade atau produksi?\n— Target siapa?' },
      { role: 'user', message: 'Nastar, kastengel. Homemade. Keluarga' },
      {
        role: 'ai',
        message: 'Mantap! Ini pilihannya:',
        options: [
          'Kue kering homemade untuk lebaran keluarga. Nastar lembut, kastengel gurih. Dibuat dengan cinta.',
          'Lebaran makin lengkap dengan kue buatan rumah. Resep turun-temurun, rasa yang bikin kangen.',
        ],
      },
    ],
  },
  {
    id: 'salon',
    category: 'Salon',
    conversation: [
      { role: 'user', message: 'Gue punya salon. Bantuin bikin promo potong rambut' },
      { role: 'ai', message: 'Salon! Promonya gimana?\n— Diskon berapa?\n— Berlaku kapan?\n— Mau kesannya gimana?' },
      { role: 'user', message: 'Diskon 20% weekend ini. Ramah semua' },
      {
        role: 'ai',
        message: 'Oke! Ini pilihannya:',
        options: [
          'Weekend Special! Potong rambut diskon 20%. Sabtu-Minggu ini aja.',
          'Mau gaya baru? Diskon 20% potong rambut weekend ini. Booking sekarang!',
        ],
      },
    ],
  },
  {
    id: 'petshop',
    category: 'Pet Shop',
    conversation: [
      { role: 'user', message: 'Gue punya pet shop, jual makanan + grooming. Bantuin deskripsi' },
      { role: 'ai', message: 'Pet shop! Lengkap ya.\n— Fokusnya hewan apa?\n— Grooming include apa?\n— Mau kesannya gimana?' },
      { role: 'user', message: 'Anjing kucing. Grooming lengkap. Friendly' },
      {
        role: 'ai',
        message: 'Sip! Ini pilihannya:',
        options: [
          'One-stop shop untuk anjing & kucing kesayangan. Makanan premium plus grooming lengkap.',
          'Pet shop yang ngerti kebutuhan anabul kamu. Dari makanan sampe grooming, semua ada.',
        ],
      },
    ],
  },
];

function ChatBubble({ role, message, options }: {
  role: 'user' | 'ai';
  message: string;
  options?: string[];
}) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-primary/10' : 'bg-primary'
      )}>
        {isUser
          ? <User className="h-4 w-4 text-primary" />
          : <Bot className="h-4 w-4 text-primary-foreground" />
        }
      </div>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        isUser ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'
      )}>
        <p className="text-sm whitespace-pre-line">{message}</p>
        {options && (
          <div className="mt-3 space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-background/50 border text-sm">
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

export function FibidyAISection() {
  const [activeExample, setActiveExample] = useState(dialogExamples[0]);

  return (
    <section id="ai" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Fibidy AI
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Bingung mau nulis apa?
          </h2>
          <p className="text-lg text-muted-foreground">
            Ceritain aja ke Fibidy AI.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <Separator />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">

          {/* Left - Copy */}
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Nawarin apa. Pelanggannya siapa.</p>
            <p>Mau kesannya gimana.</p>
            <p>Fibidy AI kasih pilihannya.<br />Kamu tinggal pilih atau edit.</p>
            <p className="text-foreground font-medium">
              Gak perlu jago nulis.<br />
              Fibidy AI bantuin cariin kata-katanya.
            </p>

            {/* Category Tabs — pure text, no icon */}
            <div className="flex flex-wrap gap-2 pt-4">
              {dialogExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => setActiveExample(example)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    activeExample.id === example.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  {example.category}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Chat */}
          <Card className="border">
            <CardContent className="p-0">
              {/* Card header — pure text, no icon */}
              <div className="p-4 border-b bg-muted/30">
                <p className="font-semibold">{activeExample.category}</p>
                <p className="text-xs text-muted-foreground">Contoh percakapan</p>
              </div>
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

        </div>

        {/* Footer note */}
        <div className="max-w-4xl mx-auto mt-12">
          <Separator />
          <p className="text-xs text-muted-foreground mt-6">
            ✦ Fibidy AI ahlinya nulis, bukan bikin desain.
          </p>
        </div>

      </div>
    </section>
  );
}
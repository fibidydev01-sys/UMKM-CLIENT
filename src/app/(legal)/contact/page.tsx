// ══════════════════════════════════════════════════════════════
// CONTACT PAGE V13.1 Raycast Standard
// Editorial rows, auto-cycle, no Badge, no em-dash
// ══════════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib';

const contacts = [
  {
    label: 'Email',
    value: 'admin@fibidy.com',
    href: 'mailto:admin@fibidy.com',
    desc: 'Untuk semua pertanyaan umum, teknis, dan legal. Respons dalam 1x24 Hari Kerja.',
  },
  {
    label: 'Instagram',
    value: '@fibidy_com',
    href: 'https://instagram.com/fibidy_com',
    desc: 'Update fitur, inspirasi situs, dan pengumuman terbaru.',
  },
  {
    label: 'TikTok',
    value: '@fibidy.com',
    href: 'https://tiktok.com/@fibidy.com',
    desc: 'Konten edukatif seputar jualan online dan tips UMKM digital.',
  },
  {
    label: 'X / Twitter',
    value: '@fibidy42581',
    href: 'https://twitter.com/fibidy42581',
    desc: 'Pengumuman dan update platform.',
  },
];

const businessInfo = [
  { label: 'Nama Usaha', value: 'Fibidy' },
  { label: 'Inovator', value: 'Bayu Surya Pranata' },
  { label: 'NIB', value: '1203260002022', mono: true },
  { label: 'Alamat', value: 'Madiun, Jawa Timur, Indonesia' },
  { label: 'Platform', value: 'www.fibidy.com', mono: true },
];

const topics = [
  { label: 'Pertanyaan umum', href: '/faq', desc: 'Lihat FAQ dulu, mungkin sudah terjawab.' },
  { label: 'Masalah teknis', href: 'mailto:admin@fibidy.com', desc: 'Ceritakan masalahnya via email dengan detail.' },
  { label: 'Kerja sama & kemitraan', href: 'mailto:admin@fibidy.com', desc: 'Kirim proposal ke email kami.' },
  { label: 'Laporan pelanggaran', href: 'mailto:admin@fibidy.com', desc: 'Laporkan konten atau akun yang melanggar ketentuan.' },
  { label: 'Privasi & data', href: '/privacy', desc: 'Baca kebijakan privasi atau hubungi kami via email.' },
];

export default function ContactPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % contacts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">

        {/* Page Header */}
        <section className="pt-36 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
                Kontak
              </p>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                Hubungi
                <br />
                <span className="text-primary">kami.</span>
              </h1>

              <div className="w-px h-10 bg-border/60 mb-8" />

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Ada pertanyaan, saran, atau butuh bantuan? Tim Fibidy siap membantu.
              </p>

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        {/* Contact Channels */}
        <section className="py-24 md:py-36">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <div className="mb-16">
                <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
                  Saluran Kontak
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
                  Pilih yang paling nyaman.
                </h2>
              </div>

              {contacts.map((c, index) => {
                const isActive = hoveredIndex !== null
                  ? hoveredIndex === index
                  : activeIndex === index;
                const isLast = index === contacts.length - 1;

                return (
                  <div key={c.label}>
                    <div
                      className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr_auto] items-start md:items-center gap-6 cursor-default"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Number + vertical line */}
                      <div className="flex flex-col items-center">
                        <span className={cn(
                          'text-5xl md:text-6xl font-black select-none leading-none tabular-nums transition-colors duration-500 py-9 md:py-11',
                          isActive ? 'text-primary' : 'text-muted-foreground/20'
                        )}>
                          0{index + 1}
                        </span>
                        {!isLast && (
                          <div className={cn(
                            'w-px flex-1 min-h-[24px] transition-colors duration-500',
                            isActive ? 'bg-primary/40' : 'bg-border/40'
                          )} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="py-9 md:py-11">
                        <p className={cn(
                          'text-[10px] font-medium uppercase tracking-widest mb-2 transition-colors duration-500',
                          isActive ? 'text-muted-foreground' : 'text-muted-foreground/40'
                        )}>
                          {c.label}
                        </p>
                        <a
                          href={c.href}
                          target={c.href.startsWith('http') ? '_blank' : undefined}
                          rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className={cn(
                            'text-2xl md:text-3xl font-black tracking-tight hover:text-primary transition-colors duration-300',
                            isActive ? 'text-foreground' : 'text-foreground/40'
                          )}
                        >
                          {c.value}
                        </a>
                      </div>

                      {/* Desc desktop */}
                      <p className={cn(
                        'hidden md:block text-sm text-right max-w-[200px] leading-relaxed transition-colors duration-500',
                        isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                      )}>
                        {c.desc}
                      </p>
                    </div>

                    {/* Desc mobile */}
                    <p className={cn(
                      'md:hidden text-sm pb-9 -mt-6 transition-colors duration-500',
                      isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                    )}>
                      {c.desc}
                    </p>
                  </div>
                );
              })}

              <Separator className="bg-border/60" />

            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="py-24 md:py-36 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <div className="mb-16">
                <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
                  Topik
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
                  Mau tanya soal apa?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <a
                    key={topic.label}
                    href={topic.href}
                    className="group p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  >
                    <p className="font-black tracking-tight text-lg mb-1.5 group-hover:text-primary transition-colors duration-300">
                      {topic.label}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{topic.desc}</p>
                  </a>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Business Info */}
        <section className="py-24 md:py-36">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <div className="mb-16">
                <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
                  Informasi Usaha
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
                  Detail resmi.
                </h2>
              </div>

              <Separator className="bg-border/60" />

              <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                {businessInfo.map(({ label, value, mono }) => (
                  <div key={label}>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
                      {label}
                    </p>
                    <p className={`text-foreground font-semibold text-sm ${mono ? 'font-mono' : ''}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-border/60" />

              <div className="pt-8">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Verifikasi legalitas usaha kami di{' '}
                  <a
                    href="https://oss.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold hover:text-primary transition-colors"
                  >
                    oss.go.id
                  </a>
                  {' '}menggunakan NIB di atas. Atau lihat detail lengkap di{' '}
                  <Link href="/profile" className="text-foreground font-semibold hover:text-primary transition-colors">
                    halaman Profil
                  </Link>.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
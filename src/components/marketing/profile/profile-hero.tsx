'use client';

// ══════════════════════════════════════════════════════════════
// PROFIL HERO — V13.1 Raycast Standard
// Typewriter effect, meta strip, separator rhythm
// ══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const WORDS = ['UMKM lokal', 'situs online', 'usaha kecil', 'Indonesia'];

const META = [
  { label: 'Berdiri', value: 'Januari 2026' },
  { label: 'Status', value: 'Aktif & Legal' },
  { label: 'NIB', value: '1203260002022', mono: true },
  { label: 'Lokasi', value: 'Madiun, Jawa Timur' },
];

function useTypewriter(words: string[], typingMs = 90, deletingMs = 60, pauseMs = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const tick = () => {
      if (!deleting) {
        const next = word.slice(0, charIndex + 1);
        setDisplay(next);
        if (next === word) { setTimeout(() => setDeleting(true), pauseMs); return; }
        setCharIndex((c) => c + 1);
      } else {
        const next = word.slice(0, charIndex - 1);
        setDisplay(next);
        if (next === '') {
          setDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
          setCharIndex(0);
          return;
        }
        setCharIndex((c) => c - 1);
      }
    };
    const timer = setTimeout(tick, deleting ? deletingMs : typingMs);
    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex, words, typingMs, deletingMs, pauseMs]);

  return display;
}

export function ProfilHero() {
  const typed = useTypewriter(WORDS);

  return (
    <section className="pt-36 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
            Profil
          </p>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            Situs online untuk
            <br />
            <span className="text-primary inline-flex items-baseline gap-0">
              <span>{typed}</span>
              <span
                className="bg-primary ml-[3px] inline-block h-[0.85em] w-[3px] translate-y-[1px] animate-[blink_1s_step-end_infinite]"
                aria-hidden="true"
              />
            </span>
          </h1>

          <div className="w-px h-10 bg-border/60 mb-8" />

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mb-12">
            Fibidy hadir agar setiap pelaku usaha Indonesia bisa punya situs online yang serius —
            tanpa ribet, tanpa mahal, tanpa keahlian teknis.
          </p>

          <Separator className="bg-border/60 mb-10" />

          {/* Meta strip */}
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {META.map((m) => (
              <div key={m.label}>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
                  {m.label}
                </p>
                <p className={`text-foreground font-semibold text-sm ${m.mono ? 'font-mono' : ''}`}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { HeroFormData } from '@/types';

interface HintItem {
  title: string;
  description: string;
}

const HINTS: Record<string, HintItem> = {
  heroTitle: {
    title: 'Tips Hero Title',
    description: 'Headline utama yang pertama dilihat pengunjung. Buat semenarik dan sesingkat mungkin — maksimal 6 kata. Contoh: "Burger Premium Cita Rasa Asia Fusion"',
  },
  heroSubtitle: {
    title: 'Tips Subtitle',
    description: 'Satu kalimat pendek yang menjelaskan value toko kamu. Contoh: "Diantar dalam 30 menit, dijamin segar."',
  },
  description: {
    title: 'Tips Deskripsi Singkat',
    description: 'Tagline toko yang muncul di profil dan hasil pencarian. Ceritakan keunikan tokomu dalam 1–2 kalimat. Contoh: "Kami menghadirkan burger premium dengan bahan lokal pilihan dan cita rasa Asia fusion yang autentik."',
  },
};

interface StepCeritaProps {
  formData: HeroFormData;
  updateFormData: <K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) => void;
}

export function StepCerita({ formData, updateFormData }: StepCeritaProps) {
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const openHint = (key: string) => setActiveHint(key);
  const closeHint = () => setActiveHint(null);

  return (
    <>
      {/* ── Hint Modal ── */}
      <Dialog open={!!activeHint} onOpenChange={closeHint}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{activeHint ? HINTS[activeHint].title : ''}</DialogTitle>
            <DialogDescription>{activeHint ? HINTS[activeHint].description : ''}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ── Carousel ── */}
      <div className="flex justify-center px-8">
        <Carousel className="w-full max-w-sm">
          <CarouselContent>

            {/* ── Card 1: Hero Title ── */}
            <CarouselItem>
              <Card>
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <FieldLabel htmlFor="heroTitle" className="text-center">
                      Hero Title
                    </FieldLabel>
                    <button type="button" onClick={() => openHint('heroTitle')}>
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                  <Textarea
                    id="heroTitle"
                    placeholder="Tulis judul utama toko kamu..."
                    value={formData.heroTitle}
                    onChange={(e) => updateFormData('heroTitle', e.target.value)}
                    className="text-center resize-none"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </CarouselItem>

            {/* ── Card 2: Subtitle ── */}
            <CarouselItem>
              <Card>
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <FieldLabel htmlFor="heroSubtitle" className="text-center">
                      Subtitle
                    </FieldLabel>
                    <button type="button" onClick={() => openHint('heroSubtitle')}>
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                  <Textarea
                    id="heroSubtitle"
                    placeholder="Tulis kalimat singkat nilai toko kamu..."
                    value={formData.heroSubtitle}
                    onChange={(e) => updateFormData('heroSubtitle', e.target.value)}
                    className="text-center resize-none"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </CarouselItem>

            {/* ── Card 3: Deskripsi ── */}
            <CarouselItem>
              <Card>
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <FieldLabel htmlFor="store-description" className="text-center">
                      Deskripsi Singkat
                    </FieldLabel>
                    <button type="button" onClick={() => openHint('description')}>
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                  <Textarea
                    id="store-description"
                    placeholder="Tulis tagline unik toko kamu di sini..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    className="text-center resize-none"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </CarouselItem>

          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}
// ══════════════════════════════════════════════════════════════
// FAQ SECTION — V13.1 Raycast Standard
// Dipakai di: about, how-it-works, pricing page
// No Badge, editorial label, separator rhythm
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const faqs = [
  {
    question: 'Fibidy bisa buat jasa?',
    answer: 'Bisa. Bengkel. Laundry. Salon. 41 kategori.',
  },
  {
    question: 'Perlu kartu kredit?',
    answer: 'Tidak. Gratis langsung pakai.',
  },
  {
    question: 'Berapa lama bikin situs?',
    answer: 'Hitungan menit. Daftar. Isi. Live.',
  },
  {
    question: 'Bisa terima booking?',
    answer: 'Bisa. Pelanggan pilih layanan, tap booking, langsung masuk ke kamu.',
  },
  {
    question: 'Data aman?',
    answer: 'Semua dienkripsi. Backup otomatis tiap hari.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
                Sering ditanya
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
                Ada yang mau ditanya?
              </h2>
            </div>
            <Button variant="outline" asChild className="w-fit shrink-0 border-border/60">
              <Link href="/contact">Hubungi Kami</Link>
            </Button>
          </div>

          <Separator className="bg-border/60" />

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/60 last:border-b-0"
              >
                <AccordionTrigger className="text-left hover:no-underline py-7 text-lg font-black tracking-tight hover:text-primary transition-colors duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-7 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Separator className="bg-border/60" />

        </div>
      </div>
    </section>
  );
}
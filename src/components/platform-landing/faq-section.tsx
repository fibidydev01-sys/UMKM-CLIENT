// ══════════════════════════════════════════════════════════════
// FAQ SECTION - V8.1 Copywriting
// Questions about Fibidy for Produk & Jasa
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { HelpCircle, MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting
// ══════════════════════════════════════════════════════════════

const faqs = [
  {
    question: 'Fibidy bisa buat jasa, bukan cuma produk?',
    answer: 'Bisa! Ada 15+ kategori: bengkel, laundry, salon, service AC, fotografi, gym, kost, dll. Pilih pas daftar.',
  },
  {
    question: 'Label-nya bisa disesuaikan?',
    answer: 'Otomatis sesuai kategori. "Produk" bisa jadi "Layanan", "Menu", "Paket", "Kamar", dll. "Pelanggan" bisa jadi "Klien", "Member", "Penghuni".',
  },
  {
    question: 'Fibidy AI bisa bantuin nulis untuk jasa?',
    answer: 'Bisa! Mau deskripsi bengkel, promo salon, caption layanan laundry Fibidy AI bantuin cariin kata-katanya.',
  },
  {
    question: 'Booking bisa ke WhatsApp juga?',
    answer: 'Bisa! Sama kayak order produk, booking jasa juga langsung redirect ke WhatsApp kamu dengan detail lengkap.',
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan untuk membuat toko?',
    answer: 'Hanya 5 menit! Cukup daftar dengan email dan nomor WhatsApp, isi informasi toko, tambahkan produk/layanan pertama, dan toko kamu langsung online.',
  },
  {
    question: 'Apakah perlu kartu kredit untuk mendaftar?',
    answer: 'Tidak. Kamu bisa daftar dan pakai Starter tanpa kartu kredit sama sekali. Pembayaran hanya diperlukan kalau mau upgrade ke Business nanti.',
  },
  {
    question: 'Bagaimana cara pelanggan memesan di toko saya?',
    answer: 'Pelanggan bisa browse produk/layanan di toko online kamu, pilih yang mau dipesan, lalu checkout via WhatsApp. Pesanan lengkap dengan detail produk, jumlah, dan total harga akan langsung masuk ke WhatsApp kamu.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Keamanan adalah prioritas utama kami. Semua data dienkripsi dengan standar industri (SSL/TLS), kami melakukan backup otomatis setiap hari, dan server kami menggunakan infrastruktur cloud yang terpercaya.',
  },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang Fibidy
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* ACCORDION                                            */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-xl px-6 data-[state=open]:bg-muted/30 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* CONTACT CTA                                          */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-muted/50 border">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold">Masih punya pertanyaan?</p>
              <p className="text-sm text-muted-foreground">
                Tim kami siap membantu kamu
              </p>
            </div>
            <Button variant="outline" asChild className="sm:ml-4">
              <Link href="/contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
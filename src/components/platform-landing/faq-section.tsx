import Link from 'next/link';
import { HelpCircle, MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'Apakah Fibidy benar-benar gratis?',
    answer: 'Ya! Paket Gratis kami benar-benar gratis selamanya. Anda bisa membuat toko online, menambah hingga 50 produk, dan menerima pesanan via WhatsApp tanpa biaya apapun. Tidak ada trial, tidak ada batas waktu.',
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan untuk membuat toko?',
    answer: 'Hanya 5 menit! Cukup daftar dengan email dan nomor WhatsApp, isi informasi toko, tambahkan produk pertama Anda, dan toko Anda langsung online. Tidak perlu skill teknis atau coding apapun.',
  },
  {
    question: 'Apakah saya perlu kartu kredit untuk mendaftar?',
    answer: 'Tidak. Anda bisa mendaftar dan menggunakan paket Gratis tanpa kartu kredit sama sekali. Pembayaran hanya diperlukan jika Anda ingin upgrade ke paket Premium nanti.',
  },
  {
    question: 'Bagaimana cara pelanggan memesan di toko saya?',
    answer: 'Pelanggan bisa browse produk di toko online Anda, menambahkan ke keranjang, lalu checkout via WhatsApp. Pesanan lengkap dengan detail produk, jumlah, dan total harga akan langsung masuk ke WhatsApp Anda. Simple dan familiar untuk pelanggan Indonesia.',
  },
  {
    question: 'Apakah saya bisa menggunakan domain sendiri?',
    answer: 'Fitur custom domain akan tersedia di paket Premium yang segera hadir. Untuk saat ini dengan paket Gratis, toko Anda menggunakan subdomain fibidy.com/store/nama-toko yang sudah cukup profesional.',
  },
  {
    question: 'Bagaimana jika saya butuh bantuan?',
    answer: 'Tim support kami siap membantu via email untuk semua pengguna. Kami juga menyediakan dokumentasi lengkap dan video tutorial untuk membantu Anda memaksimalkan penggunaan Fibidy.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Keamanan adalah prioritas utama kami. Semua data dienkripsi dengan standar industri (SSL/TLS), kami melakukan backup otomatis setiap hari, dan server kami menggunakan infrastruktur cloud yang terpercaya. Data Anda 100% milik Anda.',
  },
  {
    question: 'Kapan paket Premium akan tersedia?',
    answer: 'Paket Premium sedang dalam tahap pengembangan dan akan segera diluncurkan. Anda bisa mendaftar waiting list saat registrasi untuk mendapatkan notifikasi dan penawaran khusus saat Premium diluncurkan.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
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

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-muted/50 border">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold">Masih punya pertanyaan?</p>
              <p className="text-sm text-muted-foreground">
                Tim kami siap membantu Anda
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
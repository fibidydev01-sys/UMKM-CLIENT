// ══════════════════════════════════════════════════════════════
// FAQ PAGE V14.0 Fibidy
// Rebuild: Xendit-confirmed, Business launched, SEO jujur, no boomerang
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'FAQ Fibidy',
  description: 'Pertanyaan yang sering ditanya seputar Fibidy. Cara daftar, fitur, harga, keamanan, dan lainnya.',
  openGraph: {
    title: 'FAQ Fibidy',
    description: 'Pertanyaan yang sering ditanya seputar Fibidy.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  category: string;
  items: FaqItem[];
}

const faqs: FaqGroup[] = [
  {
    category: 'Tentang Fibidy',
    items: [
      {
        question: 'Apa itu Fibidy?',
        answer: 'Fibidy adalah platform situs online berbasis langganan (SaaS) untuk UMKM Indonesia. Kamu bisa bikin situs online sendiri dalam hitungan menit, tanpa ngoding, tanpa modal gede, tanpa keahlian teknis. Fibidy bukan marketplace kami menyediakan infrastruktur digital agar usahamu punya kehadiran online yang profesional.',
      },
      {
        question: 'Apakah Fibidy resmi dan legal?',
        answer: 'Ya. Fibidy beroperasi dengan Nomor Induk Berusaha (NIB) resmi yang diterbitkan oleh sistem OSS Kementerian Investasi RI. NIB: 1203260002022. Kamu bisa verifikasi langsung di oss.go.id.',
      },
      {
        question: 'Siapa yang bisa pakai Fibidy?',
        answer: 'Pelaku usaha yang telah berusia minimal 17 tahun atau cakap hukum sesuai peraturan yang berlaku. Dari warung kelontong, bengkel motor, salon, laundry, catering, sampai fotografi dan pet shop. Ada banyak kategori bisnis tersedia, termasuk opsi "Lainnya" jika kategorimu belum ada.',
      },
      {
        question: 'Apakah Fibidy hanya untuk Madiun?',
        answer: 'Tidak. Fibidy adalah platform nasional untuk seluruh UMKM Indonesia. Platform kami lahir di Madiun, tapi dirancang dan tersedia untuk seluruh pelaku usaha di Indonesia.',
      },
      {
        question: 'Apakah Fibidy marketplace atau e-commerce?',
        answer: 'Bukan keduanya. Fibidy adalah platform penyedia situs online (SaaS). Kami tidak mempertemukan penjual dan pembeli, tidak memproses transaksi jual beli, dan tidak mengambil komisi dari penjualanmu. Fibidy hanya menyediakan infrastruktur digital situsmu, katalogmu, tampilan brandmu.',
      },
    ],
  },
  {
    category: 'Daftar & Memulai',
    items: [
      {
        question: 'Bagaimana cara daftar Fibidy?',
        answer: 'Kunjungi fibidy.com, klik "Buat Situs", isi informasi dasar usahamu, pilih kategori, dan ikuti panduan langkah demi langkah. Rata-rata pengguna punya situs aktif dalam beberapa menit pertama.',
      },
      {
        question: 'Perlu kartu kredit untuk daftar?',
        answer: 'Tidak. Paket Starter sepenuhnya gratis dan tidak memerlukan informasi pembayaran apapun. Kamu bisa mulai langsung tanpa kartu kredit.',
      },
      {
        question: 'Berapa lama bikin situs?',
        answer: 'Hitungan menit. Daftar, isi informasi dasar, tambahkan produk atau layanan, dan situsmu langsung bisa diakses. Tidak perlu konfigurasi teknis apapun.',
      },
      {
        question: 'Perlu keahlian teknis atau desain?',
        answer: 'Tidak perlu. Fibidy dirancang berdasarkan prinsip kemudahan penggunaan. Semua dilakukan secara visual pilih dan isi tanpa coding, tanpa desain grafis.',
      },
    ],
  },
  {
    category: 'Fitur Platform',
    items: [
      {
        question: 'Seperti apa alamat situs saya?',
        answer: 'Di Paket Starter kamu mendapatkan subdomain namakamu.fibidy.com secara gratis. Di Paket Business kamu bisa menghubungkan domain kustom milikmu sendiri seperti namakamu.com. Domain kustom dibeli dan dikelola secara mandiri oleh kamu melalui registrar pilihanmu Fibidy membantu proses koneksinya.',
      },
      {
        question: 'Apakah situs saya bisa tampil di Google?',
        answer: 'Bisa, tapi tidak dijamin. Setiap situs Fibidy dilengkapi dengan pengaturan SEO dasar seperti meta title dan meta description yang bisa kamu isi. Namun posisi di hasil pencarian Google ditentukan sepenuhnya oleh algoritma Google bukan oleh Fibidy. Makin lengkap dan relevan konten yang kamu isi, makin besar peluangnya. Tapi kami tidak bisa menjanjikan peringkat tertentu.',
      },
      {
        question: 'Bagaimana cara pelanggan memesan?',
        answer: 'Pelanggan membuka situsmu, melihat katalog produk atau layanan, lalu menghubungimu langsung melalui tautan WhatsApp yang kamu pasang. Seluruh proses negosiasi, konfirmasi, dan pembayaran dari pelanggan ke kamu terjadi langsung di antara kamu dan pelanggan di luar sistem Fibidy.',
      },
      {
        question: 'Apakah ada iklan di situs saya?',
        answer: 'Tidak ada. Fibidy tidak memasang iklan pihak ketiga di situsmu dalam bentuk apapun. Pelangganmu fokus sepenuhnya pada produk dan layananmu.',
      },
      {
        question: 'Berapa banyak produk yang bisa saya tambahkan?',
        answer: 'Paket Starter mendukung sejumlah produk atau layanan sesuai ketentuan yang berlaku saat ini. Batas ini dapat berubah sewaktu-waktu dengan pemberitahuan 30 hari sebelumnya. Paket Business mendukung produk tidak terbatas.',
      },
      {
        question: 'Apakah ada fitur landing page?',
        answer: 'Ya. Fibidy menyediakan fitur landing page yang dapat dikustomisasi, termasuk bagian hero, tentang usaha, produk/layanan, testimoni, dan kontak. Kamu bisa mengatur urutan dan konten setiap bagian sesuai kebutuhan usahamu.',
      },
    ],
  },
  {
    category: 'Harga & Pembayaran',
    items: [
      {
        question: 'Apakah Fibidy benar-benar gratis?',
        answer: 'Ya. Paket Starter sepenuhnya gratis, mencakup subdomain, katalog produk, halaman landing, checkout via WhatsApp, dan tanpa iklan. Tidak ada biaya tersembunyi dan tidak diperlukan kartu kredit.',
      },
      {
        question: 'Apakah ada komisi dari penjualan saya?',
        answer: 'Tidak ada. 0% komisi. Fibidy tidak mengambil bagian apapun dari transaksi antara kamu dan pelangganmu. Satu-satunya pembayaran kepada Fibidy adalah biaya berlangganan paket yang kamu pilih.',
      },
      {
        question: 'Apa bedanya Starter dan Business?',
        answer: 'Starter gratis: subdomain fibidy.com, katalog produk, halaman landing, semua fitur inti. Business berbayar: domain kustom milikmu sendiri, produk tidak terbatas, dan fitur tambahan lainnya. Detail lengkap tersedia di halaman harga.',
      },
      {
        question: 'Berapa harga Paket Business?',
        answer: 'Paket Business tersedia dengan siklus penagihan bulanan dan tahunan. Harga terkini dapat dilihat di halaman harga Fibidy. Harga dapat berubah dengan pemberitahuan 30 hari sebelumnya kepada pelanggan aktif.',
      },
      {
        question: 'Metode pembayaran apa yang diterima?',
        answer: 'Pembayaran Paket Business diproses melalui Xendit, payment gateway resmi berizin di Indonesia. Xendit mendukung berbagai metode pembayaran termasuk transfer bank, kartu kredit/debit, QRIS, dan dompet digital populer di Indonesia.',
      },
      {
        question: 'Apakah ada refund jika saya tidak puas?',
        answer: 'Seluruh pembayaran Paket Business bersifat final dan tidak dapat dikembalikan (non-refundable). Pengecualian hanya berlaku jika platform Fibidy mengalami gangguan teknis dari infrastruktur Fibidy sendiri yang menyebabkan platform tidak dapat diakses lebih dari 4 jam berturut-turut dan tidak terselesaikan dalam 48 jam. Detail lengkap ada di Syarat Layanan kami.',
      },
      {
        question: 'Apakah langganan diperpanjang otomatis?',
        answer: 'Ya. Paket Business diperpanjang otomatis setiap bulan atau tahun sesuai siklus yang dipilih. Fibidy mengirim notifikasi ke emailmu minimal 7 hari sebelum tanggal perpanjangan. Pembatalan harus dilakukan minimal 3 hari sebelum tanggal perpanjangan.',
      },
    ],
  },
  {
    category: 'Keamanan & Data',
    items: [
      {
        question: 'Apakah data situs saya aman?',
        answer: 'Fibidy menerapkan langkah keamanan teknis yang sesuai standar industri: enkripsi koneksi SSL/TLS, enkripsi kata sandi dengan bcrypt, dan infrastruktur database Supabase dengan isolasi data antar pengguna. Tidak ada sistem yang bisa menjamin keamanan absolut, tapi kami berupaya maksimal sesuai kapasitas yang ada.',
      },
      {
        question: 'Siapa yang memiliki data situs saya?',
        answer: 'Kamu. Seluruh konten toko produk, foto, deskripsi, logo, informasi bisnis adalah milikmu sepenuhnya. Fibidy hanya menyimpan dan menampilkannya atas instruksimu. Kami tidak menjual, tidak menyewakan, dan tidak menggunakan data tersebut untuk kepentingan komersial apapun di luar operasional platform.',
      },
      {
        question: 'Apakah Fibidy mengambil data pelanggan toko saya?',
        answer: 'Tidak. Interaksi antara situsmu dan pelangganmu melalui WhatsApp terjadi langsung di antara kamu dan pelanggan, di luar sistem Fibidy. Kami tidak memiliki akses ke percakapan tersebut dan tidak menyimpan data pelanggan tokomu.',
      },
      {
        question: 'Apakah saya bisa menghapus akun dan data saya?',
        answer: 'Ya. Kamu bisa menutup akun kapan saja melalui pengaturan akun atau dengan menghubungi kami di admin@fibidy.com. Penghapusan bersifat permanen seluruh data toko dihapus dari sistem dalam 30 hari. Pastikan kamu sudah menyimpan informasi yang diperlukan sebelum menutup akun karena data tidak dapat dipulihkan setelahnya.',
      },
      {
        question: 'Apa yang terjadi jika ada pelanggaran data?',
        answer: 'Jika terjadi insiden keamanan yang memengaruhi datamu, Fibidy akan memberitahumu melalui email terdaftar sesegera mungkin setelah insiden dikonfirmasi, sesuai ketentuan UU PDP No. 27/2022. Pemberitahuan mencakup deskripsi insiden, data yang terdampak, dan langkah yang kami ambil.',
      },
      {
        question: 'Apakah Fibidy mematuhi UU PDP?',
        answer: 'Ya. Kebijakan Privasi Fibidy disusun mengacu pada Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi. Kamu berhak mengakses, mengoreksi, atau meminta penghapusan datamu kapan saja dengan menghubungi admin@fibidy.com.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">

        {/* Page Header */}
        <section className="pt-36 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
                FAQ
              </p>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                Ada yang mau
                <br />
                <span className="text-primary">ditanya?</span>
              </h1>

              <div className="w-px h-10 bg-border/60 mb-8" />

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Pertanyaan yang paling sering muncul. Kalau belum terjawab, hubungi kami langsung.
              </p>

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        {/* FAQ Content */}
        <section className="py-24 md:py-36">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-20">
              {faqs.map((group) => (
                <div key={group.category}>

                  {/* Category label */}
                  <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-8">
                    {group.category}
                  </p>

                  <Accordion type="single" collapsible className="w-full">
                    {group.items.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${group.category}-${index}`}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-black tracking-tight hover:text-primary transition-colors duration-300">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Separator className="bg-border/60 mb-14" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <p className="text-xl font-black tracking-tight">Masih ada pertanyaan?</p>
                  <p className="text-muted-foreground text-sm mt-1">Tim kami siap membantu kamu.</p>
                </div>
                <Button size="lg" asChild className="shrink-0 h-12 px-8">
                  <Link href="/contact">
                    Hubungi Kami
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
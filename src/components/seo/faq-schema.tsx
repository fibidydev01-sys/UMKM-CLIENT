import { JsonLd } from './json-ld';
import { generateFAQSchema } from '@/lib/schema';

// ==========================================
// FAQ PAGE SCHEMA
// Used in: FAQ Page
// ==========================================

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const schema = generateFAQSchema(faqs);
  return <JsonLd data={schema} />;
}

// ==========================================
// DEFAULT PLATFORM FAQs
// ==========================================

export const defaultPlatformFAQs = [
  {
    question: 'Apakah Fibidy benar-benar gratis?',
    answer: 'Ya! Paket Gratis kami benar-benar gratis selamanya. Anda bisa membuat toko online, menambah hingga 50 produk, dan menerima pesanan via WhatsApp tanpa biaya apapun.',
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan untuk membuat toko?',
    answer: 'Hanya 5 menit! Cukup daftar, isi informasi toko, tambahkan produk, dan toko Anda langsung online. Tidak perlu skill teknis apapun.',
  },
  {
    question: 'Apakah saya perlu kartu kredit untuk mendaftar?',
    answer: 'Tidak. Anda bisa mendaftar dan menggunakan paket Gratis tanpa kartu kredit. Pembayaran hanya diperlukan jika Anda ingin upgrade ke paket berbayar.',
  },
  {
    question: 'Bagaimana cara pelanggan memesan di toko saya?',
    answer: 'Pelanggan bisa browse produk di toko Anda, menambahkan ke keranjang, lalu checkout via WhatsApp. Pesanan lengkap dengan detail produk akan langsung masuk ke WhatsApp Anda.',
  },
  {
    question: 'Apakah saya bisa menggunakan domain sendiri?',
    answer: 'Saat ini toko Anda menggunakan subdomain fibidy.com (contoh: namatoko.fibidy.com). Fitur custom domain akan tersedia di update mendatang.',
  },
  {
    question: 'Bagaimana jika saya butuh bantuan?',
    answer: 'Tim support kami siap membantu via WhatsApp dan email. Anda juga bisa mengakses dokumentasi lengkap di halaman bantuan.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Keamanan adalah prioritas kami. Semua data dienkripsi dan kami melakukan backup otomatis setiap hari. Data Anda 100% milik Anda.',
  },
];
// ══════════════════════════════════════════════════════════════
// TERMS PAGE V14.1 Fibidy
// Rebuild total: Xendit-ready, anti-boomerang, solo founder shield
// Semua lubang dari antilubang.md ditutup
// Fakta teknis dari Prisma schema dikonfirmasi
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Syarat Layanan Fibidy',
  description: 'Syarat dan ketentuan penggunaan platform Fibidy. Berlaku untuk seluruh pengguna platform Fibidy.',
  openGraph: {
    title: 'Syarat Layanan Fibidy',
    description: 'Syarat dan ketentuan penggunaan platform Fibidy.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

interface Section {
  number: string;
  title: string;
  content: string[];
  isList: boolean;
  listStart?: number;
  listEnd?: number;
}

const sections: Section[] = [
  {
    number: '00',
    title: 'Definisi.',
    content: [
      '"Fibidy" mengacu pada platform, layanan, website, dan seluruh produk yang dioperasikan oleh Bayu Surya Pranata di bawah nama usaha Fibidy, terdaftar dengan NIB 1203260002022, berdomisili di Madiun, Jawa Timur.',
      '"Pengguna" atau "Kamu" mengacu pada individu atau badan usaha yang mendaftar, mengakses, atau menggunakan layanan Fibidy dalam kapasitas apapun.',
      '"Pemilik Toko" atau "Tenant" mengacu pada Pengguna yang telah mendaftar dan membuat situs online di platform Fibidy dalam kapasitas sebagai pelaku usaha.',
      '"Toko" atau "Situs Tenant" mengacu pada halaman situs online yang dibuat dan dikelola oleh Pemilik Toko menggunakan platform Fibidy, dapat diakses melalui subdomain Fibidy atau domain kustom milik Pemilik Toko.',
      '"Layanan" mengacu pada seluruh fitur, fungsi, dan fasilitas yang disediakan oleh Fibidy kepada Pemilik Toko, termasuk namun tidak terbatas pada: pembuat situs online, manajemen katalog produk, manajemen subdomain, halaman landing yang dapat dikustomisasi, sistem domain kustom, dan fitur lain yang tersedia pada paket berlangganan yang dipilih.',
      '"Konten" atau "Materi" mengacu pada segala teks, gambar, foto, video, logo, data, dan informasi lainnya yang diunggah, dikirim, atau ditampilkan oleh Pemilik Toko melalui platform Fibidy.',
      '"Akun" mengacu pada akses terdaftar milik Pemilik Toko ke platform Fibidy, yang diidentifikasi dengan alamat email unik dan dilindungi dengan kata sandi.',
      '"Paket Berlangganan" mengacu pada tingkatan layanan yang tersedia di Fibidy, saat ini terdiri dari Paket Starter (gratis) dan Paket Business (berbayar).',
      '"Periode Berlangganan" mengacu pada jangka waktu aktif Paket Business yang dipilih oleh Pemilik Toko, yaitu satu bulan kalender atau satu tahun kalender, dihitung sejak tanggal pembayaran dikonfirmasi.',
      '"Subdomain" mengacu pada alamat situs berbentuk [namausaha].fibidy.com yang dialokasikan kepada Pemilik Toko sebagai bagian dari layanan Fibidy.',
      '"Domain Kustom" mengacu pada nama domain milik Pemilik Toko sendiri yang dihubungkan ke situs Fibidy melalui konfigurasi DNS yang disediakan oleh Fibidy.',
      '"Kode Redeem" mengacu pada kode akses unik yang diterbitkan oleh Fibidy yang dapat ditukarkan oleh Pemilik Toko untuk mendapatkan akses ke Paket Business dalam durasi tertentu.',
      '"Layanan Pihak Ketiga" mengacu pada layanan eksternal yang terintegrasi dengan platform Fibidy, termasuk namun tidak terbatas pada Xendit (pemrosesan pembayaran berlangganan), Vercel (infrastruktur hosting), Supabase (database), dan Cloudinary (penyimpanan media).',
      '"Materi Terlarang" mengacu pada konten, produk, atau layanan yang dilarang ditampilkan atau dipromosikan melalui platform Fibidy sebagaimana diatur dalam Pasal 03 Syarat Layanan ini.',
      '"Hari Kerja" mengacu pada hari Senin hingga Jumat, tidak termasuk hari libur nasional Republik Indonesia.',
      '"Insiden Keamanan" mengacu pada peristiwa yang mengakibatkan akses tidak sah, pengungkapan, perubahan, atau penghancuran data Pemilik Toko yang tersimpan di sistem Fibidy.',
    ],
    isList: false,
  },
  {
    number: '01',
    title: 'Penerimaan syarat.',
    content: [
      'Dengan mendaftar akun, mengakses, atau menggunakan platform Fibidy dalam bentuk apapun, kamu menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan dalam Syarat Layanan ini beserta seluruh kebijakan yang dirujuk di dalamnya, termasuk Kebijakan Privasi Fibidy.',
      'Jika kamu mendaftar atau menggunakan layanan Fibidy atas nama suatu badan usaha, maka kamu menyatakan bahwa kamu memiliki kewenangan hukum yang sah untuk mengikat badan usaha tersebut pada Syarat Layanan ini, dan badan usaha tersebut terikat oleh Syarat Layanan ini.',
      'Jika kamu tidak setuju dengan salah satu ketentuan dalam Syarat Layanan ini, kamu tidak diizinkan untuk mengakses atau menggunakan layanan Fibidy.',
      'Fibidy berhak memperbarui Syarat Layanan ini sewaktu-waktu. Perubahan yang bersifat material akan diberitahukan melalui email terdaftar atau notifikasi di platform minimal 7 (tujuh) hari sebelum berlaku. Penggunaan layanan yang berlanjut setelah perubahan berlaku dianggap sebagai persetujuan atas perubahan tersebut.',
      'Syarat Layanan ini ditulis dalam Bahasa Indonesia. Dalam hal terdapat terjemahan ke bahasa lain, versi Bahasa Indonesia adalah versi yang mengikat secara hukum.',
    ],
    isList: false,
  },
  {
    number: '02',
    title: 'Sifat layanan dan model bisnis.',
    content: [
      'Fibidy adalah platform penyedia situs online berbasis langganan (Software as a Service / SaaS) yang ditujukan khusus untuk pelaku usaha mikro, kecil, dan menengah (UMKM) di Indonesia.',
      'Fibidy menyediakan infrastruktur teknologi bagi Pemilik Toko untuk membangun dan mengelola kehadiran digital mereka. Fibidy bukan marketplace, bukan platform e-commerce, dan bukan perantara transaksi antara Pemilik Toko dan pelanggan akhir Pemilik Toko.',
      'Fibidy tidak memungut komisi, bagi hasil, atau biaya apapun atas transaksi yang terjadi antara Pemilik Toko dan pelanggan toko. Satu-satunya pembayaran kepada Fibidy adalah biaya berlangganan paket layanan yang dipilih oleh Pemilik Toko.',
      'Fibidy tidak memasang iklan pihak ketiga pada situs Pemilik Toko. Tampilan situs Pemilik Toko sepenuhnya bebas dari iklan yang ditempatkan oleh Fibidy.',
      'Fibidy bukan lembaga keuangan, bukan perusahaan asuransi, bukan penyelenggara sistem pembayaran, dan bukan entitas yang diatur oleh Otoritas Jasa Keuangan (OJK) atau Bank Indonesia (BI) dalam kapasitas sebagai penyelenggara jasa keuangan. Layanan pemrosesan pembayaran berlangganan dilakukan oleh Xendit selaku pihak ketiga yang memiliki izin resmi.',
      'Fibidy tidak bertanggung jawab atas keabsahan, legalitas, keamanan, kualitas, atau ketersediaan produk dan layanan yang ditawarkan oleh Pemilik Toko kepada pelanggan mereka.',
    ],
    isList: false,
  },
  {
    number: '03',
    title: 'Akun dan tanggung jawab pengguna.',
    content: [
      'Satu entitas (individu atau badan usaha) hanya dapat memiliki satu akun Fibidy aktif. Pembuatan akun ganda untuk menghindari pembatasan atau suspend yang diberlakukan oleh Fibidy adalah pelanggaran yang dapat mengakibatkan penghapusan seluruh akun yang bersangkutan.',
      'Kamu bertanggung jawab penuh atas keamanan akun, termasuk kerahasiaan kata sandi dan seluruh aktivitas yang terjadi di bawah akunmu, terlepas dari apakah aktivitas tersebut diotorisasi olehmu atau tidak.',
      'Kamu wajib memberikan informasi yang akurat, lengkap, dan terkini saat mendaftar, termasuk nama usaha, kategori usaha, nomor WhatsApp, dan alamat email aktif. Kamu wajib memperbarui informasi tersebut jika terjadi perubahan.',
      'Kamu bertanggung jawab atas seluruh konten yang diunggah ke platform, keakuratan informasi produk dan harga yang ditampilkan di situsmu, dan seluruh komunikasi antara situsmu dan pengunjung atau pelangganmu.',
      'Kamu wajib segera memberitahu Fibidy jika mengetahui adanya akses tidak sah ke akunmu atau Insiden Keamanan yang memengaruhi akunmu, melalui admin@fibidy.com. Fibidy tidak bertanggung jawab atas kerugian yang timbul akibat keterlambatan pelaporan.',
    ],
    isList: false,
  },
  {
    number: '04',
    title: 'Kebijakan penggunaan yang dapat diterima.',
    content: [
      'Kamu diizinkan menggunakan platform Fibidy untuk membuat dan mengelola situs online bagi kegiatan usaha yang sah sesuai hukum Republik Indonesia.',
      'Kamu tidak diizinkan menggunakan platform Fibidy untuk menampilkan, mempromosikan, atau memfasilitasi hal-hal berikut ini. Larangan ini bersifat mutlak dan tidak dapat dikesampingkan meskipun tidak disebutkan secara eksplisit setiap penggunaan yang bertentangan dengan hukum Republik Indonesia atau yang merugikan pihak lain dianggap melanggar ketentuan ini:',
      'Produk atau layanan yang ilegal berdasarkan hukum Indonesia, termasuk namun tidak terbatas pada narkotika dan psikotropika, senjata api dan bahan peledak, produk palsu atau bajakan, serta obat-obatan keras tanpa izin edar BPOM.',
      'Konten yang mengandung penipuan, klaim palsu, atau informasi yang menyesatkan konsumen mengenai produk, layanan, harga, atau identitas usaha.',
      'Pelanggaran hak kekayaan intelektual pihak lain, termasuk penggunaan merek dagang, hak cipta, atau aset visual milik pihak lain tanpa izin.',
      'Jasa keuangan tanpa izin OJK, termasuk pinjaman online ilegal, investasi bodong, skema piramida, atau penggalangan dana tanpa payung hukum yang jelas.',
      'Konten seksual eksplisit, konten pornografi, atau konten yang membahayakan atau mengeksploitasi anak di bawah umur dalam bentuk apapun.',
      'Konten yang mempromosikan kekerasan, terorisme, radikalisme, diskriminasi berdasarkan ras, agama, etnis, atau kelompok tertentu, atau ujaran kebencian.',
      'Informasi medis atau kesehatan yang menyesatkan, termasuk klaim penyembuhan yang tidak terverifikasi secara ilmiah.',
      'Pengumpulan data pribadi pengunjung situs tanpa dasar hukum yang sah atau tanpa pemberitahuan yang memadai.',
      'Aktivitas yang dapat merusak, mengganggu, atau membebani infrastruktur teknis platform Fibidy, termasuk penggunaan bot, scraping otomatis, atau serangan terhadap sistem.',
      'Peniruan identitas brand lain, platform lain, atau entitas resmi untuk menyesatkan pengunjung.',
      'Kegiatan lain yang bertentangan dengan peraturan perundang-undangan yang berlaku di Republik Indonesia.',
      'Fibidy berhak, tanpa pemberitahuan sebelumnya, untuk menghapus Materi Terlarang dari platform dan menangguhkan atau menghapus akun yang melanggar ketentuan di atas. Pemilik Toko yang akunnya ditangguhkan atau dihapus akibat pelanggaran tidak berhak atas pengembalian dana dalam bentuk apapun.',
    ],
    isList: true,
    listStart: 1,
    listEnd: 13,
  },
  {
    number: '05',
    title: 'Konten dan hak kekayaan intelektual.',
    content: [
      'Konten yang kamu unggah ke platform Fibidy termasuk foto produk, deskripsi layanan, logo, nama toko, dan informasi bisnis adalah milikmu sepenuhnya. Kamu mempertahankan seluruh hak atas konten tersebut.',
      'Dengan mengunggah Konten ke platform Fibidy, kamu memberikan Fibidy lisensi non-eksklusif, bebas royalti, untuk menyimpan, menampilkan, mendistribusikan, dan mereproduksi Konten tersebut semata-mata dalam rangka mengoperasikan dan meningkatkan layanan Fibidy. Lisensi ini berakhir secara otomatis ketika kamu menghapus Konten yang bersangkutan atau menutup akunmu.',
      'Kamu menyatakan dan menjamin bahwa: (a) kamu memiliki seluruh hak yang diperlukan atas Konten yang kamu unggah; (b) Konten tersebut tidak melanggar hak kekayaan intelektual, privasi, atau hak hukum lainnya dari pihak manapun; dan (c) Konten tersebut tidak mengandung Materi Terlarang sebagaimana diatur dalam Pasal 04.',
      'Fibidy berhak untuk menggunakan nama usaha dan tampilan situs Pemilik Toko sebagai referensi dalam materi marketing Fibidy, termasuk namun tidak terbatas pada studi kasus, portofolio, dan testimoni. Jika kamu tidak menginginkan hal ini, kamu dapat mengajukan keberatan secara tertulis ke admin@fibidy.com dan Fibidy akan menghormati permintaan tersebut.',
      'Nama "Fibidy", logo, merek dagang, dan seluruh aset visual platform adalah milik eksklusif Fibidy dan dilindungi oleh hukum yang berlaku. Kamu tidak diizinkan menggunakan, mereproduksi, atau mendistribusikan merek atau aset visual Fibidy tanpa izin tertulis sebelumnya.',
      'Dilarang melakukan rekayasa balik (reverse engineering), dekompilasi, atau ekstraksi sistematis terhadap kode, algoritma, atau basis data platform Fibidy dalam bentuk apapun.',
      'Jika kamu meyakini bahwa Konten di platform Fibidy melanggar hak kekayaan intelektualmu, harap hubungi kami di admin@fibidy.com dengan menyertakan: identitas lengkap pelapor, deskripsi karya yang diklaim dilanggar, lokasi spesifik konten yang dimaksud di platform, dan pernyataan bahwa laporan dibuat dengan itikad baik. Fibidy akan menindaklanjuti laporan yang valid dalam 5 (lima) Hari Kerja.',
    ],
    isList: false,
  },
  {
    number: '06',
    title: 'Paket berlangganan dan pembayaran.',
    content: [
      'Fibidy menyediakan dua paket layanan: Paket Starter yang tersedia gratis, dan Paket Business yang dikenakan biaya berlangganan.',
      'Paket Starter tersedia tanpa biaya selama akun aktif dan Pemilik Toko mematuhi Syarat Layanan ini. Fibidy berhak mengubah fitur, kuota, atau batasan yang tersedia pada Paket Starter dengan pemberitahuan minimal 30 (tiga puluh) hari sebelumnya melalui email terdaftar atau notifikasi di platform.',
      'Paket Business tersedia dengan siklus penagihan bulanan (setiap bulan kalender) atau tahunan (setiap tahun kalender). Harga yang berlaku adalah harga yang tercantum di halaman harga Fibidy pada saat kamu berlangganan.',
      'Pembayaran Paket Business diproses melalui Xendit selaku payment gateway resmi. Dengan berlangganan Paket Business, kamu mengotorisasi Fibidy untuk memproses pembayaran sesuai siklus penagihan yang dipilih.',
      'Paket Business diperpanjang secara otomatis pada akhir setiap Periode Berlangganan. Fibidy akan mengirimkan notifikasi perpanjangan ke alamat email terdaftar minimal 7 (tujuh) hari sebelum tanggal perpanjangan. Pembatalan harus dilakukan minimal 3 (tiga) hari sebelum tanggal perpanjangan untuk menghindari tagihan periode berikutnya.',
      'Pembatalan berlangganan dapat dilakukan kapan saja melalui pengaturan akun atau dengan menghubungi admin@fibidy.com. Pembatalan berlaku pada akhir Periode Berlangganan berjalan. Kamu tetap dapat menggunakan fitur Paket Business hingga akhir periode yang telah dibayar.',
      'Kode Redeem yang diterbitkan oleh Fibidy dapat ditukarkan untuk mendapatkan akses Paket Business dalam durasi yang tertera pada kode tersebut. Kode Redeem bersifat sekali pakai, tidak dapat dipindahtangankan, dan tidak dapat ditukar dengan uang tunai. Fibidy tidak bertanggung jawab atas Kode Redeem yang hilang, dicuri, atau disalahgunakan setelah diterbitkan.',
      'Seluruh harga yang tercantum adalah dalam Rupiah Indonesia (IDR) dan belum termasuk pajak yang mungkin berlaku. Kewajiban perpajakan atas transaksi berlangganan adalah tanggung jawab masing-masing pihak sesuai ketentuan hukum yang berlaku.',
    ],
    isList: false,
  },
  {
    number: '07',
    title: 'Kebijakan pengembalian dana.',
    content: [
      'Seluruh pembayaran Paket Business yang telah dikonfirmasi bersifat final dan tidak dapat dikembalikan (non-refundable), termasuk namun tidak terbatas pada: pembayaran yang dilakukan kemudian pengguna memutuskan untuk tidak menggunakan layanan, pembayaran untuk periode yang sudah berjalan meskipun dibatalkan di tengah periode, dan pembayaran yang dilakukan akibat lupa membatalkan auto-renewal.',
      'Pengecualian terhadap kebijakan di atas hanya berlaku apabila platform Fibidy mengalami gangguan teknis yang bersumber dari infrastruktur Fibidy sendiri (bukan dari Layanan Pihak Ketiga atau force majeure) yang menyebabkan platform tidak dapat diakses sama sekali selama lebih dari 4 (empat) jam berturut-turut dalam satu periode 24 jam, DAN gangguan tersebut tidak dapat diselesaikan dalam 48 (empat puluh delapan) jam sejak dilaporkan.',
      'Jika pengecualian di atas terpenuhi, pengembalian dana yang dapat diajukan terbatas pada jumlah proporsional hari yang terdampak dalam Periode Berlangganan berjalan, dihitung berdasarkan tarif harian dari harga paket yang dipilih.',
      'Untuk mengajukan pengembalian dana berdasarkan pengecualian di atas, Pemilik Toko wajib menghubungi admin@fibidy.com dalam 14 (empat belas) hari kalender sejak gangguan terjadi, dengan menyertakan bukti transaksi (invoice number) dan deskripsi gangguan yang dialami. Pengajuan di luar jangka waktu tersebut tidak akan diproses.',
      'Proses pengembalian dana yang disetujui akan dilakukan dalam 14 (empat belas) Hari Kerja setelah verifikasi selesai, melalui metode pembayaran yang sama dengan pembayaran awal.',
      'Penangguhan atau penghapusan akun akibat pelanggaran Syarat Layanan ini tidak memberikan hak atas pengembalian dana dalam bentuk apapun, terlepas dari sisa Periode Berlangganan yang belum digunakan.',
    ],
    isList: false,
  },
  {
    number: '08',
    title: 'Subdomain dan domain kustom.',
    content: [
      'Setiap Pemilik Toko mendapatkan satu subdomain berbentuk [slug].fibidy.com sebagai bagian dari layanan Fibidy. Subdomain ini dialokasikan berdasarkan ketersediaan dan merupakan bagian dari infrastruktur domain Fibidy.',
      'Subdomain yang diberikan bukan merupakan kepemilikan permanen Pemilik Toko. Fibidy berhak mengklaim kembali subdomain yang tidak aktif, melanggar kebijakan penamaan, atau digunakan untuk aktivitas yang melanggar Syarat Layanan ini.',
      'Pemilik Toko pada Paket Business dapat menghubungkan domain kustom milik mereka sendiri ke situs Fibidy. Konfigurasi domain kustom memerlukan perubahan pengaturan DNS yang dilakukan oleh Pemilik Toko melalui registrar domain mereka.',
      'Ketersediaan dan performa fitur domain kustom bergantung pada infrastruktur Vercel selaku penyedia layanan hosting. Fibidy tidak menjamin ketersediaan domain kustom secara absolut jika gangguan bersumber dari Vercel atau dari konfigurasi DNS yang salah dilakukan oleh Pemilik Toko.',
      'Pemilik Toko bertanggung jawab penuh atas biaya registrasi, perpanjangan, dan pengelolaan domain kustom mereka sendiri. Fibidy tidak bertanggung jawab atas kehilangan domain kustom akibat kegagalan perpanjangan atau tindakan registrar domain.',
      'SSL (keamanan koneksi HTTPS) untuk domain kustom disediakan oleh Fibidy melalui infrastruktur Vercel. Proses penerbitan sertifikat SSL memerlukan waktu dan bergantung pada konfigurasi DNS yang benar dari sisi Pemilik Toko.',
      'Ketika akun Pemilik Toko dihapus atau dinonaktifkan, seluruh konfigurasi domain kustom yang terhubung akan dihapus secara otomatis. Pemilik Toko bertanggung jawab untuk mengubah konfigurasi DNS mereka sendiri setelah pemutusan koneksi.',
    ],
    isList: false,
  },
  {
    number: '09',
    title: 'Layanan pihak ketiga.',
    content: [
      'Platform Fibidy terintegrasi dengan layanan pihak ketiga yang memiliki syarat dan ketentuan tersendiri, termasuk:',
      'Xendit: pemrosesan pembayaran berlangganan Paket Business.',
      'Vercel: infrastruktur hosting, deployment, dan domain kustom.',
      'Supabase: database dan penyimpanan data terstruktur.',
      'Cloudinary: penyimpanan dan pengelolaan file media.',
      'Dengan menggunakan layanan Fibidy, kamu menyetujui bahwa Fibidy dapat berbagi data yang diperlukan dengan Layanan Pihak Ketiga tersebut semata-mata untuk keperluan operasional platform. Fibidy memilih Layanan Pihak Ketiga yang memiliki standar keamanan yang memadai, namun tidak dapat menjamin perilaku Layanan Pihak Ketiga di luar kendali Fibidy.',
      'Fibidy tidak bertanggung jawab atas gangguan, perubahan fitur, perubahan kebijakan, kenaikan harga, atau penghentian Layanan Pihak Ketiga yang memengaruhi operasional platform Fibidy. Fibidy akan berupaya memberikan pemberitahuan sedini mungkin jika perubahan Layanan Pihak Ketiga berdampak signifikan pada pengalaman pengguna.',
      'Kamu bertanggung jawab untuk mematuhi syarat dan ketentuan Layanan Pihak Ketiga yang relevan dengan penggunaan kamu atas platform Fibidy.',
    ],
    isList: true,
    listStart: 1,
    listEnd: 5,
  },
  {
    number: '10',
    title: 'Fibidy bukan pihak dalam transaksi toko.',
    content: [
      'Fibidy adalah penyedia infrastruktur teknologi, bukan marketplace dan bukan perantara transaksi. Fibidy tidak terlibat dalam, tidak mengatur, dan tidak bertanggung jawab atas transaksi apapun yang terjadi antara Pemilik Toko dan pelanggan toko.',
      'Situs Fibidy yang dibuat oleh Pemilik Toko dapat menampilkan katalog produk dan menyediakan tautan kontak (termasuk tautan WhatsApp) untuk memudahkan komunikasi antara Pemilik Toko dan pelanggan. Tautan WhatsApp yang tersedia di situs Fibidy adalah tautan langsung (wa.me) yang menghubungkan pengunjung langsung ke nomor WhatsApp Pemilik Toko bukan sistem yang dioperasikan oleh Fibidy.',
      'Seluruh negosiasi harga, konfirmasi pesanan, pembayaran dari pelanggan kepada Pemilik Toko, pengiriman produk, dan penyelesaian transaksi terjadi sepenuhnya di luar platform Fibidy dan menjadi tanggung jawab eksklusif Pemilik Toko.',
      'Pemilik Toko bertanggung jawab penuh atas: keakuratan informasi produk dan harga yang ditampilkan, ketersediaan dan kualitas produk atau layanan yang ditawarkan, pemenuhan pesanan, pengiriman, dan layanan purna jual, serta penanganan keluhan dan sengketa dengan pelanggan toko.',
      'Fibidy tidak bertanggung jawab atas kualitas produk, ketepatan pengiriman, kepuasan pelanggan toko, atau sengketa yang timbul dari transaksi di dalam situs Pemilik Toko. Pelanggan toko yang memiliki keluhan atas produk atau layanan harus menghubungi Pemilik Toko secara langsung.',
    ],
    isList: false,
  },
  {
    number: '11',
    title: 'Penafian jaminan.',
    content: [
      'Layanan Fibidy disediakan "sebagaimana adanya" (as-is) dan "sebagaimana tersedia" (as-available) tanpa jaminan dalam bentuk apapun, baik tersurat maupun tersirat.',
      'Fibidy secara khusus tidak menjamin bahwa: (a) layanan akan selalu tersedia tanpa gangguan, penundaan, atau kesalahan; (b) layanan akan memenuhi seluruh kebutuhan spesifik bisnismu; (c) data yang tersimpan di platform akan selalu aman dari segala kemungkinan risiko; atau (d) platform bebas dari bug, error, atau kelemahan keamanan.',
      'Fibidy tidak menjamin bahwa situs yang dibuat menggunakan platform Fibidy akan mendapatkan peringkat tertentu di mesin pencari (SEO). Posisi di hasil pencarian Google atau mesin pencari lainnya ditentukan sepenuhnya oleh algoritma mesin pencari yang bersangkutan dan berada di luar kendali Fibidy.',
      'Ketersediaan dan performa layanan bergantung sebagian pada Layanan Pihak Ketiga. Gangguan pada Xendit, Vercel, Supabase, Cloudinary, atau penyedia infrastruktur lain yang digunakan Fibidy dapat memengaruhi ketersediaan layanan dan berada di luar kendali Fibidy.',
      'Fibidy berupaya menjaga ketersediaan platform dan akan memberitahukan pemeliharaan terjadwal yang diketahui sebelumnya melalui email atau notifikasi di platform.',
    ],
    isList: false,
  },
  {
    number: '12',
    title: 'Batasan tanggung jawab.',
    content: [
      'Sejauh yang diizinkan oleh hukum yang berlaku di Republik Indonesia, Fibidy beserta pengelola, agen, dan afiliasinya tidak bertanggung jawab atas:',
      'Kerugian tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan Fibidy, termasuk namun tidak terbatas pada kehilangan pendapatan, kehilangan keuntungan yang diharapkan, kehilangan pelanggan, atau kerugian reputasi.',
      'Kehilangan data yang timbul dari penghapusan akun oleh Pemilik Toko sendiri, pelanggaran Syarat Layanan yang mengakibatkan penghapusan akun, atau kegagalan Pemilik Toko untuk melakukan backup data secara mandiri.',
      'Kerugian yang timbul akibat akses tidak sah ke akun Pemilik Toko yang disebabkan oleh: kelalaian Pemilik Toko dalam menjaga kerahasiaan kata sandi, penggunaan kata sandi yang lemah, atau pembagian akses akun kepada pihak lain.',
      'Kerugian yang timbul dari gangguan, perubahan kebijakan, atau penghentian Layanan Pihak Ketiga yang terintegrasi dengan platform Fibidy.',
      'Kerugian yang timbul dari konfigurasi domain kustom yang salah dilakukan oleh Pemilik Toko.',
      'Kerugian yang timbul dari transaksi antara Pemilik Toko dan pelanggan toko yang terjadi di luar platform Fibidy.',
      'Dalam keadaan apapun, total tanggung jawab Fibidy kepada Pemilik Toko yang berlangganan Paket Business tidak akan melebihi jumlah yang telah dibayarkan oleh Pemilik Toko kepada Fibidy dalam 3 (tiga) bulan terakhir sebelum kejadian yang menimbulkan klaim.',
      'Total tanggung jawab Fibidy kepada Pemilik Toko yang menggunakan Paket Starter (gratis) adalah Rp 0 (nol Rupiah), mengingat tidak adanya pembayaran yang menjadi dasar klaim finansial.',
      'Keterbatasan tanggung jawab ini berlaku sekalipun Fibidy telah diberitahu mengenai kemungkinan terjadinya kerugian tersebut.',
    ],
    isList: true,
    listStart: 1,
    listEnd: 7,
  },
  {
    number: '13',
    title: 'Ganti rugi.',
    content: [
      'Kamu setuju untuk membela, mengganti rugi, dan membebaskan Fibidy beserta pengelola, agen, dan afiliasinya dari dan terhadap seluruh klaim, tuntutan, kerugian, kewajiban, biaya, dan pengeluaran termasuk biaya hukum yang wajar yang timbul dari atau berkaitan dengan:',
      'Penggunaan layanan Fibidy yang melanggar Syarat Layanan ini atau hukum yang berlaku.',
      'Konten yang kamu unggah ke platform yang melanggar hak kekayaan intelektual atau hak hukum lainnya dari pihak manapun.',
      'Sengketa yang timbul antara kamu dan pelanggan tokomu atas produk, layanan, atau transaksi apapun.',
      'Pelanggaran terhadap regulasi sektoral yang berlaku atas jenis usaha yang kamu jalankan, termasuk namun tidak terbatas pada regulasi BPOM, OJK, Dinas Kesehatan, atau otoritas berwenang lainnya.',
      'Klaim pihak ketiga yang timbul akibat penggunaan platformmu oleh pengunjung atau pelanggan situsmu.',
    ],
    isList: true,
    listStart: 1,
    listEnd: 6,
  },
  {
    number: '14',
    title: 'Penghentian layanan.',
    content: [
      'Kamu dapat menutup akun kapan saja melalui pengaturan akun atau dengan menghubungi admin@fibidy.com. Penutupan akun bersifat permanen. Seluruh data toko, konten, dan konfigurasi akan dihapus secara permanen dalam 30 (tiga puluh) hari kalender sejak penutupan akun dikonfirmasi. Setelah periode tersebut, data tidak dapat dipulihkan.',
      'Jika kamu ingin menyimpan datamu, kamu bertanggung jawab untuk mengunduh atau mencatat seluruh informasi yang diperlukan sebelum mengajukan penutupan akun. Fibidy tidak menyediakan layanan export data otomatis pada Paket Starter.',
      'Fibidy berhak menangguhkan akses ke akun atau menghapus akun tanpa pemberitahuan sebelumnya jika: terdapat pelanggaran terhadap Syarat Layanan ini, terdapat aktivitas yang mencurigakan atau berpotensi merugikan pengguna lain atau pihak ketiga, akun digunakan untuk Materi Terlarang, atau terdapat perintah dari otoritas hukum yang berwenang.',
      'Dalam hal akun ditangguhkan atau dihapus akibat pelanggaran Syarat Layanan, Pemilik Toko tidak berhak atas pengembalian dana, kompensasi, atau akses ke data yang tersimpan.',
      'Dalam hal penangguhan atau penghentian yang tidak disebabkan oleh pelanggaran Pemilik Toko (misalnya Fibidy menghentikan operasional platform secara keseluruhan), Fibidy akan memberikan pemberitahuan minimal 30 (tiga puluh) hari kepada pengguna aktif dan menyediakan mekanisme untuk mengakses dan mengunduh data toko dalam periode tersebut.',
      'Fibidy berhak menghentikan, memodifikasi, atau menambahkan fitur layanan secara keseluruhan dengan pemberitahuan yang wajar kepada pengguna aktif. Penghentian fitur tertentu bukan merupakan dasar untuk pembatalan berlangganan atau pengembalian dana, kecuali fitur tersebut merupakan komponen inti dari paket yang dibayarkan.',
    ],
    isList: false,
  },
  {
    number: '15',
    title: 'Keamanan data.',
    content: [
      'Fibidy menerapkan langkah-langkah keamanan teknis yang wajar dan sesuai dengan standar industri untuk melindungi data Pemilik Toko yang tersimpan di platform, termasuk enkripsi koneksi (TLS) dan pembatasan akses internal.',
      'Fibidy memiliki kewenangan hukum yang sah untuk menyelenggarakan platform ini, beroperasi sesuai hukum yang berlaku di Republik Indonesia, dan akan berupaya mematuhi regulasi perlindungan data yang berlaku, termasuk Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.',
      'Jika terjadi Insiden Keamanan yang memengaruhi data Pemilik Toko, Fibidy akan berupaya memberitahu Pemilik Toko yang terdampak dalam waktu yang wajar sejak Insiden Keamanan diketahui dan dikonfirmasi, sesuai kemampuan teknis dan kapasitas yang tersedia.',
      'Tidak ada sistem keamanan yang dapat menjamin perlindungan absolut. Fibidy tidak bertanggung jawab atas Insiden Keamanan yang timbul dari: kelemahan pada Layanan Pihak Ketiga di luar kendali Fibidy, kelalaian Pemilik Toko dalam menjaga keamanan akun, atau serangan siber yang melampaui kapabilitas pertahanan yang tersedia.',
      'Detail mengenai pengumpulan, penggunaan, dan perlindungan data pribadi diatur dalam Kebijakan Privasi Fibidy yang merupakan bagian tidak terpisahkan dari Syarat Layanan ini.',
    ],
    isList: false,
  },
  {
    number: '16',
    title: 'Force majeure.',
    content: [
      'Fibidy tidak bertanggung jawab atas keterlambatan atau kegagalan dalam memenuhi kewajiban berdasarkan Syarat Layanan ini yang disebabkan oleh kejadian di luar kendali wajar Fibidy, termasuk namun tidak terbatas pada:',
      'Bencana alam, gempa bumi, banjir, kebakaran, atau kondisi cuaca ekstrem yang memengaruhi infrastruktur.',
      'Pandemi, wabah penyakit, atau kondisi darurat kesehatan masyarakat yang ditetapkan oleh otoritas berwenang.',
      'Serangan siber masif, distributed denial-of-service (DDoS), atau insiden keamanan skala besar yang melampaui kapabilitas mitigasi yang tersedia.',
      'Pemadaman atau gangguan pada infrastruktur penyedia layanan cloud, hosting, atau jaringan internet yang digunakan Fibidy (termasuk Vercel, Supabase, Cloudinary, atau penyedia jaringan internet).',
      'Perubahan regulasi pemerintah atau kebijakan platform pihak ketiga yang memengaruhi operasional Fibidy secara fundamental.',
      'Pemblokiran atau pembatasan akses oleh otoritas pemerintah.',
      'Dalam kejadian force majeure, Fibidy akan berupaya memberitahu Pemilik Toko sesegera mungkin dan memulihkan layanan secepat yang dapat dilakukan dalam kondisi tersebut. Periode force majeure tidak memberikan hak atas pengembalian dana kecuali ditetapkan lain oleh hukum yang berlaku.',
    ],
    isList: true,
    listStart: 1,
    listEnd: 7,
  },
  {
    number: '17',
    title: 'Hukum yang berlaku dan penyelesaian sengketa.',
    content: [
      'Syarat Layanan ini tunduk pada dan ditafsirkan sesuai dengan hukum Republik Indonesia, termasuk namun tidak terbatas pada Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik beserta perubahannya, Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, dan Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen.',
      'Penyelesaian sengketa mengikuti urutan tahap berikut. Para pihak sepakat untuk menyelesaikan sengketa pada tahap paling awal yang memungkinkan sebelum melanjutkan ke tahap berikutnya:',
      'Tahap 1 Musyawarah: Setiap sengketa diselesaikan terlebih dahulu melalui musyawarah mufakat dalam jangka waktu 30 (tiga puluh) hari sejak sengketa diajukan secara tertulis melalui email ke admin@fibidy.com. Fibidy berkomitmen merespons setiap pengajuan sengketa dalam 5 (lima) Hari Kerja.',
      'Tahap 2 Arbitrase Online: Jika musyawarah tidak menghasilkan kesepakatan, para pihak sepakat menyelesaikan sengketa melalui arbitrase online yang diselenggarakan oleh Badan Arbitrase Nasional Indonesia (BANI) melalui layanan arbitrase elektroniknya, atau lembaga alternatif penyelesaian sengketa online (Online Dispute Resolution / ODR) yang disepakati bersama. Pemilihan arbitrase online dimaksudkan agar penyelesaian sengketa dapat dilakukan tanpa kehadiran fisik di lokasi tertentu, sehingga tidak memberatkan salah satu pihak secara geografis.',
      'Tahap 3 Litigasi: Jika arbitrase tidak dapat dilaksanakan atau tidak menghasilkan putusan dalam jangka waktu 60 (enam puluh) hari sejak permohonan diajukan, sengketa diselesaikan melalui Pengadilan Negeri Madiun sebagai yurisdiksi yang dipilih (choice of forum). Para pihak dengan ini menundukkan diri pada yurisdiksi pengadilan tersebut.',
      'Syarat Layanan ini disusun, ditulis, dan diterbitkan dalam Bahasa Indonesia. Bahasa Indonesia adalah satu-satunya bahasa resmi yang mengikat secara hukum. Apabila terdapat terjemahan ke dalam bahasa lain baik yang disediakan oleh Fibidy maupun pihak ketiga manapun terjemahan tersebut disediakan semata-mata untuk kemudahan pemahaman dan tidak memiliki kekuatan hukum. Dalam hal terdapat perbedaan atau pertentangan antara versi Bahasa Indonesia dan versi terjemahan dalam bahasa apapun, versi Bahasa Indonesia berlaku dan menjadi acuan tunggal dalam penyelesaian sengketa.',
    ],
    isList: true,
    listStart: 2,
    listEnd: 4,
  },
  {
    number: '18',
    title: 'Ketentuan umum.',
    content: [
      'Ketentuan dapat dipisah (Severability): Jika salah satu ketentuan dalam Syarat Layanan ini dinyatakan tidak berlaku, tidak sah, atau tidak dapat ditegakkan oleh pengadilan atau arbiter yang berwenang, maka: (a) ketentuan tersebut akan dimodifikasi oleh para pihak seminimal mungkin agar mencerminkan maksud awal secara sah dan dapat ditegakkan; (b) jika modifikasi tidak memungkinkan, ketentuan tersebut dianggap tidak ada dan dipisahkan dari Syarat Layanan ini; dan (c) seluruh ketentuan lainnya tetap berlaku penuh, mengikat, dan tidak terpengaruh. Ketidakberlakuan satu klausul tidak memengaruhi keabsahan Syarat Layanan ini secara keseluruhan.',
      'Tidak ada pelepasan hak (No Waiver): Kegagalan Fibidy untuk menegakkan suatu hak atau ketentuan dalam Syarat Layanan ini pada suatu waktu baik karena alasan operasional, kebijaksanaan, atau lainnya tidak dianggap sebagai pelepasan hak tersebut secara permanen dan tidak menghalangi Fibidy untuk menegakkan hak tersebut di kemudian hari.',
      'Keseluruhan perjanjian (Entire Agreement): Syarat Layanan ini, bersama dengan Kebijakan Privasi dan kebijakan lain yang dirujuk di dalamnya, merupakan keseluruhan perjanjian antara kamu dan Fibidy mengenai penggunaan layanan, dan menggantikan semua perjanjian, komunikasi, negosiasi, atau representasi sebelumnya baik tertulis maupun lisan terkait hal yang sama.',
      'Pengalihan hak (Assignment): Kamu tidak dapat mengalihkan hak atau kewajiban berdasarkan Syarat Layanan ini kepada pihak lain tanpa persetujuan tertulis sebelumnya dari Fibidy. Fibidy dapat mengalihkan hak dan kewajibannya kepada pihak lain dalam rangka merger, akuisisi, atau penjualan aset, dengan pemberitahuan kepada Pemilik Toko minimal 30 (tiga puluh) hari sebelumnya. Pemilik Toko yang tidak menyetujui pengalihan tersebut berhak mengakhiri langganan dan mendapatkan pengembalian dana pro-rata untuk sisa Periode Berlangganan yang belum digunakan.',
      'Komunikasi resmi: Seluruh komunikasi resmi antara Fibidy dan Pemilik Toko dilakukan melalui alamat email terdaftar masing-masing pihak. Pemberitahuan dianggap telah diterima dalam 24 jam sejak email dikirimkan ke alamat yang terdaftar, kecuali terdapat notifikasi kegagalan pengiriman (bounce). Pemilik Toko bertanggung jawab untuk memastikan alamat email yang terdaftar aktif, tidak diblokir oleh filter spam, dan dapat menerima notifikasi dari Fibidy.',
      'Kewenangan hukum Fibidy (Representations): Fibidy memiliki kewenangan hukum yang sah untuk menyelenggarakan platform ini, beroperasi sesuai hukum yang berlaku di Republik Indonesia, dan tidak sedang dalam proses pailit, likuidasi, atau sengketa hukum material yang dapat memengaruhi kemampuannya untuk memenuhi kewajiban berdasarkan Syarat Layanan ini.',
      'Untuk pertanyaan, laporan, atau keberatan mengenai Syarat Layanan ini, hubungi kami di admin@fibidy.com. Kami berupaya merespons setiap pertanyaan dalam 2 (dua) Hari Kerja.',
    ],
    isList: false,
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">

        {/* Page Header */}
        <section className="pt-36 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
                Legal
              </p>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                Syarat
                <br />
                <span className="text-primary">Layanan.</span>
              </h1>

              <div className="w-px h-10 bg-border/60 mb-8" />

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Berlaku sejak Januari 2026. Terakhir diperbarui Maret 2026.
              </p>

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        {/* Ringkasan Manusia Plain Language Summary */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr] gap-6">
                <div />
                <div className="rounded-lg border border-border/60 bg-muted/30 p-6 md:p-8">
                  <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
                    Ringkasan dalam bahasa manusia
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Bukan pengganti dokumen resmi di bawah, tapi ini intinya:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Tokomu milikmu. Datamu milikmu. Kami tidak ambil komisi satu rupiah pun.',
                      'Kami bukan marketplace. Kami tidak ikut campur transaksi kamu dengan pelangganmu.',
                      'Kami tidak pasang iklan di situsmu. Tidak pernah, tidak akan.',
                      'Paket Business tagih bulanan atau tahunan. Tidak ada refund kecuali platform kami benar-benar mati lebih dari 4 jam karena kesalahan kami sendiri.',
                      'Kalau ada masalah, hubungi kami dulu. Kami akan selesaikan.',
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        {/* Sections */}
        <section className="py-24 md:py-36">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {sections.map((s) => (
                <div key={s.number}>
                  <Separator className="bg-border/60" />
                  <div className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr] gap-6 py-9 md:py-11">

                    {/* Number */}
                    <span className="text-5xl md:text-6xl font-black text-muted-foreground/20 select-none leading-none pt-1 tabular-nums">
                      {s.number}
                    </span>

                    {/* Content */}
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6 leading-tight">
                        {s.title}
                      </h2>
                      <div className="space-y-3">
                        {s.content.map((p, i) => {
                          const isListItem = s.isList &&
                            i >= (s.listStart ?? Infinity) &&
                            i <= (s.listEnd ?? -Infinity);
                          return (
                            <p
                              key={i}
                              className={
                                isListItem
                                  ? 'pl-4 border-l-2 border-border/60 text-muted-foreground text-sm leading-relaxed'
                                  : 'text-muted-foreground text-sm leading-relaxed'
                              }
                            >
                              {p}
                            </p>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
              <Separator className="bg-border/60" />

              {/* Footer note */}
              <div className="pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Pertanyaan seputar syarat layanan?{' '}
                  <a href="mailto:admin@fibidy.com" className="text-foreground font-semibold hover:text-primary transition-colors">
                    admin@fibidy.com
                  </a>
                </p>
                <p className="text-xs text-muted-foreground">
                  Fibidy · NIB 1203260002022 · Madiun, Jawa Timur
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
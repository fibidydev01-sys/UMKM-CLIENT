// ══════════════════════════════════════════════════════════════
// PRIVACY PAGE V14.0 Fibidy
// Rebuild total: UU PDP compliant, Xendit-confirmed, anti-boomerang
// Sesuai fakta teknis: Vercel Analytics, usia minimum 17, tanpa Midtrans
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi Fibidy',
  description: 'Kebijakan privasi Fibidy. Bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi kamu sesuai UU PDP Indonesia.',
  openGraph: {
    title: 'Kebijakan Privasi Fibidy',
    description: 'Kebijakan privasi Fibidy sesuai UU PDP Indonesia.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

interface PrivacySection {
  number: string;
  title: string;
  content: string[];
}

const sections: PrivacySection[] = [
  {
    number: '00',
    title: 'Definisi.',
    content: [
      '"Data Pribadi" mengacu pada informasi yang dapat digunakan untuk mengidentifikasi seseorang secara langsung atau tidak langsung, termasuk namun tidak terbatas pada nama, alamat email, nomor telepon, alamat IP, dan informasi akun lainnya, sebagaimana didefinisikan dalam Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).',
      '"Pemrosesan" mengacu pada setiap operasi terhadap Data Pribadi, termasuk pengumpulan, pencatatan, penyimpanan, penggunaan, pengungkapan, penghapusan, dan penghancuran.',
      '"Pengendali Data" (Data Controller) mengacu pada pihak yang menentukan tujuan dan cara pemrosesan Data Pribadi. Dalam konteks penggunaan platform Fibidy oleh Pemilik Toko, Fibidy bertindak sebagai Pengendali Data atas data akun Pemilik Toko, sementara Pemilik Toko bertindak sebagai Pengendali Data atas informasi pelanggan toko mereka sendiri.',
      '"Pemroses Data" (Data Processor) mengacu pada pihak yang memproses Data Pribadi atas nama Pengendali Data. Fibidy bertindak sebagai Pemroses Data atas konten yang diunggah oleh Pemilik Toko ke platform.',
      '"Subjek Data" mengacu pada individu yang Data Pribadinya diproses. Dalam konteks Kebijakan Privasi ini, Subjek Data adalah Pemilik Toko atau Pengguna yang berinteraksi dengan platform Fibidy secara langsung.',
      '"Transfer Data Internasional" mengacu pada pemindahan Data Pribadi ke negara atau wilayah hukum di luar Republik Indonesia.',
      '"Insiden Keamanan" atau "Pelanggaran Data" mengacu pada peristiwa yang mengakibatkan akses tidak sah, pengungkapan, perubahan, atau penghancuran Data Pribadi yang tersimpan di sistem Fibidy.',
      '"Cookie" mengacu pada file teks kecil yang disimpan di perangkatmu saat mengakses platform Fibidy, digunakan untuk mengingat preferensi dan mendukung fungsionalitas platform.',
      '"Layanan Pihak Ketiga" mengacu pada penyedia layanan eksternal yang digunakan oleh Fibidy untuk mengoperasikan platform, termasuk Xendit, Vercel, Supabase, dan Cloudinary.',
    ],
  },
  {
    number: '01',
    title: 'Pengantar dan komitmen.',
    content: [
      'Fibidy yang dioperasikan oleh Bayu Surya Pranata (NIB 1203260002022, berdomisili di Madiun, Jawa Timur) berkomitmen untuk melindungi privasi dan keamanan Data Pribadi seluruh penggunanya. Kebijakan Privasi ini menjelaskan secara transparan bagaimana kami mengumpulkan, menggunakan, menyimpan, membagikan, dan melindungi informasimu.',
      'Kebijakan ini berlaku untuk seluruh layanan Fibidy yang dapat diakses melalui www.fibidy.com dan subdomain terkait, serta seluruh interaksi kamu dengan platform kami, termasuk proses pendaftaran akun, pengelolaan toko, dan komunikasi dengan tim Fibidy.',
      'Kebijakan Privasi ini disusun mengacu pada Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) dan peraturan pelaksanaannya yang berlaku di Republik Indonesia.',
      'Dengan mendaftar dan menggunakan layanan Fibidy, kamu menyatakan telah membaca, memahami, dan menyetujui pengumpulan dan penggunaan data sebagaimana dijelaskan dalam Kebijakan Privasi ini. Jika kamu tidak setuju dengan ketentuan ini, harap hentikan penggunaan layanan Fibidy.',
      'Kebijakan Privasi ini merupakan bagian tidak terpisahkan dari Syarat Layanan Fibidy. Dalam hal terdapat pertentangan antara Kebijakan Privasi ini dan Syarat Layanan, ketentuan dalam Kebijakan Privasi yang lebih spesifik berlaku untuk hal-hal yang berkaitan dengan perlindungan data.',
    ],
  },
  {
    number: '02',
    title: 'Batasan usia dan kelayakan.',
    content: [
      'Layanan Fibidy ditujukan untuk pelaku usaha yang telah berusia minimal 17 (tujuh belas) tahun atau telah cakap hukum sesuai peraturan perundang-undangan yang berlaku di Indonesia. Dengan mendaftar, kamu menyatakan bahwa kamu memenuhi ketentuan usia minimum ini.',
      'Fibidy tidak secara sengaja mengumpulkan Data Pribadi dari individu yang berusia di bawah 17 tahun. Jika kami mengetahui bahwa Data Pribadi dari individu di bawah usia tersebut telah dikumpulkan tanpa verifikasi yang memadai, kami akan menghapus data tersebut sesegera mungkin.',
      'Jika kamu mengetahui atau menduga bahwa anak di bawah usia 17 tahun telah mendaftar menggunakan layanan Fibidy, harap segera hubungi kami di admin@fibidy.com agar kami dapat mengambil tindakan yang diperlukan.',
    ],
  },
  {
    number: '03',
    title: 'Data yang kami kumpulkan.',
    content: [
      'Data yang kamu berikan secara langsung saat mendaftar dan menggunakan layanan, meliputi: informasi akun (nama usaha, alamat email, kata sandi dalam bentuk terenkripsi); informasi toko (nama toko, slug/URL toko, kategori bisnis, deskripsi usaha, nomor WhatsApp bisnis, alamat usaha, tautan media sosial); konten yang diunggah (foto produk, deskripsi layanan, harga, logo, dan informasi bisnis lainnya); serta konfigurasi toko (pengaturan landing page, tema warna, pengaturan domain kustom, dan preferensi tampilan).',
      'Data yang dikumpulkan secara otomatis saat kamu mengakses platform, meliputi: data teknis (alamat IP, jenis perangkat, browser, sistem operasi); data penggunaan yang dikumpulkan melalui Vercel Analytics (halaman yang dikunjungi, fitur yang digunakan, durasi sesi, pola navigasi) dalam bentuk agregat dan anonim; data log sistem (aktivitas akun, riwayat perubahan konfigurasi, dan catatan akses yang diperlukan untuk keamanan); serta Cookie esensial dan fungsional sebagaimana dijelaskan dalam Pasal 07.',
      'Data terkait pembayaran berlangganan diproses secara langsung oleh Xendit selaku payment gateway. Fibidy hanya menerima konfirmasi status pembayaran dan referensi transaksi dari Xendit. Fibidy tidak menyimpan, memiliki akses terhadap, atau memproses data kartu kredit, rekening bank, atau detail instrumen pembayaran milikmu.',
      'Data domain kustom yang kamu daftarkan ke platform Fibidy, termasuk nama domain, status verifikasi DNS, dan log konfigurasi domain, disimpan untuk keperluan operasional layanan domain kustom.',
    ],
  },
  {
    number: '04',
    title: 'Dasar hukum dan tujuan pemrosesan data.',
    content: [
      'Pelaksanaan perjanjian (Pasal 20 ayat 2 huruf b UU PDP): mengoperasikan akun dan seluruh fitur layanan Fibidy yang kamu gunakan; memproses dan memverifikasi pembayaran berlangganan melalui Xendit; mengelola status akun, paket berlangganan, dan Kode Redeem; mengirimkan notifikasi penting terkait akun, perpanjangan berlangganan, dan perubahan layanan; serta mengoperasikan fitur domain kustom termasuk konfigurasi DNS dan penerbitan sertifikat SSL.',
      'Kepentingan sah yang tidak bertentangan dengan kepentingan Subjek Data (Pasal 20 ayat 2 huruf f UU PDP): meningkatkan keamanan platform dan mencegah penyalahgunaan; menganalisis penggunaan platform secara agregat melalui Vercel Analytics untuk pengembangan fitur; menangani pertanyaan, laporan, dan keluhan pengguna; serta mempertahankan catatan yang diperlukan untuk penyelesaian sengketa.',
      'Persetujuan yang diberikan secara eksplisit (Pasal 20 ayat 2 huruf a UU PDP): mengirimkan komunikasi pemasaran, pembaruan produk, dan informasi fitur baru hanya jika kamu memberikan persetujuan secara eksplisit. Persetujuan ini dapat ditarik kapan saja tanpa memengaruhi keabsahan pemrosesan yang telah dilakukan sebelumnya.',
      'Kewajiban hukum (Pasal 20 ayat 2 huruf c UU PDP): mematuhi peraturan perundang-undangan yang berlaku, termasuk kewajiban perpajakan, permintaan resmi dari otoritas yang berwenang (Komnas HAM, Kepolisian, Kejaksaan, Pengadilan), dan pelaporan yang diwajibkan oleh regulator.',
    ],
  },
  {
    number: '05',
    title: 'Data toko dan tanggung jawab pemilik toko.',
    content: [
      'Data toko termasuk katalog produk, deskripsi layanan, harga, logo, dan seluruh informasi bisnis yang dimasukkan ke platform Fibidy adalah milik Pemilik Toko sepenuhnya. Fibidy bertindak sebagai Pemroses Data (data processor) atas nama Pemilik Toko untuk konten ini, dan hanya menggunakan data tersebut untuk keperluan mengoperasikan dan menampilkan situs toko.',
      'Interaksi antara Pemilik Toko dan pelanggan toko melalui tautan WhatsApp (wa.me) yang tersedia di situs Fibidy terjadi sepenuhnya di luar sistem Fibidy. Fibidy tidak memiliki akses terhadap percakapan tersebut, tidak menyimpan data pelanggan toko, dan tidak bertanggung jawab atas data yang dikumpulkan oleh Pemilik Toko dari pelanggan mereka.',
      'Sebagai Pemilik Toko, kamu bertindak sebagai Pengendali Data (data controller) atas informasi pelanggan tokomu sendiri. Kamu bertanggung jawab penuh untuk mematuhi kewajiban perlindungan data yang berlaku terhadap pelangganmu, termasuk menyediakan pemberitahuan privasi yang memadai kepada pelanggan tokomu.',
      'Fibidy tidak menjual, tidak menggunakan untuk keperluan komersial, dan tidak membagikan konten toko atau informasi bisnis Pemilik Toko kepada pihak ketiga manapun untuk tujuan pemasaran atau analitik komersial di luar keperluan operasional platform.',
    ],
  },
  {
    number: '06',
    title: 'Berbagi data dengan pihak ketiga.',
    content: [
      'Fibidy tidak menjual, tidak menyewakan, tidak memperdagangkan, dan tidak mengungkapkan Data Pribadi kepada pihak ketiga untuk tujuan pemasaran atau komersial dalam bentuk apapun.',
      'Penyedia layanan infrastruktur yang kami gunakan untuk mengoperasikan platform, yang masing-masing terikat pada perjanjian pemrosesan data dan standar keamanan yang memadai: (a) Xendit pemrosesan pembayaran berlangganan, berdomisili dan beroperasi di Indonesia, tunduk pada regulasi Bank Indonesia dan OJK; (b) Vercel infrastruktur hosting, deployment, dan layanan analitik dasar (Vercel Analytics), berdomisili di Amerika Serikat; (c) Supabase database dan sistem autentikasi, berdomisili di Amerika Serikat; (d) Cloudinary penyimpanan dan pengelolaan file media, berdomisili di Amerika Serikat.',
      'Kewajiban hukum: Fibidy dapat mengungkapkan Data Pribadi jika secara sah diwajibkan oleh hukum, perintah pengadilan yang berkekuatan hukum tetap, atau permintaan resmi tertulis dari otoritas yang berwenang di Indonesia. Dalam batas yang diizinkan hukum, Fibidy akan berupaya memberitahu kamu sebelum pengungkapan tersebut dilakukan.',
      'Transfer kepemilikan bisnis: jika Fibidy diakuisisi, melakukan merger, atau terjadi pengalihan kepemilikan bisnis, Data Pribadi pengguna dapat menjadi bagian dari aset yang dialihkan. Pemilik Toko akan diberitahu minimal 30 (tiga puluh) hari sebelum pengalihan tersebut berlaku dan diberikan pilihan untuk menutup akun jika tidak menyetujui pengalihan.',
    ],
  },
  {
    number: '07',
    title: 'Cookie dan teknologi pelacakan.',
    content: [
      'Cookie esensial (tidak dapat dinonaktifkan): diperlukan untuk mengoperasikan platform secara fungsional, termasuk manajemen sesi login, keamanan akun, dan penyimpanan preferensi dasar. Tanpa cookie ini, platform tidak dapat berfungsi dengan benar.',
      'Cookie fungsional: menyimpan preferensi tampilanmu seperti pengaturan tema dan konfigurasi antarmuka untuk meningkatkan pengalaman penggunaan. Cookie ini tidak digunakan untuk pelacakan lintas situs.',
      'Analitik platform: Fibidy menggunakan Vercel Analytics untuk memahami pola penggunaan platform secara agregat. Vercel Analytics dirancang untuk menghormati privasi pengguna: data dikumpulkan secara anonim tanpa menggunakan cookie pelacakan, tidak menyimpan data identifikasi pribadi, dan tidak melacak pengguna lintas situs web yang berbeda.',
      'Fibidy tidak menggunakan cookie pelacakan iklan pihak ketiga, tidak mengintegrasikan pixel iklan dari platform manapun (termasuk Meta Pixel atau Google Ads), dan tidak berpartisipasi dalam jaringan iklan berbasis data perilaku. Kamu dapat mengatur preferensi cookie esensial dan fungsional melalui pengaturan browser, namun menonaktifkan cookie esensial akan memengaruhi kemampuanmu untuk login dan menggunakan platform.',
    ],
  },
  {
    number: '08',
    title: 'Keamanan data.',
    content: [
      'Fibidy menerapkan langkah-langkah teknis dan organisasi yang wajar dan sesuai standar industri untuk melindungi Data Pribadi dari akses tidak sah, pengungkapan, perubahan, atau penghancuran.',
      'Langkah perlindungan teknis yang kami terapkan meliputi: enkripsi koneksi menggunakan protokol TLS/SSL untuk seluruh transmisi data; enkripsi kata sandi menggunakan algoritma hashing yang aman (bcrypt) kata sandi tidak pernah disimpan dalam bentuk teks biasa; kontrol akses berbasis peran untuk data internal Fibidy; infrastruktur database Supabase dengan isolasi data antar tenant; serta penyimpanan media melalui Cloudinary dengan akses terkontrol.',
      'Tidak ada sistem keamanan yang dapat menjamin perlindungan absolut terhadap semua ancaman. Fibidy tidak bertanggung jawab atas Insiden Keamanan yang timbul dari kelemahan pada Layanan Pihak Ketiga di luar kendali Fibidy, atau dari kelalaian Pemilik Toko dalam menjaga keamanan akun (kata sandi lemah, berbagi akses, dll).',
      'Dalam hal terjadi Insiden Keamanan yang berdampak pada Data Pribadi Pemilik Toko, Fibidy akan berupaya memberitahu Pemilik Toko yang terdampak dalam waktu yang wajar sejak insiden dikonfirmasi, sesuai ketentuan Pasal 46 UU PDP. Pemberitahuan dilakukan melalui email terdaftar dan mencakup: deskripsi insiden yang diketahui, jenis data yang terdampak, langkah yang telah dan akan diambil Fibidy, serta rekomendasi tindakan yang dapat dilakukan oleh Pemilik Toko.',
      'Jika kamu menemukan potensi celah keamanan atau aktivitas mencurigakan pada akunmu, harap segera laporkan ke admin@fibidy.com.',
    ],
  },
  {
    number: '09',
    title: 'Retensi data.',
    content: [
      'Fibidy menyimpan Data Pribadi selama akunmu aktif dan diperlukan untuk menyediakan layanan, atau selama masih terdapat dasar hukum yang sah untuk mempertahankannya.',
      'Setelah penutupan akun oleh Pemilik Toko: data toko, konten yang diunggah, dan konfigurasi toko akan dihapus dari sistem aktif dalam 30 (tiga puluh) hari kalender sejak penutupan dikonfirmasi. Setelah periode 30 hari tersebut, data tidak dapat dipulihkan. Pemilik Toko bertanggung jawab untuk mengunduh atau mencatat informasi yang diperlukan sebelum menutup akun.',
      'Setelah penangguhan atau penghapusan akun oleh Fibidy akibat pelanggaran: data dapat dipertahankan untuk jangka waktu yang lebih lama jika diperlukan untuk keperluan penyelesaian sengketa, penegakan hukum, atau pencegahan penyalahgunaan kembali.',
      'Data yang wajib dipertahankan berdasarkan hukum: beberapa data transaksi keuangan dapat disimpan lebih lama sesuai regulasi perpajakan Indonesia (umumnya 5 tahun) atau sesuai ketentuan hukum lain yang berlaku.',
      'Data yang telah dianonimkan secara ireversibel dan tidak dapat dikaitkan kembali dengan identitas apapun dapat disimpan untuk keperluan analitik platform dan pengembangan layanan tanpa batas waktu.',
    ],
  },
  {
    number: '10',
    title: 'Hak-hak kamu sebagai subjek data.',
    content: [
      'Sesuai dengan UU PDP Bab V, kamu sebagai Subjek Data memiliki hak-hak berikut atas Data Pribadimu yang diproses oleh Fibidy:',
      'Hak untuk mendapatkan informasi (Pasal 8): memperoleh informasi yang jelas mengenai identitas Pengendali Data, tujuan pemrosesan, dan pihak yang menerima data. Kebijakan Privasi ini adalah pemenuhan hak tersebut.',
      'Hak akses (Pasal 34): meminta salinan Data Pribadi yang kami simpan tentang kamu dalam format yang dapat dibaca.',
      'Hak rektifikasi (Pasal 35): memperbarui atau mengoreksi Data Pribadi yang tidak akurat atau tidak lengkap. Sebagian besar data dapat diperbarui langsung melalui pengaturan akun.',
      'Hak penghapusan (Pasal 36): meminta penghapusan Data Pribadimu apabila tidak lagi diperlukan untuk tujuan pemrosesan, persetujuan ditarik, atau terdapat keberatan yang sah. Beberapa data mungkin perlu dipertahankan untuk kewajiban hukum.',
      'Hak pembatasan pemrosesan (Pasal 37): meminta pembatasan pemrosesan Data Pribadimu dalam kondisi tertentu, misalnya saat akurasi data sedang dipersengketakan.',
      'Hak portabilitas (Pasal 38): meminta salinan Data Pribadimu dalam format terstruktur yang dapat dibaca mesin untuk dialihkan kepada Pengendali Data lain.',
      'Hak keberatan (Pasal 39): mengajukan keberatan atas pemrosesan Data Pribadi yang didasarkan pada kepentingan sah, termasuk keberatan atas penggunaan data untuk komunikasi pemasaran.',
      'Hak menarik persetujuan: menarik persetujuan yang telah diberikan kapan saja tanpa memengaruhi keabsahan pemrosesan yang dilakukan sebelum penarikan.',
      'Untuk menggunakan hak-hak di atas, hubungi kami melalui email admin@fibidy.com dengan subjek "Permintaan Hak Subjek Data" dan sertakan: identitas lengkap, jenis hak yang ingin digunakan, dan deskripsi permintaan. Kami akan merespons dan menindaklanjuti dalam 14 (empat belas) Hari Kerja sejak permintaan diterima secara lengkap.',
    ],
  },
  {
    number: '11',
    title: 'Transfer data internasional.',
    content: [
      'Sebagian infrastruktur teknis Fibidy menggunakan Layanan Pihak Ketiga yang beroperasi di luar Republik Indonesia. Secara spesifik: Vercel (hosting dan Vercel Analytics) dan Supabase (database dan autentikasi) beroperasi dengan infrastruktur di Amerika Serikat; Cloudinary (penyimpanan media) beroperasi dengan infrastruktur yang tersebar secara global.',
      'Dengan menggunakan layanan Fibidy dan menyetujui Kebijakan Privasi ini, kamu memberikan persetujuan eksplisit untuk Transfer Data Internasional ke yurisdiksi di atas semata-mata untuk keperluan operasional platform. Transfer ini dilakukan dengan perlindungan yang memadai melalui perjanjian pemrosesan data dengan masing-masing penyedia layanan.',
      'Fibidy memilih Layanan Pihak Ketiga yang beroperasi sesuai standar keamanan internasional yang diakui, termasuk namun tidak terbatas pada SOC 2 Type II (Vercel, Supabase) dan ISO 27001 (Cloudinary). Fibidy memastikan bahwa Data Pribadi yang ditransfer mendapatkan perlindungan yang setara atau lebih baik dari standar yang ditetapkan dalam UU PDP.',
      'Pembayaran berlangganan diproses oleh Xendit yang berdomisili dan beroperasi di Indonesia, sehingga data yang terkait dengan transaksi pembayaran tidak mengalami Transfer Data Internasional.',
    ],
  },
  {
    number: '12',
    title: 'Pemberitahuan pelanggaran data.',
    content: [
      'Fibidy menerapkan prosedur internal untuk mendeteksi, menyelidiki, dan menangani Insiden Keamanan yang memengaruhi Data Pribadi Pemilik Toko. Prosedur ini mengacu pada ketentuan Pasal 46 UU PDP mengenai kewajiban notifikasi pelanggaran data.',
      'Dalam hal terjadi Insiden Keamanan yang berdampak signifikan terhadap Data Pribadi, Fibidy akan: (a) melakukan investigasi internal untuk mengkonfirmasi dan menilai dampak insiden; (b) memberitahu Pemilik Toko yang terdampak melalui email terdaftar dalam waktu yang wajar sejak insiden dikonfirmasi; (c) melaporkan insiden kepada otoritas yang berwenang sesuai ketentuan UU PDP jika dipersyaratkan; dan (d) mengambil langkah mitigasi untuk membatasi dampak dan mencegah insiden serupa.',
      'Pemberitahuan kepada Pemilik Toko yang terdampak akan mencakup: deskripsi insiden yang diketahui pada saat pemberitahuan, jenis dan perkiraan jumlah Data Pribadi yang terdampak, langkah yang telah dan akan diambil Fibidy untuk mengatasi insiden, serta rekomendasi tindakan yang dapat dilakukan oleh Pemilik Toko untuk melindungi diri.',
      'Kewajiban notifikasi ini berlaku untuk insiden yang berasal dari sistem Fibidy sendiri. Untuk Insiden Keamanan yang terjadi pada Layanan Pihak Ketiga (Vercel, Supabase, Cloudinary), Fibidy akan meneruskan informasi yang diterima dari penyedia tersebut kepada Pemilik Toko yang terdampak sesegera mungkin setelah informasi tersedia.',
    ],
  },
  {
    number: '13',
    title: 'Perubahan kebijakan.',
    content: [
      'Fibidy dapat memperbarui Kebijakan Privasi ini sewaktu-waktu untuk mencerminkan perubahan layanan, perubahan regulasi, atau perkembangan praktik perlindungan data.',
      'Perubahan yang bersifat material yaitu perubahan yang secara signifikan memengaruhi cara kami mengumpulkan atau menggunakan Data Pribadi, atau yang mengurangi hak-hakmu sebagai Subjek Data akan diberitahukan melalui email terdaftar dan notifikasi di platform minimal 7 (tujuh) hari sebelum perubahan berlaku.',
      'Untuk perubahan minor yang tidak berdampak material terhadap hak-hak Subjek Data (misalnya koreksi ejaan, klarifikasi bahasa, atau penambahan informasi yang tidak mengurangi perlindungan), Fibidy dapat memperbarui Kebijakan Privasi tanpa pemberitahuan khusus. Tanggal pembaruan terakhir selalu dicantumkan di bagian atas halaman ini.',
      'Versi terbaru Kebijakan Privasi selalu tersedia di www.fibidy.com/privacy. Penggunaan layanan yang berlanjut setelah perubahan berlaku dianggap sebagai persetujuan atas Kebijakan Privasi yang diperbarui. Jika kamu tidak menyetujui perubahan tersebut, kamu dapat menutup akun sebelum perubahan berlaku.',
    ],
  },
  {
    number: '14',
    title: 'Kontak dan pengaduan.',
    content: [
      'Fibidy bertanggung jawab atas perlindungan Data Pribadi yang diproses melalui platform. Untuk pertanyaan, permintaan hak Subjek Data, atau pengaduan terkait privasi dan perlindungan data, hubungi kami melalui:',
      'Email: admin@fibidy.com (respons dalam 14 Hari Kerja untuk permintaan hak Subjek Data, 2 Hari Kerja untuk pertanyaan umum). Sertakan subjek email yang jelas untuk mempercepat penanganan, misalnya: "Permintaan Hak Subjek Data", "Pertanyaan Privasi", atau "Laporan Insiden Keamanan".',
      'Alamat korespondensi: Fibidy, Madiun, Jawa Timur, Indonesia.',
      'Jika kamu merasa bahwa pemrosesan Data Pribadimu tidak sesuai dengan ketentuan UU PDP atau Kebijakan Privasi ini, dan tanggapan Fibidy tidak memuaskan, kamu berhak mengajukan pengaduan kepada otoritas perlindungan data yang berwenang di Indonesia sebagaimana diatur dalam UU PDP.',
      'Fibidy berkomitmen untuk menangani setiap pertanyaan dan pengaduan terkait privasi dengan serius, transparan, dan dalam jangka waktu yang wajar.',
    ],
  },
];

export default function PrivacyPage() {
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
                Kebijakan
                <br />
                <span className="text-primary">Privasi.</span>
              </h1>

              <div className="w-px h-10 bg-border/60 mb-8" />

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Berlaku sejak Januari 2026. Terakhir diperbarui Maret 2026.
                Mengacu pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.
              </p>

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        {/* Ringkasan Manusia */}
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
                      'Kami kumpulkan data yang kamu berikan saat daftar dan data teknis otomatis. Tidak lebih.',
                      'Kami tidak jual datamu. Tidak pernah, tidak akan.',
                      'Data toko milikmu. Kami hanya menyimpannya agar situsmu bisa tampil.',
                      'Kamu bisa minta akses, koreksi, atau hapus datamu kapan saja via email.',
                      'Kalau ada pelanggaran data dari sisi kami, kami beritahu kamu segera.',
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
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5 leading-tight">
                        {s.title}
                      </h2>
                      <div className="space-y-3">
                        {s.content.map((p, i) => (
                          <p key={i} className="text-muted-foreground leading-relaxed text-sm md:text-base">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              <Separator className="bg-border/60" />

              {/* Footer note */}
              <div className="pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Pertanyaan seputar privasi?{' '}
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
import { Check, User, Handshake } from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting
// ══════════════════════════════════════════════════════════════

const weProvide = [
  'Alamat sendiri yang bisa dishare',
  'Toko yang lebih gampang dicari',
  'Fibidy AI yang bantuin nulis',
  'Sistem order/booking yang rapi',
];

const youProvide = [
  'Info produk/layanan yang KAMU isi',
  'Foto yang KAMU upload',
  'Seberapa lengkap dan update',
];

// ══════════════════════════════════════════════════════════════
// COMPONENT - NO EMOJIS
// ══════════════════════════════════════════════════════════════

export function HonestSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* ════════════════════════════════════════════════════ */}
          {/* HEADER                                               */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Jujur Aja Ya</h2>
            <p className="text-lg text-muted-foreground">
              Fibidy bukan sulap yang bikin usaha kamu langsung rame.
            </p>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* TWO COLUMNS                                          */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* KAMI KASIH */}
            <div className="p-6 rounded-xl bg-background border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Handshake className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Yang kami kasih:</h3>
              </div>
              <ul className="space-y-3">
                {weProvide.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* KAMU NENTUIN */}
            <div className="p-6 rounded-xl bg-background border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg">Yang nentuin hasilnya:</h3>
              </div>
              <ul className="space-y-3">
                {youProvide.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* CLOSING - ICON instead of emoji                      */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="text-center">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-pink-500/5 border">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Kami siapin panggungnya.
                <br />
                <span className="text-foreground font-medium">Kamu yang tampil.</span>
                <br />
                <span className="text-sm">
                  Makin bagus penampilannya, makin gampang dicari.
                </span>
              </p>
              <p className="text-xl font-bold text-primary mt-6 flex items-center justify-center gap-2">
                Bareng-bareng, ya.
                <Handshake className="h-5 w-5" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
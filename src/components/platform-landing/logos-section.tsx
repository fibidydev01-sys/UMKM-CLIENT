import { cn } from '@/lib/cn';

const stats = [
  { value: '10,000+', label: 'UMKM Terdaftar' },
  { value: '34', label: 'Provinsi' },
  { value: '50,000+', label: 'Produk Aktif' },
  { value: '100,000+', label: 'Transaksi/Bulan' },
];

const partners = [
  { name: 'WhatsApp Business', initial: 'WA' },
  { name: 'Cloudinary', initial: 'CL' },
  { name: 'Vercel', initial: 'VC' },
  { name: 'Supabase', initial: 'SB' },
  { name: 'Stripe', initial: 'ST' },
  { name: 'Google Cloud', initial: 'GC' },
];

export function LogosSection() {
  return (
    <section className="py-16 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Dipercaya oleh ribuan UMKM & bermitra dengan platform terpercaya
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center w-20 h-12 rounded-lg bg-background border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              title={partner.name}
            >
              <span className="font-bold text-lg">{partner.initial}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
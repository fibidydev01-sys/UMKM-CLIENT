// ══════════════════════════════════════════════════════════════
// PROFIL FOUNDER — V13.1 Raycast Standard
// Clean editorial, separator rhythm, CSS vars only
// ══════════════════════════════════════════════════════════════

import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';

const FOUNDER_META = [
  { label: 'Lokasi', value: 'Madiun, Jawa Timur' },
  { label: 'Peran', value: 'Founder & Developer' },
  { label: 'Aktif', value: 'Sejak Januari 2026' },
] as const;

export function ProfilFounder() {
  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Founder
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Di balik Fibidy.
            </h2>
          </div>

          <Separator className="bg-border/60" />

          <div className="py-10 md:py-12 grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr] items-start gap-6">

            {/* Avatar — User icon */}
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-1 leading-tight">
                Bayu Surya Pranata.
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Founder & Developer, Fibidy
              </p>

              <div className="flex flex-wrap gap-x-10 gap-y-5">
                {FOUNDER_META.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
                      {label}
                    </p>
                    <p className="text-foreground font-semibold text-sm">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <Separator className="bg-border/60" />

        </div>
      </div>
    </section>
  );
}
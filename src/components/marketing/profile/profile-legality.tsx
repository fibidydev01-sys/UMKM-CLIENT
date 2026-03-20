// ══════════════════════════════════════════════════════════════
// PROFIL LEGALITAS — V13.1 Raycast Standard
// NIB card, separator rhythm, CSS vars only
// ══════════════════════════════════════════════════════════════

import { BadgeCheck, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function GarudaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <ellipse cx="32" cy="30" rx="8" ry="10" className="fill-current" />
      <circle cx="32" cy="17" r="5" className="fill-current" />
      <path d="M32 20 L29 23 L32 22 L35 23 Z" className="fill-current" opacity="0.7" />
      <path d="M24 28 L4 22 L6 28 L14 30 L8 36 L16 33 L20 38 L24 32Z" className="fill-current" opacity="0.85" />
      <path d="M40 28 L60 22 L58 28 L50 30 L56 36 L48 33 L44 38 L40 32Z" className="fill-current" opacity="0.85" />
      <path d="M26 40 L32 52 L38 40 L35 42 L32 44 L29 42Z" className="fill-current" opacity="0.8" />
      <path d="M28 46 L24 54 M32 48 L32 56 M36 46 L40 54" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 28 L32 26 L36 28 L36 34 L32 36 L28 34Z" fill="none" className="stroke-current" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

const NIB_ROWS = [
  { key: 'Nomor Induk Berusaha (NIB)', value: '1203260002022', mono: true },
  { key: 'Nama Pelaku Usaha', value: 'Bayu Surya Pranata' },
  { key: 'Skala Usaha', value: 'Usaha Mikro' },
  { key: 'Tingkat Risiko', value: 'Rendah', variant: 'green' },
  { key: 'Kode KBLI', value: '63122', variant: 'tag' },
  { key: 'Bidang Usaha', value: 'Portal Web Dan/Atau Platform Digital Dengan Tujuan Komersial' },
  { key: 'Beroperasi Sejak', value: 'Januari 2026' },
  { key: 'Diterbitkan', value: '12 Maret 2026, Jakarta' },
] as const;

export function ProfilLegalitas() {
  return (
    <section className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Legalitas
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Resmi dan tercatat.
            </h2>
          </div>

          <Separator className="bg-border/60 mb-12" />

          {/* NIB Card */}
          <div className="border border-border/60 overflow-hidden rounded-2xl">

            {/* Header */}
            <div className="bg-muted/30 border-b border-border/60 flex items-center gap-4 px-6 py-4">
              <div className="border border-border/60 bg-background flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                <GarudaIcon className="text-muted-foreground h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[9px] font-medium uppercase tracking-widest">
                  Pemerintah Republik Indonesia
                </p>
                <p className="text-foreground text-sm font-semibold">
                  Perizinan Berusaha Berbasis Risiko
                </p>
              </div>
              <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-400">
                <BadgeCheck className="h-3 w-3" />
                Aktif
              </span>
            </div>

            {/* Rows */}
            <div className="bg-card divide-y divide-border/50 px-6">
              {NIB_ROWS.map((row) => (
                <div key={row.key} className="flex items-start justify-between gap-8 py-3">
                  <span className="text-muted-foreground flex-shrink-0 text-xs sm:text-sm">{row.key}</span>
                  {'variant' in row && row.variant === 'green' ? (
                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-400">
                      {row.value}
                    </span>
                  ) : 'variant' in row && row.variant === 'tag' ? (
                    <span className="bg-muted border border-border/60 text-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold">
                      {row.value}
                    </span>
                  ) : (
                    <span className={`text-foreground text-right text-xs sm:text-sm ${'mono' in row && row.mono ? 'font-mono' : 'font-medium'}`}>
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-muted/20 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 px-6 py-3">
              <span className="text-muted-foreground text-[11px]">
                ✦ Ditandatangani secara elektronik · BSrE-BSSN
              </span>
              <a
                href="https://oss.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] transition-colors"
              >
                Verifikasi di OSS
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </div>

          </div>

          <p className="text-muted-foreground mt-3 text-[11px] leading-relaxed">
            Dokumen NIB diterbitkan sistem OSS berdasarkan data dari Pelaku Usaha dan telah ditandatangani secara elektronik.{' '}
            <a href="https://oss.go.id" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
              Verifikasi melalui oss.go.id
            </a>.
          </p>

        </div>
      </div>
    </section>
  );
}
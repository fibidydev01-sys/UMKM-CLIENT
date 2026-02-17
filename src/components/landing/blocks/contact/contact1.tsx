'use client';

import { Phone, MapPin, MessageCircle } from 'lucide-react';

interface Contact1Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact1
 * Design: CLEAN ROW LIST
 *
 * - Header: label mono + judul besar (konsisten Hero1/Products)
 * - Kontak sebagai row items dengan border-b separator
 * - No card wrapper, no icon bubble — clean & flat
 * - WhatsApp row punya hover accent hijau subtle
 * - Max-width centered, compact
 */
export function Contact1({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact1Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-20 md:py-28">

      {/* ── Header ── */}
      <div className="mb-10 md:mb-14 space-y-3">
        <div className="w-8 h-px bg-foreground" />
        <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Contact rows ── */}
      <div className="max-w-lg divide-y divide-border">

        {whatsapp && whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-4 hover:text-green-600
                       transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <MessageCircle className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors duration-200" />
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                  WhatsApp
                </p>
                <p className="text-sm font-medium text-foreground">+{whatsapp}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40
                             group-hover:text-green-600 transition-colors duration-200">
              Chat →
            </span>
          </a>
        )}

        {phone && (
          <a
            href={`tel:${phone}`}
            className="group flex items-center justify-between py-4 hover:text-foreground/70
                       transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                  Telepon
                </p>
                <p className="text-sm font-medium text-foreground">{phone}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40
                             group-hover:text-foreground/60 transition-colors duration-200">
              Hubungi →
            </span>
          </a>
        )}

        {address && (
          <div className="flex items-start gap-4 py-4">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                Alamat
              </p>
              <p className="text-sm font-medium text-foreground">{address}</p>
            </div>
          </div>
        )}

      </div>

    </section>
  );
}
'use client';

import { useState } from 'react';
import { Phone, MapPin, MessageCircle, Mail, Send, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Contact4Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  storeName?: string;
  mapUrl?: string | null;
  showMap?: boolean;
  showForm?: boolean;
}

/**
 * Contact Block: contact4
 * Design: INLINE LIST
 *
 * - Header: centered, pill badge label
 * - Semua kontak dalam 1 baris flex-wrap horizontal
 * - Dipisah dot separator · antar item
 * - Sangat compact, cocok store dengan kontak simple
 * - Form muncul di bawah dalam border box kalau showForm=true
 * - Map full width di bawah kalau showMap=true
 */
export function Contact4({
  title,
  subtitle,
  whatsapp,
  phone,
  email,
  address,
  storeName,
  mapUrl,
  showMap = false,
  showForm = false,
}: Contact4Props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp) {
      const message = `Halo ${storeName || ''}!\n\nNama: ${formData.name}\nEmail: ${formData.email}\nPesan: ${formData.message}`;
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28">

      {/* ── Centered Header ── */}
      <div className="text-center mb-10 md:mb-14 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border
                        text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
          <span className="w-1 h-1 rounded-full bg-foreground/40 inline-block" />
          Hubungi Kami
        </div>
        <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Inline contact list ── */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10 md:mb-14">

        {whatsapp && whatsappLink && (
          <>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 hover:text-green-600 transition-colors duration-200"
            >
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground group-hover:text-green-600 transition-colors" />
              <span className="text-sm font-medium">+{whatsapp}</span>
            </a>
            <span className="text-muted-foreground/30 text-xs select-none">·</span>
          </>
        )}

        {phone && (
          <>
            <a
              href={`tel:${phone}`}
              className="group inline-flex items-center gap-2 hover:text-foreground/70 transition-colors duration-200"
            >
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">{phone}</span>
            </a>
            {(email || address) && (
              <span className="text-muted-foreground/30 text-xs select-none">·</span>
            )}
          </>
        )}

        {email && (
          <>
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-2 hover:text-foreground/70 transition-colors duration-200"
            >
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">{email}</span>
            </a>
            {address && (
              <span className="text-muted-foreground/30 text-xs select-none">·</span>
            )}
          </>
        )}

        {address && (
          <div className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground">{address}</span>
          </div>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="border border-border rounded-2xl p-6 md:p-8 space-y-5">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Kirim Pesan
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="c4-name" className="text-xs font-medium">Nama</Label>
              <Input
                id="c4-name"
                placeholder="Nama Anda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c4-email" className="text-xs font-medium">Email</Label>
              <Input
                id="c4-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c4-message" className="text-xs font-medium">Pesan</Label>
              <Textarea
                id="c4-message"
                placeholder="Tulis pesan Anda..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Send className="h-4 w-4" />
              Kirim via WhatsApp
            </Button>
          </form>
        </div>
      )}

      {/* ── WA CTA jika no form ── */}
      {!showForm && whatsappLink && (
        <div className="flex justify-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-sm font-medium
                       text-foreground hover:text-foreground/60 transition-colors duration-200"
          >
            <span className="border-b border-foreground/30 group-hover:border-transparent
                             transition-colors duration-200 pb-px">
              Chat via WhatsApp
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
                             border border-foreground/20 transition-all duration-200
                             group-hover:bg-foreground group-hover:border-foreground group-hover:text-background">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      )}

      {/* ── Map ── */}
      {showMap && mapUrl && (
        <div className="mt-10 md:mt-14 rounded-2xl overflow-hidden border border-border">
          <iframe
            src={mapUrl}
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        </div>
      )}

    </section>
  );
}
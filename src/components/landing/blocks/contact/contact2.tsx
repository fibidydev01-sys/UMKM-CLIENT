'use client';

import { useState } from 'react';
import { ArrowRight, Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Contact2Props {
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
 * Contact Block: contact2
 * Design: EDITORIAL SPLIT
 *
 * - Header: accent line + judul besar (konsisten design system)
 * - Layout 2-col: kiri info kontak plain list, kanan form/WA
 * - Info kontak: no icon bubble, label mono + value
 * - Form: border box clean, no bg-muted card
 * - WA CTA: border-2 box dengan arrow, bukan gradient button
 */
export function Contact2({
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
}: Contact2Props) {
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

      {/* ── Split layout ── */}
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

        {/* ── LEFT: Info kontak ── */}
        <div className="divide-y divide-border">

          {whatsapp && whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-4
                         hover:text-green-600 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                    WhatsApp
                  </p>
                  <p className="text-sm font-medium text-foreground">+{whatsapp}</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-green-600
                                    group-hover:translate-x-0.5 transition-all duration-200" />
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="group flex items-center justify-between py-4
                         hover:text-foreground/70 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                    Telepon
                  </p>
                  <p className="text-sm font-medium text-foreground">{phone}</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40
                                    group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="group flex items-center justify-between py-4
                         hover:text-foreground/70 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                    Email
                  </p>
                  <p className="text-sm font-medium text-foreground">{email}</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40
                                    group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          )}

          {address && (
            <div className="flex items-start gap-3 py-4">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                  Alamat
                </p>
                <p className="text-sm font-medium text-foreground">{address}</p>
              </div>
            </div>
          )}

          {/* Map */}
          {showMap && mapUrl && (
            <div className="pt-6 pb-2">
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Form atau WA CTA ── */}
        <div>
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-5 border border-border rounded-2xl p-6 md:p-8">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                Kirim Pesan
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="c2-name" className="text-xs font-medium">Nama</Label>
                <Input
                  id="c2-name"
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c2-email" className="text-xs font-medium">Email</Label>
                <Input
                  id="c2-email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c2-message" className="text-xs font-medium">Pesan</Label>
                <Textarea
                  id="c2-message"
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

          ) : whatsappLink ? (
            <div className="border-2 border-foreground rounded-2xl p-8 md:p-10 flex flex-col gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  Hubungi Langsung
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Respon cepat via WhatsApp. Kami siap membantu pertanyaan Anda.
                </p>
              </div>
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
          ) : null}
        </div>
      </div>

    </section>
  );
}
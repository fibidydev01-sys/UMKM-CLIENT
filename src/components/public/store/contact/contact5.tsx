'use client';

import { useState } from 'react';
import { Phone, MapPin, MessageCircle, Mail, Send, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Contact5Props {
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
 * Contact Block: contact5
 * Design: STACKED WITH ACCENT
 *
 * - Vertical accent bar kiri (konsisten products3 / cta5)
 * - Layout: kiri info stacked, kanan map (kalau showMap=true)
 * - Form full-width di bawah kalau showForm=true
 * - Info rows dengan label mono + value, divide-y
 * - WA CTA di footer row kalau no form
 */
export function Contact5({
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
}: Contact5Props) {
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

      {/* ── Top rule ── */}
      <div className="h-px bg-border mb-10 md:mb-14" />

      {/* ── Main layout with accent bar ── */}
      <div className="flex gap-6 md:gap-8 items-stretch">

        {/* Vertical accent bar — konsisten products3 / cta5 */}
        <div className="w-0.5 bg-foreground rounded-full shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="mb-8 md:mb-12 space-y-2.5">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Kontak Kami
            </p>
            <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                {subtitle}
              </p>
            )}
          </div>

          {/* Info + optional map side by side */}
          <div className={`grid gap-8 md:gap-12 ${showMap && mapUrl ? 'md:grid-cols-2' : ''}`}>

            {/* Info rows */}
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
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40
                                        group-hover:text-green-600 group-hover:translate-x-0.5
                                        transition-all duration-200" />
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

              {/* WA CTA footer row jika no form */}
              {!showForm && whatsappLink && (
                <div className="flex items-center justify-between py-4">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40">
                    Respon cepat
                  </span>
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
            </div>

            {/* Map (kanan kalau showMap) */}
            {showMap && mapUrl && (
              <div className="rounded-2xl overflow-hidden border border-border h-full min-h-[280px]">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '280px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              </div>
            )}
          </div>

          {/* Form full-width di bawah */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-10 md:mt-12 border border-border rounded-2xl p-6 md:p-8 space-y-5">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                Kirim Pesan
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="c5-name" className="text-xs font-medium">Nama</Label>
                  <Input
                    id="c5-name"
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c5-email" className="text-xs font-medium">Email</Label>
                  <Input
                    id="c5-email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c5-message" className="text-xs font-medium">Pesan</Label>
                <Textarea
                  id="c5-message"
                  placeholder="Tulis pesan Anda..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  Kirim via WhatsApp
                </Button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* ── Bottom rule ── */}
      <div className="h-px bg-border mt-10 md:mt-14" />

    </section>
  );
}
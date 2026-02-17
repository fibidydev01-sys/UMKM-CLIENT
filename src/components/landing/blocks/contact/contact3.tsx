'use client';

import { useState } from 'react';
import { Phone, MapPin, MessageCircle, Mail, Send, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Contact3Props {
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
 * Contact Block: contact3
 * Design: FULL WIDTH GRID
 *
 * - Header: split kiri judul + kanan subtitle (konsisten products3/cta5)
 * - Info kontak: grid 2-col md:4-col, tiap cell border-r + label mono atas
 * - Form: full-width di bawah grid kalau showForm=true
 * - Map: full-width di paling bawah kalau showMap=true
 * - Zero icon bubble, zero card — typographic grid
 */
export function Contact3({
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
}: Contact3Props) {
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

  // Build contact items dynamically
  const contactItems = [
    whatsapp && whatsappLink
      ? {
        key: 'wa',
        label: 'WhatsApp',
        value: `+${whatsapp}`,
        href: whatsappLink,
        external: true,
        icon: MessageCircle,
        hoverClass: 'hover:text-green-600',
      }
      : null,
    phone
      ? { key: 'phone', label: 'Telepon', value: phone, href: `tel:${phone}`, external: false, icon: Phone, hoverClass: 'hover:text-foreground/70' }
      : null,
    email
      ? { key: 'email', label: 'Email', value: email, href: `mailto:${email}`, external: false, icon: Mail, hoverClass: 'hover:text-foreground/70' }
      : null,
    address
      ? { key: 'address', label: 'Alamat', value: address, href: null, external: false, icon: MapPin, hoverClass: '' }
      : null,
  ].filter(Boolean) as NonNullable<typeof contactItems[number]>[];

  return (
    <section id="contact" className="py-20 md:py-28">

      {/* ── Split Header ── */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-10 md:mb-14">
        <div className="flex gap-5 items-stretch">
          <div className="w-0.5 bg-foreground rounded-full self-stretch shrink-0" />
          <div className="space-y-2.5">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Kontak Kami
            </p>
            <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
              {title}
            </h2>
          </div>
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs lg:text-right">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Contact Grid ── */}
      <div
        className="grid border-t border-foreground"
        style={{
          gridTemplateColumns: `repeat(${Math.min(contactItems.length, 4)}, 1fr)`,
        }}
      >
        {contactItems.map((item, index) => {
          const isLast = index === contactItems.length - 1;
          const Icon = item.icon;
          const inner = (
            <div className="py-6 px-5 space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  {item.label}
                </p>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {item.value}
              </p>
              {item.href && (
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40
                               group-hover:text-foreground/60 transition-colors duration-200">
                  {item.key === 'wa' ? 'Chat →' : item.key === 'email' ? 'Kirim →' : 'Hubungi →'}
                </p>
              )}
            </div>
          );

          return item.href ? (
            <a
              key={item.key}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={`group border-b border-foreground transition-colors duration-200
                          ${!isLast ? 'border-r' : ''} ${item.hoverClass}`}
            >
              {inner}
            </a>
          ) : (
            <div
              key={item.key}
              className={`border-b border-foreground ${!isLast ? 'border-r border-foreground' : ''}`}
            >
              {inner}
            </div>
          );
        })}
      </div>

      {/* ── Form (optional) ── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-10 md:mt-14 border border-border rounded-2xl p-6 md:p-8 space-y-5">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
            Kirim Pesan
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="c3-name" className="text-xs font-medium">Nama</Label>
              <Input
                id="c3-name"
                placeholder="Nama Anda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c3-email" className="text-xs font-medium">Email</Label>
              <Input
                id="c3-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c3-message" className="text-xs font-medium">Pesan</Label>
            <Textarea
              id="c3-message"
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

      {/* ── WA CTA jika no form ── */}
      {!showForm && whatsappLink && (
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/60">
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

      {/* ── Map full width ── */}
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
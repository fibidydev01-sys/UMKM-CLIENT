'use client';

import Link from 'next/link';
import {
  Store,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Home,
  Bot,
  Ban,
  Flag,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// FOOTER DATA - V8.1 Copywriting (UPDATED - tambah About)
// ══════════════════════════════════════════════════════════════

const footerLinks = {
  produk: [
    { label: 'Tentang', href: '/about' },
    { label: 'Fitur', href: '/fitur' },
    { label: 'Cara Kerja', href: '/cara-kerja' },
    { label: 'Harga', href: '/harga' },
  ],
  bantuan: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Dokumentasi', href: '/docs' },
    { label: 'Kontak', href: '/contact' },
  ],
  legal: [
    { label: 'Privasi', href: '/privacy' },
    { label: 'Syarat Layanan', href: '/terms' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/fibidy.id', icon: Instagram },
    { label: 'Twitter', href: 'https://twitter.com/fibidy_id', icon: Twitter },
  ],
};

// Value strip items with icons
const valueStrip = [
  { icon: Home, text: 'Alamat sendiri' },
  { icon: Bot, text: 'Fibidy AI' },
  { icon: Ban, text: 'Tanpa iklan' },
  { icon: Flag, text: 'Made in Indonesia' },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT (No Globe - replaced with gradient)
// ══════════════════════════════════════════════════════════════

export function LandingFooter() {
  return (
    <footer className="relative border-t bg-background overflow-hidden">
      {/* ════════════════════════════════════════════════════════ */}
      {/* GRADIENT BACKGROUND (replaces Globe)                     */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-1/4 -bottom-1/2 w-[800px] h-[800px] opacity-20">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/30 via-pink-500/20 to-purple-500/10 blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* ════════════════════════════════════════════════════ */}
          {/* BRAND COLUMN                                         */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl">Fibidy</span>
            </Link>

            {/* Tagline - V8.1 */}
            <p className="text-muted-foreground mb-6 max-w-xs">
              Toko online untuk produk & jasa.
              <br />
              Lebih gampang dicari.
            </p>

            {/* Contact */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@fibidy.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* PRODUK COLUMN (UPDATED)                              */}
          {/* ════════════════════════════════════════════════════ */}
          <div>
            <h4 className="font-semibold mb-4">Produk</h4>
            <ul className="space-y-3">
              {footerLinks.produk.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* BANTUAN COLUMN                                       */}
          {/* ════════════════════════════════════════════════════ */}
          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-3">
              {footerLinks.bantuan.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* LEGAL COLUMN                                         */}
          {/* ════════════════════════════════════════════════════ */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* BOTTOM SECTION (Icons instead of emojis)                 */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Fibidy. All rights reserved.
            </p>

            {/* Value Strip - V8.1 (Icons instead of emojis) */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {valueStrip.map((item, index) => (
                <span key={item.text} className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.text}
                  {index < valueStrip.length - 1 && (
                    <span className="ml-3 text-muted-foreground/30">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
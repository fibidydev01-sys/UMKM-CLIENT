'use client';

// ══════════════════════════════════════════════════════════════
// LANDING FOOTER — V13.0 Raycast Standard
// Clean footer, separator, CSS vars only
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

const footerLinks = {
  produk: [
    { label: 'Tentang', href: '/about' },
    { label: 'Fitur', href: '/features' },
    { label: 'Cara Kerja', href: '/how-it-works' },
    { label: 'Harga', href: '/pricing' },
    { label: 'Profil', href: '/profile' },
  ],
  bantuan: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Kontak', href: '/contact' },
  ],
  legal: [
    { label: 'Privasi', href: '/privacy' },
    { label: 'Syarat Layanan', href: '/terms' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/fibidy_com', icon: Instagram },
    { label: 'TikTok', href: 'https://tiktok.com/@fibidy.com', icon: TikTokIcon },
    { label: 'X / Twitter', href: 'https://twitter.com/fibidy42581', icon: Twitter },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-4 pt-16 pb-0">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block font-black text-xl tracking-tight mb-5 hover:text-primary transition-colors">
              Fibidy
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Situs online untuk produk & jasa.
              <br />
              Rumah digital kamu.
            </p>
            <div className="space-y-1 text-sm text-muted-foreground mb-6">
              <p>admin@fibidy.com</p>
              <p>Madiun, Jawa Timur</p>
            </div>
            {/* Social */}
            <div className="flex gap-2">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Produk */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-4">Produk</p>
            <ul className="space-y-3">
              {footerLinks.produk.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-4">Bantuan</p>
            <ul className="space-y-3">
              {footerLinks.bantuan.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-4">Legal</p>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <Separator className="bg-border/60" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Fibidy. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Made in Indonesia 🇮🇩
          </p>
        </div>

      </div>
    </footer>
  );
}
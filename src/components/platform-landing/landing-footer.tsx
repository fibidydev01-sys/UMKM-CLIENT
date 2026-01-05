'use client';

import Link from 'next/link';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from 'lucide-react';
import { Globe } from '@/components/ui/globe';

const footerLinks = {
  product: [
    { label: 'Fitur', href: '#features' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Testimoni', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ],
  company: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Karir', href: '/careers' },
    { label: 'Kontak', href: '/contact' },
  ],
  legal: [
    { label: 'Kebijakan Privasi', href: '/privacy' },
    { label: 'Syarat & Ketentuan', href: '/terms' },
    { label: 'Keamanan', href: '/security' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/fibidy.id', icon: Instagram },
    { label: 'Facebook', href: 'https://facebook.com/fibidy.id', icon: Facebook },
    { label: 'Twitter', href: 'https://twitter.com/fibidy_id', icon: Twitter },
    { label: 'Youtube', href: 'https://youtube.com/@fibidy', icon: Youtube },
  ],
};

export function LandingFooter() {
  return (
    <footer className="relative border-t bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-1/4 -bottom-1/2 w-[800px] h-[800px] opacity-30">
          <Globe className="w-full h-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl">Fibidy</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Platform toko online all-in-one untuk UMKM Indonesia.
              Mudah, cepat, dan gratis selamanya.
            </p>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@fibidy.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+62 812 3456 7890</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

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

          <div>
            <h4 className="font-semibold mb-4">Produk</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Fibidy. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Dibuat untuk UMKM Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
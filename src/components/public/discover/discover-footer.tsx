// ══════════════════════════════════════════════════════════════
// DISCOVER FOOTER — V13.1
// Added: Tombol Masuk
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const mainNavLinks = [
  { label: 'Tentang', href: '/about' },
  { label: 'Fitur', href: '/features' },
  { label: 'Cara Kerja', href: '/how-it-works' },
  { label: 'Harga', href: '/pricing' },
  { label: 'Profil', href: '/profile' },
  { label: 'FAQ', href: '/faq' },
];

const legalLinks = [
  { label: 'Syarat', href: '/terms' },
  { label: 'Privasi', href: '/privacy' },
  { label: 'Kontak', href: '/contact' },
];

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function DiscoverFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-4">

        {/* Main Row */}
        <div className="py-8 flex flex-col items-center gap-6 md:grid md:grid-cols-3 md:items-center">

          {/* Kiri — Tombol Masuk */}
          <div className="flex justify-center md:justify-start">
            <Button asChild variant="outline" size="sm" className="rounded-full px-6">
              <Link href="/login">Masuk</Link>
            </Button>
          </div>

          {/* Nav — tengah */}
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social — kanan */}
          <div className="flex items-center gap-2 md:justify-end justify-center">
            <a
              href="https://twitter.com/fibidy42581"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="X / Twitter"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com/fibidy_com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://tiktok.com/@fibidy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>

        </div>

        <Separator className="bg-border/60" />

        {/* Bottom Row */}
        <div className="py-5 flex flex-col-reverse items-center gap-3 text-sm text-muted-foreground md:grid md:grid-cols-3 md:items-center">

          {/* Kiri — copyright */}
          <span className="text-center md:text-left">© {new Date().getFullYear()} Fibidy</span>

          {/* Tengah — legal links */}
          <div className="flex items-center justify-center gap-1">
            {legalLinks.map((link, index) => (
              <span key={link.href} className="flex items-center">
                {index > 0 && <span className="mx-2 text-border">·</span>}
                <Link href={link.href} className="hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Kanan — kosong */}
          <div />

        </div>

      </div>
    </footer>
  );
}
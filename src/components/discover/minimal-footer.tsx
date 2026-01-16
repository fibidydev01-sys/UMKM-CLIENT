import Link from 'next/link';
import { Store } from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

const footerLinks = [
  { label: 'Tentang', href: '/about' },
  { label: 'Fitur', href: '/fitur' },
  { label: 'Harga', href: '/harga' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontak', href: '/contact' },
  { label: 'Privasi', href: '/privacy' },
  { label: 'Syarat', href: '/terms' },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function MinimalFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* ══════════════════════════════════════════════════ */}
          {/* LEFT: Logo + Copyright                             */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Store className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Fibidy</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* RIGHT: Links                                       */}
          {/* ══════════════════════════════════════════════════ */}
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            {footerLinks.map((link, index) => (
              <span key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                >
                  {link.label}
                </Link>
                {index < footerLinks.length - 1 && (
                  <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
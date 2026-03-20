// ══════════════════════════════════════════════════════════════
// MINIMAL FOOTER — V12.0
// Fixed: /fitur → /features, /harga → /pricing
// Removed: logo + Store icon
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';

const footerLinks = [
  { label: 'Tentang', href: '/about' },
  { label: 'Fitur', href: '/features' },
  { label: 'Harga', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontak', href: '/contact' },
  { label: 'Privasi', href: '/privacy' },
  { label: 'Syarat', href: '/terms' },
];

export function MinimalFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Kiri — Copyright */}
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fibidy
          </span>

          {/* Kanan — Links */}
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
                  <span className="text-border hidden sm:inline">·</span>
                )}
              </span>
            ))}
          </nav>

        </div>
      </div>
    </footer>
  );
}
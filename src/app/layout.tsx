import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import { seoConfig } from '@/config/seo.config';
import { getFullUrl } from '@/lib/seo';
import { OrganizationSchema } from '@/components/seo';
import './globals.css';

// ==========================================
// FONT CONFIGURATION
// ==========================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// ==========================================
// VIEWPORT CONFIGURATION
// ==========================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // For notch devices
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: seoConfig.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// ==========================================
// ROOT METADATA (Fallback for all pages)
// ==========================================

export const metadata: Metadata = {
  // ==========================================
  // BASIC META
  // ==========================================
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  keywords: [...seoConfig.defaultKeywords], // Spread to fix readonly

  // ==========================================
  // SITE INFO
  // ==========================================
  applicationName: seoConfig.siteName,
  authors: [{ name: seoConfig.siteName, url: seoConfig.siteUrl }],
  creator: seoConfig.siteName,
  publisher: seoConfig.siteName,
  generator: 'Next.js',

  // ==========================================
  // BASE URL
  // ==========================================
  metadataBase: new URL(seoConfig.siteUrl),

  // ==========================================
  // CANONICAL & LANGUAGES
  // ==========================================
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/',
    },
  },

  // ==========================================
  // ROBOTS
  // ==========================================
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ==========================================
  // ICONS
  // ==========================================
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },

  // ==========================================
  // MANIFEST (PWA)
  // ==========================================
  manifest: '/manifest.json',

  // ==========================================
  // OPEN GRAPH
  // ==========================================
  openGraph: {
    type: 'website',
    locale: seoConfig.locale,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [
      {
        url: getFullUrl(seoConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
  },

  // ==========================================
  // TWITTER
  // ==========================================
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    site: seoConfig.twitterHandle,
    creator: seoConfig.twitterHandle,
    images: [getFullUrl(seoConfig.defaultOgImage)],
  },

  // ==========================================
  // VERIFICATION
  // ==========================================
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },

  // ==========================================
  // APPLE MOBILE WEB APP (PWA)
  // ==========================================
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: seoConfig.siteName,
  },

  // ==========================================
  // FORMAT DETECTION
  // ==========================================
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // ==========================================
  // CATEGORY
  // ==========================================
  category: 'technology',
};

// ==========================================
// ROOT LAYOUT
// ==========================================

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preconnect to API (production) */}
        {seoConfig.isProduction && (
          <>
            <link rel="preconnect" href="https://api.fibidy.com" />
            <link rel="dns-prefetch" href="https://api.fibidy.com" />
          </>
        )}

        {/* PWA Theme Color (fallback) */}
        <meta name="theme-color" content="#ec4899" />

        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fibidy" />

        {/* MS Tile */}
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Organization + WebSite Schema (JSON-LD) */}
        <OrganizationSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Unified Providers (Theme + Hydration + PWA) */}
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
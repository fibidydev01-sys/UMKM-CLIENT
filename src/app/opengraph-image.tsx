import { ImageResponse } from 'next/og';

// ==========================================
// DEFAULT PLATFORM OPEN GRAPH IMAGE
// Route: /opengraph-image
// ==========================================

export const runtime = 'edge';
export const alt = 'Fibidy - Platform Toko Online untuk UMKM Indonesia';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function OgImage() {
  // ✅ Fetch logo dari public folder
  const logoUrl = new URL('/apple-touch-icon.png', 'https://www.fibidy.com').toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // ✅ FIX: warna brand Fibidy #FF1F6D
          background: 'linear-gradient(135deg, #FF1F6D 0%, #cc1257 100%)',
          padding: '60px',
        }}
      >
        {/* ✅ Logo Fibidy dari public */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            background: 'white',
            borderRadius: '24px',
            marginBottom: '40px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Fibidy"
            width={96}
            height={96}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Fibidy
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          Platform Toko Online untuk UMKM Indonesia
        </div>

        {/* Features Row */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '50px',
          }}
        >
          {['✓ Gratis', '✓ Mudah', '✓ WhatsApp Order'].map((f) => (
            <div
              key={f}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: '500',
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
          }}
        >
          fibidy.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
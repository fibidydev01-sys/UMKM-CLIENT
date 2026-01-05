import { ImageResponse } from 'next/og';
import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, OG_COLORS } from '@/lib/og-utils';

// ==========================================
// DEFAULT TWITTER IMAGE
// Route: /twitter-image
// ==========================================

export const runtime = 'edge';
export const alt = 'Fibidy - Platform Toko Online untuk UMKM Indonesia';
export const size = {
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
};
export const contentType = 'image/png';

export default async function TwitterImage() {
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
          background: `linear-gradient(135deg, ${OG_COLORS.primary} 0%, ${OG_COLORS.primaryDark} 100%)`,
          padding: '60px',
        }}
      >
        {/* Logo Container */}
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
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke={OG_COLORS.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            textAlign: 'center',
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
          {['✓ Gratis', '✓ Mudah', '✓ WhatsApp Order'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: '500',
              }}
            >
              {feature}
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
          }}
        >
          fibidy.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
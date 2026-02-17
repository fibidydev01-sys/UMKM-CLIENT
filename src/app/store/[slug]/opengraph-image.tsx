/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

// ==========================================
// TENANT STORE OPEN GRAPH IMAGE - FIXED
// Route: /store/[slug]/opengraph-image
// ==========================================

// ✅ FIX: Edge runtime untuk stability
export const runtime = 'edge';
export const alt = 'Toko Online';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

// ==========================================
// INLINE HELPERS (No external dependencies)
// ==========================================

const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  text: '#111827',
  textLight: '#6b7280',
  backgroundGray: '#f3f4f6',
};

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  return 'http://localhost:8000/api';
}

// ==========================================
// FALLBACK IMAGE
// ==========================================
function createFallbackImage(message: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: COLORS.backgroundGray,
          fontSize: '48px',
          color: COLORS.textLight,
        }}
      >
        {message}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

// ==========================================
// FETCH TENANT
// ==========================================
async function getTenant(slug: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/tenants/by-slug/${slug}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default async function TenantOgImage({ params }: Props) {
  try {
    const { slug } = await params;

    if (!slug) {
      return createFallbackImage('Invalid Request');
    }

    const tenant = await getTenant(slug);

    if (!tenant) {
      return createFallbackImage('Toko Tidak Ditemukan');
    }

    const productCount = tenant._count?.products || 0;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '30px 50px',
              background: COLORS.primary,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '32px' }}>🏪</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex' }}>
                Fibidy
              </div>
            </div>
            <div style={{ color: 'white', fontSize: '20px', display: 'flex' }}>
              {slug}.fibidy.com
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '50px',
              gap: '50px',
            }}
          >
            {/* Logo/Avatar */}
            <div
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '24px',
                background: tenant.logo
                  ? 'white'
                  : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                border: tenant.logo ? '4px solid #f1f5f9' : 'none',
                overflow: 'hidden',
              }}
            >
              {tenant.logo ? (
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  width="200"
                  height="200"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '80px',
                    color: 'white',
                    fontWeight: 'bold',
                    display: 'flex',
                  }}
                >
                  {getInitials(tenant.name)}
                </div>
              )}
            </div>

            {/* Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                flex: 1,
              }}
            >
              {/* Store Name */}
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: COLORS.text,
                  lineHeight: 1.1,
                  display: 'flex',
                }}
              >
                {truncateText(tenant.name, 30)}
              </div>

              {/* Description */}
              {tenant.description && (
                <div
                  style={{
                    fontSize: '28px',
                    color: COLORS.textLight,
                    lineHeight: 1.4,
                    display: 'flex',
                  }}
                >
                  {truncateText(tenant.description, 80)}
                </div>
              )}

              {/* Stats Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '30px',
                  marginTop: '20px',
                }}
              >
                {/* Product Count */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '22px',
                    color: COLORS.textLight,
                  }}
                >
                  <div style={{ fontSize: '24px' }}>📦</div>
                  <div style={{ display: 'flex' }}>{productCount}+ Produk</div>
                </div>

                {/* WhatsApp */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '22px',
                    color: '#25D366',
                  }}
                >
                  <div style={{ fontSize: '24px' }}>💬</div>
                  <div style={{ display: 'flex' }}>WhatsApp Order</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (error: any) {
    console.error('[OG-Tenant] Error:', error.message);
    return createFallbackImage('Error Generating Image');
  }
}
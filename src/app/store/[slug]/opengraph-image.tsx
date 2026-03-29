/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { getApiUrl } from '@/lib/public';

// ==========================================
// TENANT STORE OPEN GRAPH IMAGE
// Route: /store/[slug]/opengraph-image
// ==========================================

export const runtime = 'edge';
export const alt = 'Toko Online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

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
          background: '#ffffff',
          fontSize: '32px',
          color: '#9ca3af',
        }}
      >
        {message}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

async function getTenant(slug: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${apiUrl}/tenants/by-slug/${slug}`, {
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

export default async function TenantOgImage({ params }: Props) {
  try {
    const { slug } = await params;
    if (!slug) return createFallbackImage('Invalid Request');

    const tenant = await getTenant(slug);
    if (!tenant) return createFallbackImage('Toko Tidak Ditemukan');

    const productCount = tenant._count?.products || 0;
    const category = tenant.category || null;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: '#ffffff',
            padding: '80px',
          }}
        >
          {/* Left — Store Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginRight: '64px',
              paddingTop: '8px',
            }}
          >
            {tenant.logo ? (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexShrink: 0,
                }}
              >
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  width="120"
                  height="120"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '16px',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#111827',
                    display: 'flex',
                  }}
                >
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Right — Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            {/* Top */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {category && (
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#9ca3af',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: '20px',
                    display: 'flex',
                  }}
                >
                  {category}
                </div>
              )}

              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: '#111827',
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                {tenant.name}
              </div>

              {tenant.description && (
                <div
                  style={{
                    fontSize: '24px',
                    color: '#6b7280',
                    lineHeight: 1.5,
                    marginTop: '20px',
                    display: 'flex',
                    maxWidth: '600px',
                  }}
                >
                  {tenant.description.length > 100
                    ? tenant.description.substring(0, 100) + '...'
                    : tenant.description}
                </div>
              )}
            </div>

            {/* Bottom */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Separator */}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  background: '#e5e7eb',
                  marginBottom: '28px',
                  display: 'flex',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#9ca3af',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'flex',
                    }}
                  >
                    {slug}.fibidy.com
                  </div>
                  <div
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: '#d1d5db',
                      display: 'flex',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#9ca3af',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'flex',
                    }}
                  >
                    {productCount} Produk
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '18px',
                    color: '#d1d5db',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'flex',
                  }}
                >
                  fibidy.com
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
    return createFallbackImage('Error');
  }
}
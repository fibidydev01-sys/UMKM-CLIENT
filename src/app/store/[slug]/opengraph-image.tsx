import { ImageResponse } from 'next/og';
import {
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_COLORS,
  getOgInitials,
  truncateOgText,
} from '@/lib/og-utils';

// ==========================================
// TENANT STORE OPEN GRAPH IMAGE
// Route: /store/[slug]/opengraph-image
// ==========================================

export const runtime = 'edge';
export const alt = 'Toko Online';
export const size = {
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch tenant data
async function getTenant(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${apiUrl}/tenants/by-slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TenantOgImage({ params }: Props) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  // Fallback if tenant not found
  if (!tenant) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: OG_COLORS.backgroundGray,
            fontSize: '48px',
            color: OG_COLORS.textLight,
          }}
        >
          Toko Tidak Ditemukan
        </div>
      ),
      { ...size }
    );
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
            background: OG_COLORS.primary,
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Fibidy</span>
          </div>
          <div style={{ color: 'white', fontSize: '20px' }}>
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
                : `linear-gradient(135deg, ${OG_COLORS.primary}, ${OG_COLORS.primaryDark})`,
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
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span style={{ fontSize: '80px', color: 'white', fontWeight: 'bold' }}>
                {getOgInitials(tenant.name)}
              </span>
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
                color: OG_COLORS.text,
                lineHeight: 1.1,
              }}
            >
              {truncateOgText(tenant.name, 30)}
            </div>

            {/* Description */}
            {tenant.description && (
              <div
                style={{
                  fontSize: '28px',
                  color: OG_COLORS.textLight,
                  lineHeight: 1.4,
                }}
              >
                {truncateOgText(tenant.description, 80)}
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
                  color: OG_COLORS.textLight,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
                </svg>
                {productCount}+ Produk
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                WhatsApp Order
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
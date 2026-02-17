/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

// ==========================================
// PRODUCT OPEN GRAPH IMAGE - STANDALONE
// Route: /store/[slug]/products/[id]/opengraph-image
// ==========================================

export const runtime = 'edge';
export const alt = 'Product';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

// ==========================================
// INLINE HELPERS (No external dependencies)
// ==========================================

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const COLORS = {
  primary: '#2563eb',
  text: '#111827',
  textLight: '#6b7280',
  backgroundGray: '#f3f4f6',
  error: '#ef4444',
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

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
  // Production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  // Local
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

function optimizeImageUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    // Cloudinary
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_600,h_600,c_limit,q_auto,f_auto/');
    }

    // Unsplash
    if (url.includes('images.unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', '600');
      urlObj.searchParams.set('h', '600');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('q', '80');
      return urlObj.toString();
    }

    return url;
  } catch {
    return null;
  }
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: COLORS.backgroundGray,
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Fibidy
        </div>
        <div
          style={{
            fontSize: '28px',
            color: COLORS.textLight,
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );
}

// ==========================================
// FETCH FUNCTIONS
// ==========================================
async function getProduct(id: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/products/public/${id}`;

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
export default async function ProductOgImage({ params }: Props) {
  try {
    const { slug, id } = await params;

    if (!slug || !id) {
      return createFallbackImage('Invalid Request');
    }

    const [tenant, product] = await Promise.all([
      getTenant(slug),
      getProduct(id),
    ]);

    if (!tenant) {
      return createFallbackImage('Toko Tidak Ditemukan');
    }

    if (!product) {
      return createFallbackImage('Produk Tidak Ditemukan');
    }

    // Extract image
    const rawImageUrl =
      typeof product?.images?.[0] === 'string'
        ? product.images[0]
        : product?.images?.[0]?.url || product?.images?.[0]?.secure_url || null;

    const productImage = optimizeImageUrl(rawImageUrl);
    const productName = product.name || 'Produk';
    const productPrice = product.price || 0;
    const productCategory = product.category || null;
    const comparePrice = product.comparePrice || null;

    const hasDiscount = comparePrice && comparePrice > productPrice;
    const discountPercent = hasDiscount
      ? Math.round((1 - productPrice / comparePrice) * 100)
      : 0;

    const tenantName = tenant.name || 'Toko';

    // ==========================================
    // RENDER OG IMAGE
    // ==========================================
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: 'white',
          }}
        >
          {/* Left Side - Product Image */}
          <div
            style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: COLORS.backgroundGray,
              position: 'relative',
            }}
          >
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                style={{
                  maxWidth: '85%',
                  maxHeight: '85%',
                  objectFit: 'contain',
                  borderRadius: '16px',
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  color: COLORS.textLight,
                }}
              >
                <div style={{ fontSize: '120px' }}>📦</div>
                <span style={{ fontSize: '24px' }}>No Image</span>
              </div>
            )}

            {hasDiscount && (
              <div
                style={{
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  background: COLORS.error,
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '28px',
                  fontWeight: 'bold',
                }}
              >
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div
            style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '50px',
            }}
          >
            {productCategory && (
              <div
                style={{
                  fontSize: '20px',
                  color: COLORS.primary,
                  fontWeight: '600',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {productCategory}
              </div>
            )}

            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: COLORS.text,
                lineHeight: 1.2,
                marginBottom: '20px',
              }}
            >
              {truncateText(productName, 50)}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '15px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: COLORS.primary,
                }}
              >
                {formatPrice(productPrice)}
              </div>
              {hasDiscount && comparePrice && (
                <div
                  style={{
                    fontSize: '28px',
                    color: COLORS.textLight,
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(comparePrice)}
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '20px',
                background: COLORS.backgroundGray,
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: COLORS.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  {getInitials(tenantName)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '22px', fontWeight: '600', color: COLORS.text }}>
                  {truncateText(tenantName, 25)}
                </div>
                <div style={{ fontSize: '18px', color: COLORS.textLight }}>
                  {slug}.fibidy.com
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#25D366',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              <span style={{ fontSize: '28px' }}>💬</span>
              Order via WhatsApp
            </div>
          </div>
        </div>
      ),
      { width: OG_WIDTH, height: OG_HEIGHT }
    );
  } catch (error: any) {
    console.error('[OG] Fatal error:', error.message);
    return createFallbackImage('Error Generating Image');
  }
}
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import {
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_COLORS,
  formatOgPrice,
  truncateOgText,
  getOgInitials,
  getApiUrl,
} from '@/lib/og-utils';

// ==========================================
// PRODUCT OPEN GRAPH IMAGE - FIXED VERSION
// Route: /store/[slug]/products/[id]/opengraph-image
// ==========================================

// ✅ FIX #1: Edge runtime untuk stability
export const runtime = 'edge';
export const alt = 'Product';
export const size = {
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

// ==========================================
// HELPER: Create Fallback Image
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
          background: OG_COLORS.backgroundGray,
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: OG_COLORS.text,
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Fibidy
        </div>
        <div
          style={{
            fontSize: '28px',
            color: OG_COLORS.textLight,
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      </div>
    ),
    { ...size }
  );
}

// ==========================================
// FETCH: Product Data with Timeout
// ==========================================
async function getProduct(id: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/products/public/${id}`;

  console.log('[OG-Product] Fetching:', endpoint);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[OG-Product] Status:', res.status);

    if (!res.ok) {
      console.error('[OG-Product] API returned error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log('[OG-Product] Product fetched:', data?.name || 'no name');
    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('[OG-Product] Timeout after 5s');
    } else {
      console.error('[OG-Product] Fetch error:', err.message);
    }
    return null;
  }
}

// ==========================================
// FETCH: Tenant Data with Timeout
// ==========================================
async function getTenant(slug: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/tenants/by-slug/${slug}`;

  console.log('[OG-Product] Fetching tenant:', endpoint);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[OG-Product] Tenant status:', res.status);

    if (!res.ok) {
      console.error('[OG-Product] Tenant API error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log('[OG-Product] Tenant fetched:', data?.name || 'no name');
    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('[OG-Product] Tenant timeout after 5s');
    } else {
      console.error('[OG-Product] Tenant fetch error:', err.message);
    }
    return null;
  }
}

// ==========================================
// MAIN: Generate OG Image
// ==========================================
export default async function ProductOgImage({ params }: Props) {
  try {
    const { slug, id } = await params;
    console.log('[OG-Product] Generating for slug:', slug, 'id:', id);

    // ✅ Validate params
    if (!slug || !id) {
      console.error('[OG-Product] Missing params');
      return createFallbackImage('Invalid Request');
    }

    // ✅ Fetch data with parallel requests
    const [tenant, product] = await Promise.all([
      getTenant(slug),
      getProduct(id),
    ]);

    // ✅ Handle missing tenant
    if (!tenant) {
      console.error('[OG-Product] Tenant not found');
      return createFallbackImage('Toko Tidak Ditemukan');
    }

    // ✅ Handle missing product
    if (!product) {
      console.error('[OG-Product] Product not found');
      return createFallbackImage('Produk Tidak Ditemukan');
    }

    // ✅ Safe data extraction with defaults
    const productImage =
      typeof product?.images?.[0] === 'string'
        ? product.images[0]
        : product?.images?.[0]?.url ||
        product?.images?.[0]?.secure_url ||
        null;
    const productName = product.name || 'Produk';
    const productPrice = product.price || 0;
    const productCategory = product.category || null;
    const comparePrice = product.comparePrice || null;

    const hasDiscount = comparePrice && comparePrice > productPrice;
    const discountPercent = hasDiscount
      ? Math.round((1 - productPrice / comparePrice) * 100)
      : 0;

    const tenantName = tenant.name || 'Toko';

    console.log('[OG-Product] Rendering image for:', productName);

    // ==========================================
    // RENDER: OG Image
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
              background: OG_COLORS.backgroundGray,
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
              // ✅ FIX #2: Hapus SVG, ganti dengan emoji
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  color: OG_COLORS.textLight,
                }}
              >
                <div style={{ fontSize: '120px' }}>📦</div>
                <span style={{ fontSize: '24px' }}>No Image</span>
              </div>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <div
                style={{
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  background: OG_COLORS.error,
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
            {/* Category Badge */}
            {productCategory && (
              <div
                style={{
                  fontSize: '20px',
                  color: OG_COLORS.primary,
                  fontWeight: '600',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {productCategory}
              </div>
            )}

            {/* Product Name */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: OG_COLORS.text,
                lineHeight: 1.2,
                marginBottom: '20px',
              }}
            >
              {truncateOgText(productName, 50)}
            </div>

            {/* Price */}
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
                  color: OG_COLORS.primary,
                }}
              >
                {formatOgPrice(productPrice)}
              </div>
              {hasDiscount && comparePrice && (
                <div
                  style={{
                    fontSize: '28px',
                    color: OG_COLORS.textLight,
                    textDecoration: 'line-through',
                  }}
                >
                  {formatOgPrice(comparePrice)}
                </div>
              )}
            </div>

            {/* Store Info Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '20px',
                background: OG_COLORS.backgroundGray,
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: OG_COLORS.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  {getOgInitials(tenantName)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '22px', fontWeight: '600', color: OG_COLORS.text }}>
                  {truncateOgText(tenantName, 25)}
                </div>
                <div style={{ fontSize: '18px', color: OG_COLORS.textLight }}>
                  {slug}.fibidy.com
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            {/* ✅ FIX #3: Hapus SVG, ganti dengan emoji */}
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
      { ...size }
    );
  } catch (error: any) {
    // ✅ Catch-all error handler
    console.error('[OG-Product] Fatal error:', error.message);
    return createFallbackImage('Error Generating Image');
  }
}
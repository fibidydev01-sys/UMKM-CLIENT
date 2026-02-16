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
// PRODUCT OPEN GRAPH IMAGE - SUPER ROBUST VERSION
// Route: /store/[slug]/products/[id]/opengraph-image
// ==========================================

// ✅ FIX: nodejs runtime untuk production stability
export const runtime = 'nodejs';
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
// FETCH: Product Data with Timeout & Retry
// ==========================================
async function getProduct(id: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/products/public/${id}`;

  console.log('[OG-Product] Fetching:', endpoint);

  try {
    // ✅ Timeout after 5 seconds
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
// FETCH: Tenant Data with Timeout & Retry
// ==========================================
async function getTenant(slug: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/tenants/by-slug/${slug}`;

  console.log('[OG-Product] Fetching tenant:', endpoint);

  try {
    // ✅ Timeout after 5 seconds
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
    const productImage = product.images?.[0] || null;
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  color: OG_COLORS.textLight,
                }}
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
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
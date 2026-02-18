import { ImageResponse } from 'next/og';

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
// HELPERS
// ==========================================
function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  return 'http://localhost:8000/api';
}

function optimizeImageUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_600,h_600,c_limit,q_80,f_auto/');
    }
    if (url.includes('images.unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', '600');
      urlObj.searchParams.set('h', '600');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('q', '80');
      urlObj.searchParams.set('auto', 'format');
      return urlObj.toString();
    }
    return url;
  } catch {
    return null;
  }
}

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
          // ✅ FIX: pink brand
          background: 'linear-gradient(135deg, #FF1F6D 0%, #cc1257 100%)',
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', display: 'flex' }}>
          Fibidy
        </div>
        <div style={{ fontSize: '28px', color: 'rgba(255,255,255,0.8)', display: 'flex', marginTop: '20px' }}>
          {message}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

async function getProduct(id: string): Promise<any | null> {
  const apiUrl = getApiUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${apiUrl}/products/public/${id}`, {
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

// ==========================================
// MAIN COMPONENT
// ==========================================
export default async function ProductOgImage({ params }: Props) {
  try {
    const { slug, id } = await params;

    if (!slug || !id) return createFallbackImage('Invalid Request');

    const [tenant, product] = await Promise.all([getTenant(slug), getProduct(id)]);

    if (!tenant) return createFallbackImage('Toko Tidak Ditemukan');
    if (!product) return createFallbackImage('Produk Tidak Ditemukan');

    const productName = product.name || 'Produk';
    const productPrice = product.price || 0;
    const productCategory = product.category || null;
    const comparePrice = product.comparePrice || null;
    const tenantName = tenant.name || 'Toko';

    const hasDiscount = comparePrice && comparePrice > productPrice;
    const discountPercent = hasDiscount
      ? Math.round((1 - productPrice / comparePrice) * 100)
      : 0;

    const rawImageUrl =
      typeof product?.images?.[0] === 'string'
        ? product.images[0]
        : product?.images?.[0]?.url || product?.images?.[0]?.secure_url || null;

    const productImage = optimizeImageUrl(rawImageUrl);

    const getInitials = (name: string) =>
      name.split(' ').map((w) => w[0]).join('').toUpperCase().substring(0, 2);

    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', background: 'white' }}>

          {/* Left Side - Product Image */}
          <div
            style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f9f0f4', // ✅ pink tint
              position: 'relative',
            }}
          >
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                width="510"
                height="535"
                style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain', borderRadius: '16px' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '120px' }}>📦</div>
                <div style={{ fontSize: '24px', color: '#6b7280', display: 'flex' }}>No Image</div>
              </div>
            )}

            {hasDiscount && (
              <div
                style={{
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  background: '#FF1F6D', // ✅ pink brand
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  display: 'flex',
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
            {/* Category */}
            {productCategory && (
              <div
                style={{
                  fontSize: '20px',
                  color: '#FF1F6D', // ✅ pink brand
                  fontWeight: '600',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
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
                color: '#111827',
                marginBottom: '20px',
                display: 'flex',
              }}
            >
              {productName.length > 50 ? productName.substring(0, 50) + '...' : productName}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '30px' }}>
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: '#FF1F6D', // ✅ pink brand
                  display: 'flex',
                  marginRight: '15px',
                }}
              >
                Rp {productPrice.toLocaleString('id-ID')}
              </div>
              {hasDiscount && comparePrice && (
                <div style={{ fontSize: '28px', color: '#6b7280', textDecoration: 'line-through', display: 'flex' }}>
                  Rp {comparePrice.toLocaleString('id-ID')}
                </div>
              )}
            </div>

            {/* Store Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                background: '#f9f0f4', // ✅ pink tint
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: '#FF1F6D', // ✅ pink brand
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                }}
              >
                <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', display: 'flex' }}>
                  {getInitials(tenantName)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827', display: 'flex' }}>
                  {tenantName}
                </div>
                <div style={{ fontSize: '18px', color: '#6b7280', display: 'flex' }}>
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
                color: '#25D366',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              <div style={{ fontSize: '28px', marginRight: '10px' }}>💬</div>
              Order via WhatsApp
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (error: any) {
    console.error('[OG] Error:', error.message);
    return createFallbackImage('Error Generating Image');
  }
}
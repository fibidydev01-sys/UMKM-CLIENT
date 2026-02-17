import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Product';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function ProductOgImage() {
  // ✅ HARDCODED TEST DATA
  const productName = 'Double Dragon Burger';
  const productPrice = 115000;
  const tenantName = 'Burger China';
  const slug = 'burgerchina';

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
        {/* Left Side - Icon */}
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f3f4f6',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '120px' }}>📦</div>
            <div style={{ fontSize: '24px', color: '#6b7280' }}>No Image</div>
          </div>
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
            {productName}
          </div>

          {/* Price */}
          <div
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#2563eb',
              marginBottom: '30px',
              display: 'flex',
            }}
          >
            Rp {productPrice.toLocaleString('id-ID')}
          </div>

          {/* Store Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              background: '#f3f4f6',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
              }}
            >
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                BC
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
    {
      width: 1200,
      height: 630,
    }
  );
}
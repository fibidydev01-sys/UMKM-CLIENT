import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Product';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function ProductOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hello World! 🍔
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
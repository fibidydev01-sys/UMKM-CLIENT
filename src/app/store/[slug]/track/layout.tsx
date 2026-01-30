import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lacak Pesanan - Tracking Order',
  description: 'Lacak status pesanan Anda dengan memasukkan nomor pesanan',
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}

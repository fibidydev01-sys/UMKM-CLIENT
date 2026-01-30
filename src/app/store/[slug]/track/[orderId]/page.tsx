import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TrackingPage } from '@/components/tracking/tracking-page';
import { API_URL } from '@/config/constants';

interface PageProps {
  params: Promise<{
    slug: string;
    orderId: string;
  }>;
}

async function getOrder(orderId: string) {
  try {
    const res = await fetch(`${API_URL}/store/track/${orderId}`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return {
      title: 'Pesanan Tidak Ditemukan',
    };
  }

  return {
    title: `Lacak Pesanan #${order.orderNumber} - ${order.tenant?.name || 'Toko'}`,
    description: `Status pesanan #${order.orderNumber} - ${order.status}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  return <TrackingPage order={order} />;
}

import type { Metadata } from 'next';
import { ChannelsClient } from './client';

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: 'Channels',
  description: 'Kelola pengaturan pencarian, pembayaran, dan pengiriman',
};

// ==========================================
// CHANNELS PAGE
// Pattern: page.tsx (server/metadata) + client.tsx (client/UI)
// Sticky tabs: Pencarian, Pembayaran, Pengiriman
// ==========================================

export default function ChannelsPage() {
  return <ChannelsClient />;
}

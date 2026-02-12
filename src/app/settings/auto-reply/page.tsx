import type { Metadata } from 'next';
import { AutoReplyClient } from './client';

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: 'Auto-Reply System',
  description: 'Kirim pesan WhatsApp otomatis berdasarkan berbagai trigger',
};

// ==========================================
// AUTO-REPLY PAGE
// Pattern: page.tsx (server/metadata) + client.tsx (client/UI)
// Overview dengan sticky tabs (Welcome, Keywords, Order Status, Payment)
// ==========================================

export default function AutoReplyPage() {
  return <AutoReplyClient />;
}

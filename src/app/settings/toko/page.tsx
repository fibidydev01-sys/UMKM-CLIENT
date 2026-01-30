import type { Metadata } from 'next';
import { TokoClient } from './client';

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: 'Informasi Toko',
  description: 'Kelola informasi toko dan konten landing page',
};

// ==========================================
// TOKO PAGE
// Pattern: page.tsx (server/metadata) + client.tsx (client/UI)
// Sticky tabs: Hero Section, About, Testimonials, Contact, CTA
// ==========================================

export default function TokoPage() {
  return <TokoClient />;
}

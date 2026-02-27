import type { Metadata } from 'next';
import { TokoClient } from './client';

export const metadata: Metadata = {
  title: 'Store Settings',
  description: 'Manage your store information and landing page content',
};

export default function TokoPage() {
  return <TokoClient />;
}
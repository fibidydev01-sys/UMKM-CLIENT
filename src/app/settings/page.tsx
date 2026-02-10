/**
 * ============================================================================
 * FILE: app/settings/page.tsx
 * ============================================================================
 * Route: /settings
 * Description: Redirect to default settings page (pembayaran)
 * Updated: January 2026
 * ============================================================================
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings/channels');
  }, [router]);

  return null;
}

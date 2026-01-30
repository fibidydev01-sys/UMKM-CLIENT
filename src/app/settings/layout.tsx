import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth';
import { SettingsLayout as SettingsLayoutComponent } from '@/components/settings';

// ==========================================
// SETTINGS LAYOUT
// Wraps all /settings routes with sidebar (like DashboardLayout)
// Pattern: AuthGuard → SettingsLayout (with sidebar) → children
// ==========================================

export const metadata: Metadata = {
  title: {
    template: '%s | Settings - Fibidy',
    default: 'Settings - Fibidy',
  },
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthGuard requireAuth redirectTo="/login">
      <SettingsLayoutComponent>{children}</SettingsLayoutComponent>
    </AuthGuard>
  );
}

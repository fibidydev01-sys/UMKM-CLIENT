import type { Metadata } from 'next';
import { DashboardQuickActions } from '@/components/dashboard';

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: 'Dashboard',
};

// ==========================================
// DASHBOARD PAGE
// Bento Grid Quick Actions - Full Height
// ==========================================

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header - compact */}
      <div className="text-center py-3 sm:py-4 lg:py-5 px-4 shrink-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
          Quick Actions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Akses cepat ke fitur-fitur utama
        </p>
      </div>

      {/* Bento Grid - Fill remaining space */}
      <div className="flex-1 min-h-0 px-3 sm:px-4 lg:px-6 pb-2 sm:pb-3">
        <div className="h-full max-w-5xl mx-auto">
          <DashboardQuickActions />
        </div>
      </div>
    </div>
  );
}
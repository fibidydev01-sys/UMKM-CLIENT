'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SettingsSidebar } from './settings-sidebar';
import { SettingsMobileNavbar } from './settings-mobile-navbar';

// ==========================================
// SETTINGS LAYOUT COMPONENT
// Clone of DashboardLayout for Settings
// - Sidebar (Desktop)
// - Mobile Bottom Navbar
// - NO Header
// ==========================================

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider>
      {/* Desktop Sidebar - Hidden on mobile */}
      <SettingsSidebar />

      <SidebarInset className="pb-20 md:pb-0">
        {/* Main Content with Container */}
        <div className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>

      {/* Mobile Bottom Navbar - Only on mobile */}
      <SettingsMobileNavbar />
    </SidebarProvider>
  );
}

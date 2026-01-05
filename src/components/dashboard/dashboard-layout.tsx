'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { DashboardShell } from './dashboard-shell';

// ==========================================
// DASHBOARD LAYOUT COMPONENT
// Main layout wrapper using shadcn sidebar
// ==========================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <DashboardShell>
          {children}
        </DashboardShell>
      </SidebarInset>
    </SidebarProvider>
  );
}
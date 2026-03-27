'use client';

import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardShell } from './dashboard-shell';
import { MobileNavbar } from './mobile-navbar';
import { NextStepWrapper } from '../shared/nextstep-wrapper';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isLandingBuilder = pathname?.includes('/landing-builder');

  return (
    <NextStepWrapper>
      <SidebarProvider>
        <DashboardSidebar />
        {isLandingBuilder ? (
          // Landing builder: sidebar tetap, tapi no header/shell/scroll
          <SidebarInset className="!overflow-hidden !p-0">
            {children}
          </SidebarInset>
        ) : (
          <SidebarInset className="pb-20 md:pb-0">
            <DashboardShell>
              {children}
            </DashboardShell>
          </SidebarInset>
        )}
        <MobileNavbar />
      </SidebarProvider>
    </NextStepWrapper>
  );
}
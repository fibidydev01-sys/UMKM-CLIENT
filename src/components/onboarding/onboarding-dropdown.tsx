"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconRocket } from '@tabler/icons-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useOnboarding } from '@/hooks/use-onboarding';

// ============================================
// ONBOARDING LINK COMPONENT (Sidebar)
// ============================================

export function OnboardingDropdown() {
  const pathname = usePathname();
  const { progress, isLoading } = useOnboarding();
  const isActive = pathname === '/dashboard/onboarding';

  if (isLoading || !progress) {
    return (
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href="/dashboard/onboarding">
          <IconRocket className="h-5 w-5 animate-pulse" />
          <span>Store Setup</span>
        </Link>
      </SidebarMenuButton>
    );
  }

  if (progress.percentage >= 100) {
    return null;
  }

  const remainingSteps = progress.totalSteps - progress.completedSteps;

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href="/dashboard/onboarding">
        <IconRocket className="h-5 w-5" />
        <span>Store Setup</span>
        {remainingSteps > 0 && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {remainingSteps}
          </span>
        )}
      </Link>
    </SidebarMenuButton>
  );
}
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconRocket } from '@tabler/icons-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useOnboarding } from '@/hooks/use-onboarding';

// ============================================
// ONBOARDING LINK COMPONENT (Sidebar)
// Same pattern as Dashboard and Inbox nav items
// ============================================

export function OnboardingDropdown() {
  const pathname = usePathname();
  const { progress, isLoading } = useOnboarding();
  const isActive = pathname === '/dashboard/onboarding';

  // Loading state
  if (isLoading || !progress) {
    return (
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href="/dashboard/onboarding">
          <IconRocket className="h-5 w-5 animate-pulse" />
          <span>Setup Toko</span>
        </Link>
      </SidebarMenuButton>
    );
  }

  // 100% complete - hide nav item
  if (progress.percentage >= 100) {
    return null;
  }

  const remainingSteps = progress.totalSteps - progress.completedSteps;

  // In progress - show rocket with badge
  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href="/dashboard/onboarding">
        <IconRocket className="h-5 w-5" />
        <span>Setup Toko</span>
        {remainingSteps > 0 && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {remainingSteps}
          </span>
        )}
      </Link>
    </SidebarMenuButton>
  );
}

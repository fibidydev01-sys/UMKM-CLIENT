"use client";

import { useState, useEffect } from 'react';
import {
  IconArchive,
  IconDots,
  IconMail,
  IconRefresh,
  IconTrophy,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useTenant } from '@/hooks/use-tenant';
import { CircularProgress } from './circular-progress';
import { OnboardingStep } from './onboarding-step';

// ============================================
// ONBOARDING WIZARD COMPONENT
// ============================================

export function OnboardingWizard() {
  const { tenant } = useTenant();
  const {
    progress,
    isLoading,
    isDismissed,
    dismissOnboarding,
    restoreOnboarding,
  } = useOnboarding();

  const [openStepId, setOpenStepId] = useState<string | null>(null);

  // Set initial open step (first incomplete)
  useEffect(() => {
    if (progress && !openStepId) {
      const firstIncomplete = progress.steps.find((s) => !s.completed);
      setOpenStepId(firstIncomplete?.id ?? progress.steps[0]?.id ?? null);
    }
  }, [progress, openStepId]);

  // Show dismissed state
  if (isDismissed) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Setup wizard disembunyikan
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={restoreOnboarding}
            className="text-xs"
          >
            <IconRefresh className="mr-1 size-3" />
            Tampilkan lagi
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !progress) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hide when 100% complete
  if (progress.percentage >= 100) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-center gap-3">
          <IconTrophy className="size-8 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Selamat! Profil toko lengkap!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Toko Anda sudah siap untuk menerima pelanggan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const remainingSteps = progress.totalSteps - progress.completedSteps;

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-foreground">
              Mulai dengan {tenant?.name || 'Toko Anda'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Lengkapi profil untuk meningkatkan visibilitas toko
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <CircularProgress
                completed={progress.completedSteps}
                total={progress.totalSteps}
                size={16}
              />
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {remainingSteps}
                </span>{' '}
                dari{' '}
                <span className="font-medium text-foreground">
                  {progress.totalSteps}
                </span>{' '}
                langkah tersisa
              </span>
            </div>

            {/* Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <IconDots className="size-4" aria-hidden="true" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={dismissOnboarding}>
                  <IconArchive className="mr-2 size-4" aria-hidden="true" />
                  Sembunyikan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    window.open('mailto:support@fibidy.com?subject=Feedback%20Onboarding')
                  }
                >
                  <IconMail className="mr-2 size-4" aria-hidden="true" />
                  Beri Feedback
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Critical Warning */}
        {!progress.canPublish && (
          <div className="border-b bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Lengkapi{' '}
              <strong>Logo</strong> dan{' '}
              <strong>Hero Background</strong> untuk dapat publish toko Anda.
            </p>
          </div>
        )}

        {/* Steps */}
        <div className="p-4">
          <div className="space-y-0">
            {progress.steps.map((step, index) => (
              <OnboardingStep
                key={step.id}
                step={step}
                isOpen={openStepId === step.id}
                onToggle={() =>
                  setOpenStepId(openStepId === step.id ? null : step.id)
                }
                isFirst={index === 0}
                isPrevOpen={
                  index > 0 && progress.steps[index - 1]?.id === openStepId
                }
              />
            ))}
          </div>
        </div>

        {/* Footer - Progress Bar */}
        <div className="border-t px-4 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress: {progress.percentage}%</span>
            {progress.milestone && (
              <span className="flex items-center gap-1">
                {progress.milestone === 'bronze' && '🥉 Bronze'}
                {progress.milestone === 'silver' && '🥈 Silver'}
                {progress.milestone === 'gold' && '🥇 Gold'}
                {progress.milestone === 'diamond' && '💎 Diamond'}
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

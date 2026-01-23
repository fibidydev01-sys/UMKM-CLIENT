"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconRocket,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconAlertTriangle,
  IconArchive,
  IconRefresh,
  IconTrophy,
  IconChevronDown,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOnboarding } from '@/hooks/use-onboarding';
import { CircularProgress } from './circular-progress';
import { OnboardingStepStatus } from '@/lib/onboarding';

// ============================================
// ONBOARDING DROPDOWN COMPONENT (Header)
// ============================================

interface CompactStepProps {
  step: OnboardingStepStatus;
}

function CompactStep({ step }: CompactStepProps) {
  return (
    <Link
      href={step.actionHref}
      className={cn(
        'block rounded-md px-3 py-2.5 transition-colors',
        step.completed
          ? 'bg-muted/50 hover:bg-muted'
          : 'hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Step Indicator */}
        <div className="shrink-0 mt-0.5">
          {step.completed ? (
            <IconCircleCheckFilled
              className="size-4 text-primary"
              aria-hidden="true"
            />
          ) : step.isCritical ? (
            <IconAlertTriangle
              className="size-4 text-amber-500"
              aria-hidden="true"
            />
          ) : (
            <IconCircleDashed
              className="size-4 stroke-muted-foreground/40"
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                'text-sm font-medium truncate',
                step.completed ? 'text-primary' : 'text-foreground'
              )}
            >
              {step.title}
            </p>
            {step.isCritical && !step.completed && (
              <Badge variant="outline" className="shrink-0 text-xs border-amber-500 text-amber-600 dark:text-amber-400">
                Wajib
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {step.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function OnboardingDropdown() {
  const {
    progress,
    isLoading,
    isDismissed,
    dismissOnboarding,
    restoreOnboarding,
  } = useOnboarding();

  const [isOpen, setIsOpen] = useState(false);

  // Auto-close on progress completion
  useEffect(() => {
    if (progress?.percentage === 100) {
      setIsOpen(false);
    }
  }, [progress?.percentage]);

  // Dismissed state - show minimal restore button
  if (isDismissed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={restoreOnboarding}
        className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <IconRefresh className="h-4 w-4" />
        <span className="sr-only">Restore onboarding</span>
      </Button>
    );
  }

  // Loading or no progress - STILL CLICKABLE for testing!
  if (isLoading || !progress) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 px-2.5"
          >
            <IconRocket className="h-5 w-5 animate-pulse" />
            <span className="hidden sm:inline text-sm font-medium">Setup</span>
            <IconChevronDown className="h-3.5 w-3.5 transition-transform duration-200 hidden sm:inline" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconRocket className="h-5 w-5 animate-pulse text-muted-foreground" />
              <div>
                <h4 className="text-sm font-semibold">Loading...</h4>
                <p className="text-xs text-muted-foreground">Fetching onboarding data</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              {/* Skeleton loading */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-2 animate-pulse">
                  <div className="h-4 w-4 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 100% complete - show celebration message
  if (progress.percentage >= 100) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 px-2.5"
          >
            <IconTrophy className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline text-sm font-medium text-primary">Complete!</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-0">
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-3">
              <IconTrophy className="h-12 w-12 mx-auto text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Selamat! 🎉</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Toko Anda sudah 100% siap untuk dipublikasikan!
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const remainingSteps = progress.totalSteps - progress.completedSteps;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-9 gap-2 px-2.5 relative',
            'hover:bg-accent hover:text-accent-foreground transition-colors'
          )}
        >
          {/* Icon with Progress Indicator */}
          <div className="relative">
            <IconRocket className="h-5 w-5" />
            {remainingSteps > 0 && (
              <div className="absolute -top-1 -right-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {remainingSteps}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Text */}
          <span className="hidden sm:inline text-sm font-medium">
            Setup
          </span>

          <IconChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200 hidden sm:inline',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2.5">
            <CircularProgress
              completed={progress.completedSteps}
              total={progress.totalSteps}
              size={20}
              strokeWidth={2.5}
            />
            <div>
              <h4 className="text-sm font-semibold">Setup Toko</h4>
              <p className="text-xs text-muted-foreground">
                {remainingSteps} dari {progress.totalSteps} langkah tersisa
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 -mr-1"
            onClick={(e) => {
              e.stopPropagation();
              dismissOnboarding();
              setIsOpen(false);
            }}
          >
            <IconArchive className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>

        {/* Critical Warning */}
        {!progress.canPublish && (
          <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 border-b">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Logo</strong> dan <strong>Hero Background</strong> wajib untuk publish toko.
            </p>
          </div>
        )}

        {/* Steps List */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-2 space-y-1">
            {progress.steps.map((step) => (
              <CompactStep key={step.id} step={step} />
            ))}
          </div>
        </ScrollArea>

        {/* Footer - Progress Bar */}
        <div className="border-t px-4 py-3 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progress: {progress.percentage}%</span>
            {progress.milestone && (
              <span className="flex items-center gap-1 font-medium">
                {progress.milestone === 'bronze' && '🥉 Bronze'}
                {progress.milestone === 'silver' && '🥈 Silver'}
                {progress.milestone === 'gold' && '🥇 Gold'}
                {progress.milestone === 'diamond' && '💎 Diamond'}
              </span>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import Link from 'next/link';
import {
  IconRocket,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconAlertTriangle,
  IconTrophy,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOnboarding } from '@/hooks/use-onboarding';
import { CircularProgress } from '@/components/onboarding/circular-progress';
import { OnboardingStepStatus } from '@/lib/onboarding';

// ============================================
// STEP CARD COMPONENT
// ============================================

function StepCard({ step }: { step: OnboardingStepStatus }) {
  return (
    <Link
      href={step.actionHref}
      className={cn(
        'block rounded-lg border p-4 transition-all hover:shadow-md',
        step.completed
          ? 'bg-muted/30 border-primary/20'
          : 'hover:border-primary/50 hover:bg-accent/50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Step Indicator */}
        <div className="shrink-0 mt-0.5">
          {step.completed ? (
            <IconCircleCheckFilled
              className="size-6 text-primary"
              aria-hidden="true"
            />
          ) : step.isCritical ? (
            <IconAlertTriangle
              className="size-6 text-amber-500"
              aria-hidden="true"
            />
          ) : (
            <IconCircleDashed
              className="size-6 stroke-muted-foreground/40"
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={cn(
                'font-semibold',
                step.completed ? 'text-primary' : 'text-foreground'
              )}
            >
              {step.title}
            </h3>
            {step.isCritical && !step.completed && (
              <Badge variant="outline" className="text-xs border-amber-500 text-amber-600 dark:text-amber-400">
                Wajib
              </Badge>
            )}
            {step.completed && (
              <Badge variant="secondary" className="text-xs">
                Selesai
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {step.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// LOADING SKELETON
// ============================================

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ============================================
// CELEBRATION COMPONENT (100% Complete)
// ============================================

function CelebrationView() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <IconTrophy className="h-20 w-20 text-primary mb-6" />
      <h1 className="text-3xl font-bold mb-2">Selamat! 🎉</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Toko Anda sudah 100% siap untuk dipublikasikan!
      </p>
    </div>
  );
}

// ============================================
// MAIN ONBOARDING CLIENT
// ============================================

export function OnboardingClient() {
  const { progress, isLoading } = useOnboarding();

  if (isLoading || !progress) {
    return <LoadingSkeleton />;
  }

  if (progress.percentage >= 100) {
    return <CelebrationView />;
  }

  const remainingSteps = progress.totalSteps - progress.completedSteps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CircularProgress
                completed={progress.completedSteps}
                total={progress.totalSteps}
                size={48}
                strokeWidth={4}
              />
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconRocket className="h-5 w-5" />
                  Setup Toko
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {remainingSteps} dari {progress.totalSteps} langkah tersisa
                </p>
              </div>
            </div>
            {progress.milestone && (
              <div className="text-right">
                <span className="text-2xl">
                  {progress.milestone === 'bronze' && '🥉'}
                  {progress.milestone === 'silver' && '🥈'}
                  {progress.milestone === 'gold' && '🥇'}
                  {progress.milestone === 'diamond' && '💎'}
                </span>
                <p className="text-xs text-muted-foreground capitalize">
                  {progress.milestone}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{progress.percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Critical Warning */}
          {!progress.canPublish && (
            <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Logo</strong> dan <strong>Hero Background</strong> wajib untuk publish toko.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Steps List */}
      <div className="grid gap-3">
        {progress.steps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconChevronRight,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OnboardingStepStatus } from '@/lib/onboarding';

// ============================================
// ONBOARDING STEP COMPONENT
// ============================================

interface OnboardingStepProps {
  step: OnboardingStepStatus;
  isOpen: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isPrevOpen: boolean;
}

function StepIndicator({ completed, isCritical }: { completed: boolean; isCritical: boolean }) {
  if (completed) {
    return (
      <IconCircleCheckFilled
        className="mt-0.5 size-5 shrink-0 text-primary"
        aria-hidden="true"
      />
    );
  }

  if (isCritical) {
    return (
      <IconAlertTriangle
        className="mt-0.5 size-5 shrink-0 text-amber-500"
        aria-hidden="true"
      />
    );
  }

  return (
    <IconCircleDashed
      className="mt-0.5 size-5 shrink-0 stroke-muted-foreground/40"
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

export function OnboardingStep({
  step,
  isOpen,
  onToggle,
  isFirst,
  isPrevOpen,
}: OnboardingStepProps) {
  const showBorderTop = !isFirst && !isOpen && !isPrevOpen;

  return (
    <div
      className={cn(
        'group',
        isOpen && 'rounded-lg',
        showBorderTop && 'border-t border-border'
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          'block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isOpen && 'rounded-lg'
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-lg transition-colors',
            isOpen && 'border border-border bg-muted/50'
          )}
        >
          <div className="relative flex items-start justify-between gap-3 py-3 pl-4 pr-2">
            <div className="flex w-full gap-3">
              {/* Step Indicator */}
              <div className="shrink-0">
                <StepIndicator completed={step.completed} isCritical={step.isCritical} />
              </div>

              {/* Content */}
              <div className="grow">
                <h4
                  className={cn(
                    'text-sm font-medium',
                    step.completed ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {step.title}
                  {step.isCritical && !step.completed && (
                    <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                      (Wajib)
                    </span>
                  )}
                </h4>

                {/* Expandable Content */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'mt-2 h-auto opacity-100' : 'h-0 opacity-0'
                  )}
                >
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>

                  {!step.completed && (
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={(e) => e.stopPropagation()}
                      asChild
                    >
                      <Link href={step.actionHref}>
                        {step.actionLabel}
                      </Link>
                    </Button>
                  )}

                  {step.completed && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                      ✓ Selesai
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Chevron (when closed) */}
            {!isOpen && (
              <IconChevronRight
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

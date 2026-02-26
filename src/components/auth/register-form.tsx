'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegisterWizard, useRegister } from '@/hooks';
import {
  StepCategory,
  StepStoreInfo,
  StepAccount,
  StepReview,
} from './register-steps';
import { cn } from '@/lib/utils';

// ==========================================
// STEPS CONFIG
// ==========================================

const STEPS = [
  { title: 'Business Type', desc: 'What kind of business do you run?' },
  { title: 'Store Details', desc: 'Name, URL & description' },
  { title: 'Your Account', desc: 'Email, password & WhatsApp' },
  { title: 'Review', desc: 'Confirm and launch your store' },
] as const;

// ==========================================
// STEP INDICATOR
// ==========================================

function StepIndicator({
  currentStep,
  onStepClick,
  size = 'sm',
}: {
  currentStep: number; // 0-based
  onStepClick?: (i: number) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            {/* Circle */}
            <button
              type="button"
              onClick={() => i < currentStep && onStepClick?.(i)}
              className={cn(
                'flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none',
                size === 'lg' ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[11px]',
                i < currentStep
                  ? 'bg-primary text-primary-foreground cursor-pointer hover:opacity-75'
                  : i === currentStep
                    ? 'bg-primary text-primary-foreground ring-[3px] ring-primary/25 cursor-default'
                    : 'bg-muted text-muted-foreground/60 cursor-default'
              )}
            >
              {i < currentStep ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </button>

            {/* Label — lg only */}
            {size === 'lg' && (
              <span className={cn(
                'text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors',
                i === currentStep ? 'text-foreground' : 'text-muted-foreground/60'
              )}>
                {step.title}
              </span>
            )}
          </div>

          {/* Connector */}
          {i < STEPS.length - 1 && (
            <div className={cn(
              'h-px mx-2 transition-colors duration-500',
              size === 'lg' ? 'w-14 mb-[22px]' : 'w-8',
              i < currentStep ? 'bg-primary' : 'bg-border'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// REGISTER FORM
// ==========================================

export function RegisterForm() {
  const wizard = useRegisterWizard();
  const { register, isLoading, error } = useRegister();

  // wizard.state.currentStep: 1 = Welcome, 2 = Category, 3 = StoreInfo, 4 = Account, 5 = Review
  // Hero pattern: 0-based step untuk indicator
  // Step 1 (Welcome) = landing screen, mulai indicator dari step 2 (index 0)
  const isWelcome = wizard.state.currentStep === 1;
  const indicatorStep = wizard.state.currentStep - 2; // 0-based, mulai dari step 2
  const isLastStep = wizard.state.currentStep === 5;
  const totalIndicatorSteps = STEPS.length; // 4

  const handleSubmit = async () => {
    try {
      await register({
        name: wizard.state.name!,
        slug: wizard.state.slug!,
        category: wizard.state.category!,
        description: wizard.state.description || '',
        email: wizard.state.email!,
        password: wizard.state.password!,
        whatsapp: wizard.state.whatsapp!,
      });
    } catch {
      // Error handled in hook
    }
  };

  // ── WELCOME SCREEN ──────────────────────────────────────────────────────
  if (isWelcome) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 py-8">
          <div className="space-y-3 max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight">
              Set up your online store
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Get your store up and running in minutes. Manage products,
              orders, and customers — all in one place.
            </p>
          </div>

          {/* Steps preview */}
          <div className="w-full max-w-xs space-y-2 text-left">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-muted/50"
              >
                <span className="text-[11px] font-mono font-semibold text-muted-foreground tabular-nums">
                  0{i + 1}
                </span>
                <span className="text-sm text-foreground">{step.title}</span>
              </div>
            ))}
          </div>

          <Button
            type="button"
            size="lg"
            onClick={wizard.nextStep}
            className="w-full max-w-xs group"
          >
            Get started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Already have a store?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── WIZARD STEPS (2–5) ─────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col">

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ══════════ DESKTOP ══════════ */}
      <div className="hidden lg:flex lg:flex-col lg:h-full">

        {/* Header */}
        <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Step {wizard.state.currentStep - 1} of {totalIndicatorSteps}
            </p>
            <h2 className="text-2xl font-bold tracking-tight leading-none">
              {STEPS[indicatorStep]?.title}
            </h2>
            <p className="text-sm text-muted-foreground pt-0.5">
              {STEPS[indicatorStep]?.desc}
            </p>
          </div>

          <div className="shrink-0 pt-0.5">
            <StepIndicator
              currentStep={indicatorStep}
              onStepClick={(i) => wizard.goToStep(i + 2)}
              size="lg"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-[340px]">
          {wizard.state.currentStep === 2 && (
            <StepCategory
              selectedCategory={wizard.state.category || ''}
              onSelectCategory={(category) => wizard.updateState({ category })}
            />
          )}
          {wizard.state.currentStep === 3 && (
            <StepStoreInfo
              name={wizard.state.name || ''}
              slug={wizard.state.slug || ''}
              description={wizard.state.description || ''}
              onUpdate={wizard.updateState}
            />
          )}
          {wizard.state.currentStep === 4 && (
            <StepAccount
              email={wizard.state.email || ''}
              password={wizard.state.password || ''}
              whatsapp={wizard.state.whatsapp || ''}
              onUpdate={wizard.updateState}
            />
          )}
          {wizard.state.currentStep === 5 && (
            <StepReview
              data={wizard.state}
              onEdit={(step) => wizard.goToStep(step)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between pt-6 border-t mt-8">
          <Button
            variant="outline"
            onClick={wizard.prevStep}
            className={cn(
              'gap-1.5 min-w-[130px] h-9 text-sm',
              wizard.state.currentStep === 2 && 'invisible'
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>

          {/* Progress pills */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === indicatorStep
                    ? 'w-5 h-1.5 bg-primary'
                    : i < indicatorStep
                      ? 'w-1.5 h-1.5 bg-primary/40'
                      : 'w-1.5 h-1.5 bg-border'
                )}
              />
            ))}
          </div>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-1.5 min-w-[130px] h-9 text-sm"
            >
              {isLoading ? 'Creating...' : 'Create my store'}
            </Button>
          ) : (
            <Button
              onClick={wizard.nextStep}
              className="gap-1.5 min-w-[130px] h-9 text-sm"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div className="lg:hidden flex flex-col pb-24">

        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <StepIndicator
              currentStep={indicatorStep}
              onStepClick={(i) => wizard.goToStep(i + 2)}
              size="sm"
            />
          </div>
          <div className="text-center space-y-0.5">
            <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
              Step {wizard.state.currentStep - 1} of {totalIndicatorSteps}
            </p>
            <h3 className="text-base font-bold tracking-tight">
              {STEPS[indicatorStep]?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {STEPS[indicatorStep]?.desc}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-[300px]">
          {wizard.state.currentStep === 2 && (
            <StepCategory
              selectedCategory={wizard.state.category || ''}
              onSelectCategory={(category) => wizard.updateState({ category })}
            />
          )}
          {wizard.state.currentStep === 3 && (
            <StepStoreInfo
              name={wizard.state.name || ''}
              slug={wizard.state.slug || ''}
              description={wizard.state.description || ''}
              onUpdate={wizard.updateState}
            />
          )}
          {wizard.state.currentStep === 4 && (
            <StepAccount
              email={wizard.state.email || ''}
              password={wizard.state.password || ''}
              whatsapp={wizard.state.whatsapp || ''}
              onUpdate={wizard.updateState}
            />
          )}
          {wizard.state.currentStep === 5 && (
            <StepReview
              data={wizard.state}
              onEdit={(step) => wizard.goToStep(step)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-background/90 backdrop-blur-sm border-t px-4 py-3 flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={wizard.prevStep}
            className={cn(
              'gap-1 flex-1 h-9 text-xs font-medium',
              wizard.state.currentStep === 2 && 'invisible'
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          {isLastStep ? (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-1 flex-1 h-9 text-xs font-medium"
            >
              {isLoading ? 'Creating...' : 'Create my store'}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={wizard.nextStep}
              className="gap-1 flex-1 h-9 text-xs font-medium"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Sign in link */}
      <p className="hidden lg:block text-center text-sm text-muted-foreground mt-4">
        Already have a store?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
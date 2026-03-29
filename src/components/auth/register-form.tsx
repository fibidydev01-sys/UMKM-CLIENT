'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegisterWizard, useRegister } from '@/hooks';
import {
  StepCategory,
  StepStoreInfo,
  StepAccount,
  StepReview,
  StepWelcome,
} from './register-steps';
import { StepIndicator, StepDots } from '@/components/dashboard/settings/shared';
import { cn } from '@/lib/shared/utils';
import { toast } from 'sonner';

// ==========================================
// KONFIGURASI STEPS
// ==========================================

const STEPS = [
  { title: 'Business Type', desc: 'What kind of business do you run?' },
  { title: 'Store Details', desc: 'Name, URL & description' },
  { title: 'Your Account', desc: 'Email, password & WhatsApp' },
  { title: 'Review', desc: 'Confirm and launch your store' },
] as const;

// ==========================================
// PASSWORD VALIDATION — harus sama dengan step-account
// ==========================================

function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

// ==========================================
// REGISTER FORM
// ==========================================

export function RegisterForm() {
  const wizard = useRegisterWizard();
  const { register, isLoading, error } = useRegister();
  const [isAgreed, setIsAgreed] = useState(false);

  const isWelcome = wizard.state.currentStep === 1;
  const indicatorStep = wizard.state.currentStep - 2;
  const isLastStep = wizard.state.currentStep === 5;

  // ==========================================
  // BLOCKING VALIDATION PER STEP
  // ==========================================

  const validateCurrentStep = (): boolean => {
    switch (wizard.state.currentStep) {
      case 2: // Business Type
        if (!wizard.state.category) {
          toast.error('Please select a business type to continue');
          return false;
        }
        return true;

      case 3: // Store Details
        if (!wizard.state.name?.trim()) {
          toast.error('Store name is required');
          return false;
        }
        if (!wizard.state.slug?.trim()) {
          toast.error('Store URL is required');
          return false;
        }
        return true;

      case 4: // Account
        if (!wizard.state.email?.trim()) {
          toast.error('Email address is required');
          return false;
        }
        if (!wizard.state.password) {
          toast.error('Password is required');
          return false;
        }
        if (!isPasswordStrong(wizard.state.password)) {
          toast.error('Password must meet all requirements');
          return false;
        }
        if (!wizard.state.whatsapp || wizard.state.whatsapp === '62') {
          toast.error('WhatsApp number is required');
          return false;
        }
        return true;

      case 5: // Review
        if (!isAgreed) {
          toast.error('Please agree to the Terms of Service to continue');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    wizard.nextStep();
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
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
      // Error ditangani di hook
    }
  };

  // ── WELCOME SCREEN ──────────────────────────────────────────────────────
  if (isWelcome) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <StepWelcome onNext={wizard.nextStep} />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have a store?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // ── WIZARD STEPS (2–5) ─────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col">

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
              Step {wizard.state.currentStep - 1} of {STEPS.length}
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
              steps={STEPS}
              currentStep={indicatorStep}
              onStepClick={(i) => wizard.goToStep(i + 2)}
              size="lg"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-[340px] pb-20">
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
              onAgreementChange={setIsAgreed}
            />
          )}
        </div>

        {/* Desktop — fixed bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 hidden lg:flex items-center justify-between px-8 py-4 bg-background/90 backdrop-blur-sm border-t">
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

          <StepDots steps={STEPS} currentStep={indicatorStep} />

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
              onClick={handleNext}
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
              steps={STEPS}
              currentStep={indicatorStep}
              onStepClick={(i) => wizard.goToStep(i + 2)}
              size="sm"
            />
          </div>
          <div className="text-center space-y-0.5">
            <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
              Step {wizard.state.currentStep - 1} of {STEPS.length}
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
              onAgreementChange={setIsAgreed}
            />
          )}
        </div>
      </div>

      {/* Mobile — fixed bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={wizard.prevStep}
            className={cn(
              'h-9 w-9 shrink-0',
              wizard.state.currentStep === 2 && 'invisible'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <StepDots steps={STEPS} currentStep={indicatorStep} />

          {isLastStep ? (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-9 px-4 text-xs font-medium shrink-0"
            >
              {isLoading ? 'Creating...' : 'Create store'}
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handleNext}
              className="h-9 w-9 shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Sign in link — desktop only */}
      <p className="hidden lg:block text-center text-sm text-muted-foreground mt-4">
        Already have a store?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
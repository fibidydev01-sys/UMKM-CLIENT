'use client';

import Link from 'next/link';
import { useRegisterWizard } from '@/hooks';
import { useRegister } from '@/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  StepWelcome,
  StepCategory,
  StepStoreInfo,
  StepAccount,
  StepReview,
} from './register-steps';
import { cn } from '@/lib/utils';

// ==========================================
// REGISTER FORM COMPONENT
// ==========================================

export function RegisterForm() {
  const wizard = useRegisterWizard();
  const { register, isLoading, error } = useRegister();

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Progress Bar - Hide on first step (Welcome) */}
      {wizard.state.currentStep > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              Langkah {wizard.state.currentStep - 1} dari{' '}
              {wizard.totalSteps - 1}
            </span>
            <span>
              {Math.round(
                ((wizard.state.currentStep - 1) / (wizard.totalSteps - 1)) *
                  100
              )}
              %
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  ((wizard.state.currentStep - 1) / (wizard.totalSteps - 1)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="min-h-[500px]">
        {wizard.state.currentStep === 1 && (
          <StepWelcome onNext={wizard.nextStep} />
        )}

        {wizard.state.currentStep === 2 && (
          <StepCategory
            selectedCategory={wizard.state.category || ''}
            onSelectCategory={(category) => wizard.updateState({ category })}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.state.currentStep === 3 && (
          <StepStoreInfo
            name={wizard.state.name || ''}
            slug={wizard.state.slug || ''}
            description={wizard.state.description || ''}
            onUpdate={wizard.updateState}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.state.currentStep === 4 && (
          <StepAccount
            email={wizard.state.email || ''}
            password={wizard.state.password || ''}
            whatsapp={wizard.state.whatsapp || ''}
            onUpdate={wizard.updateState}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.state.currentStep === 5 && (
          <StepReview
            data={wizard.state}
            onBack={wizard.prevStep}
            onEdit={wizard.goToStep}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Step Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[1, 2, 3, 4, 5].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => wizard.goToStep(step)}
            disabled={isLoading}
            className={cn(
              'h-2 rounded-full transition-all',
              wizard.state.currentStep === step
                ? 'bg-primary w-6'
                : 'bg-muted hover:bg-muted-foreground/30 w-2'
            )}
            aria-label={`Go to step ${step}`}
          />
        ))}
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Sudah punya toko?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Masuk
        </Link>
      </p>
    </div>
  );
}

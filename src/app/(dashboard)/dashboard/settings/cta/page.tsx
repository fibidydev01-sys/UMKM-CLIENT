'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Cta1 } from '@/components/landing/blocks';
import { PreviewModal } from '@/components/settings';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { CtaFormData } from '@/types';
import { StepContent, StepButton } from '@/components/settings/cta-section';

// ─── Steps ─────────────────────────────────────────────────────────────────
const STEPS = [
  { title: 'CTA Content', desc: 'Headline & supporting text' },
  { title: 'Button', desc: 'Label, link & button style' },
] as const;

// ─── Step Indicator ────────────────────────────────────────────────────────
function StepIndicator({
  currentStep,
  onStepClick,
  size = 'sm',
}: {
  currentStep: number;
  onStepClick?: (i: number) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
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
            {size === 'lg' && (
              <span className={cn(
                'text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors',
                i === currentStep ? 'text-foreground' : 'text-muted-foreground/60'
              )}>
                {step.title}
              </span>
            )}
          </div>
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

// ─── Page ──────────────────────────────────────────────────────────────────
export default function CTAPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CtaFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        ctaTitle: tenant.ctaTitle || '',
        ctaSubtitle: tenant.ctaSubtitle || '',
        ctaButtonText: tenant.ctaButtonText || '',
        ctaButtonLink: tenant.ctaButtonLink || '',
        ctaButtonStyle: tenant.ctaButtonStyle || 'primary',
      });
    }
  }, [tenant, formData]);

  const updateFormData = <K extends keyof CtaFormData>(key: K, value: CtaFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  const checkEmptyFields = () => {
    if (!formData) return;
    if (currentStep === 0) {
      const missing = [
        !formData.ctaTitle && 'Headline',
        !formData.ctaSubtitle && 'Supporting Text',
      ].filter(Boolean) as string[];
      if (missing.length) toast.info(`Fill in ${missing.join(', ')} for best results`);
    } else if (currentStep === 1) {
      const missing = [
        !formData.ctaButtonText && 'Button Label',
        !formData.ctaButtonLink && 'Button URL',
      ].filter(Boolean) as string[];
      if (missing.length) toast.info(`Fill in ${missing.join(', ')} for best results`);
    }
  };

  const handleNext = () => {
    checkEmptyFields();
    if (currentStep < STEPS.length - 1) setCurrentStep((p) => p + 1);
    else setShowPreview(true);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        ctaTitle: formData.ctaTitle,
        ctaSubtitle: formData.ctaSubtitle,
        ctaButtonText: formData.ctaButtonText,
        ctaButtonLink: formData.ctaButtonLink,
        ctaButtonStyle: formData.ctaButtonStyle,
      });
      await refresh();
      toast.success('CTA section saved successfully');
      setShowPreview(false);
    } catch {
      toast.error('Failed to save CTA section');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null || formData === null;
  const isLastStep = currentStep === STEPS.length - 1;
  const stepProps = { formData: formData!, updateFormData };

  return (
    <div className="h-full flex flex-col">

      {/* ══════════════════════════ LOADING ══════════════════════════ */}
      {isLoading ? (
        <div className="flex-1 space-y-6 py-6">
          <div className="hidden lg:flex items-center justify-between pb-6 border-b">
            <div className="space-y-2"><Skeleton className="h-7 w-40" /><Skeleton className="h-4 w-52" /></div>
            <div className="flex items-center gap-3">
              {[0, 1].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  {i < 1 && <Skeleton className="w-14 h-px" />}
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="hidden lg:block h-[340px] w-full rounded-lg" />
          <div className="lg:hidden space-y-4">
            <div className="flex justify-center gap-3">{[0, 1].map(i => <Skeleton key={i} className="w-6 h-6 rounded-full" />)}</div>
            <Skeleton className="h-[280px] w-full max-w-sm mx-auto rounded-lg" />
          </div>
        </div>

      ) : (
        <>
          {/* ════════════════════════ DESKTOP ════════════════════════ */}
          <div className="hidden lg:flex lg:flex-col lg:h-full">

            {/* Header */}
            <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
              <div className="space-y-1">
                <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h2 className="text-2xl font-bold tracking-tight leading-none">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-sm text-muted-foreground pt-0.5">
                  {STEPS[currentStep].desc}
                </p>
              </div>
              <div className="shrink-0 pt-0.5">
                <StepIndicator
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="lg"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-[300px]">
              {currentStep === 0 && <StepContent {...stepProps} isDesktop />}
              {currentStep === 1 && (
                <StepButton
                  {...stepProps}
                  primaryColor={tenant?.theme?.primaryColor}
                  isDesktop
                />
              )}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-6 border-t mt-8">
              <Button
                variant="outline" onClick={handlePrev}
                className={cn('gap-1.5 min-w-[130px] h-9 text-sm', currentStep === 0 && 'invisible')}
              >
                <ChevronLeft className="h-3.5 w-3.5" />Previous
              </Button>

              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className={cn(
                    'rounded-full transition-all duration-300',
                    i === currentStep ? 'w-5 h-1.5 bg-primary' : i < currentStep ? 'w-1.5 h-1.5 bg-primary/40' : 'w-1.5 h-1.5 bg-border'
                  )} />
                ))}
              </div>

              <Button onClick={handleNext} className="gap-1.5 min-w-[130px] h-9 text-sm">
                {isLastStep
                  ? <><Eye className="h-3.5 w-3.5" />Preview &amp; Save</>
                  : <>Next<ChevronRight className="h-3.5 w-3.5" /></>
                }
              </Button>
            </div>
          </div>

          {/* ════════════════════════ MOBILE ════════════════════════ */}
          <div className="lg:hidden flex flex-col pb-24">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <StepIndicator
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="sm"
                />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h3 className="text-base font-bold tracking-tight">{STEPS[currentStep].title}</h3>
                <p className="text-xs text-muted-foreground">{STEPS[currentStep].desc}</p>
              </div>
            </div>
            <div className="min-h-[280px]">
              {currentStep === 0 && <StepContent {...stepProps} />}
              {currentStep === 1 && (
                <StepButton
                  {...stepProps}
                  primaryColor={tenant?.theme?.primaryColor}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
        <div className="bg-background/90 backdrop-blur-sm border-t px-4 py-3 flex items-center gap-2.5">
          <Button
            variant="outline" size="sm" onClick={handlePrev}
            className={cn('gap-1 flex-1 h-9 text-xs font-medium', currentStep === 0 && 'invisible')}
          >
            <ChevronLeft className="h-3.5 w-3.5" />Previous
          </Button>
          <Button size="sm" onClick={handleNext} className="gap-1 flex-1 h-9 text-xs font-medium">
            {isLastStep
              ? <><Eye className="h-3.5 w-3.5" />Preview</>
              : <>Next<ChevronRight className="h-3.5 w-3.5" /></>
            }
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        isSaving={isSaving}
        title="CTA Section Preview"
      >
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <Cta1
                title={formData.ctaTitle || 'Ready to get started?'}
                subtitle={formData.ctaSubtitle}
                buttonText={formData.ctaButtonText || 'Get Started'}
                buttonLink={formData.ctaButtonLink || '/products'}
                buttonVariant={
                  formData.ctaButtonStyle === 'outline'
                    ? 'outline'
                    : formData.ctaButtonStyle === 'secondary'
                      ? 'secondary'
                      : 'default'
                }
              />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}
'use client';

// ============================================================
// PRODUCT FORM — Wizard Orchestrator
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/shared/utils';
import { useCreateProduct, useUpdateProduct, useTenant } from '@/hooks';
import { productSchema, type ProductFormData } from '@/lib/shared/validations';
import {
  StepDetails,
  StepMedia,
  StepPricing,
  StepPublish,
  PreviewProduct,
  PRODUCT_STEPS,
  SERVICE_STEPS,
  type ProductType,
} from './product-form-section';
import type { Product } from '@/types';

const VIEW_MODE_KEY = 'products_view_mode';

function getProductType(product?: Product): ProductType {
  const meta = product?.metadata as Record<string, unknown> | null | undefined;
  return meta?.type === 'service' ? 'service' : 'product';
}

function getShowPrice(product?: Product): boolean {
  const meta = product?.metadata as Record<string, unknown> | null | undefined;
  if (meta?.showPrice === false) return false;
  return true;
}

interface WizardStep {
  id: number;
  title: string;
  desc: string;
}

function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  size = 'sm',
}: {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (i: number) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
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
          {i < steps.length - 1 && (
            <div className={cn(
              'h-px mx-2 transition-colors duration-500',
              size === 'lg' ? 'w-10 mb-[22px]' : 'w-5',
              i < currentStep ? 'bg-primary' : 'bg-border'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepDots({ steps, currentStep }: { steps: WizardStep[]; currentStep: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === currentStep
              ? 'w-5 h-1.5 bg-primary'
              : i < currentStep
                ? 'w-1.5 h-1.5 bg-primary/40'
                : 'w-1.5 h-1.5 bg-border'
          )}
        />
      ))}
    </div>
  );
}

interface ProductFormProps {
  product?: Product;
  categories?: string[];
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const isSaving = isCreating || isUpdating;

  const { tenant } = useTenant();
  const currency = tenant?.currency || 'IDR';

  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const [productType, setProductType] = useState<ProductType>(getProductType(product));
  const isService = productType === 'service';

  const [showPrice, setShowPrice] = useState<boolean>(getShowPrice(product));

  const STEPS = isService ? SERVICE_STEPS : PRODUCT_STEPS;
  const isLastStep = currentStep === STEPS.length - 1;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      price: product?.price || 0,
      comparePrice: product?.comparePrice || undefined,
      images: product?.images || [],
      isActive: product?.isActive ?? true,
    },
  });

  const handleTypeChange = (type: ProductType) => {
    setProductType(type);
    setCurrentStep(0);
  };

  const handleShowPriceChange = (checked: boolean) => {
    setShowPrice(checked);
    if (!checked) {
      form.setValue('price', 0);
      form.setValue('comparePrice', undefined);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const redirectToProducts = () => {
    const savedView =
      typeof window !== 'undefined'
        ? localStorage.getItem(VIEW_MODE_KEY) || 'grid'
        : 'grid';
    router.push(`/dashboard/products?view=${savedView}`);
  };

  const handleSave = async () => {
    const data = form.getValues();
    try {
      const payload = {
        ...data,
        price: showPrice ? data.price : 0,
        ...(!showPrice && { comparePrice: undefined }),
        metadata: {
          type: productType,
          showPrice,
        },
      } as ProductFormData & { metadata: Record<string, unknown> };

      if (isEditing) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      redirectToProducts();
    } catch {
      // Error handled in hook
    }
  };

  const renderStep = () => {
    const stepTitle = STEPS[currentStep].title;

    switch (stepTitle) {
      case 'Details':
        return (
          <StepDetails
            form={form}
            productType={productType}
            onTypeChange={handleTypeChange}
          />
        );
      case 'Media':
        return (
          <StepMedia
            form={form}
            productType={productType}
          />
        );
      case 'Pricing':
        return (
          <StepPricing
            form={form}
            productType={productType}
            showPrice={showPrice}
            onShowPriceChange={handleShowPriceChange}
            currency={currency}
          />
        );
      case 'Publish':
        return (
          <StepPublish
            form={form}
            isEditing={isEditing}
            categories={categories}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PreviewProduct
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        isSaving={isSaving}
        formData={form.getValues()}
        productType={productType}
        showPrice={showPrice}
        currency={currency}
        isEditing={isEditing}
      />

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="h-full flex flex-col">

          {/* ══════════════════ DESKTOP ══════════════════════════ */}
          <div className="hidden lg:flex lg:flex-col lg:h-full">

            {/* Header: title kiri, StepIndicator kanan */}
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
                  steps={STEPS}
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="lg"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-[300px] pb-20">
              {renderStep()}
            </div>
          </div>

          {/* ══════════════════ MOBILE ════════════════════════════ */}
          <div className="lg:hidden flex flex-col pb-24">

            {/* StepIndicator (sm) di tengah atas */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <StepIndicator
                  steps={STEPS}
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="sm"
                />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h3 className="text-base font-bold tracking-tight">
                  {STEPS[currentStep].title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {STEPS[currentStep].desc}
                </p>
              </div>
            </div>

            <div className="min-h-[260px]">
              {renderStep()}
            </div>
          </div>

          {/* ══════════════════ DESKTOP — Fixed bottom nav ═══════ */}
          <div
            className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-between px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
            style={{ left: 'var(--sidebar-width)' }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              className={cn('gap-1.5 min-w-[130px] h-9 text-sm', currentStep === 0 && 'invisible')}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            <StepDots steps={STEPS} currentStep={currentStep} />

            <Button
              type="button"
              onClick={handleNext}
              className="gap-1.5 min-w-[130px] h-9 text-sm"
            >
              {isLastStep ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Review &amp; {isEditing ? 'Save' : 'Publish'}
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>

          {/* ══════════════════ MOBILE — Fixed bottom nav ════════ */}
          <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
            <div className="px-4 py-3 flex items-center justify-between gap-3">

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className={cn('h-9 w-9 shrink-0', currentStep === 0 && 'invisible')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <StepDots steps={STEPS} currentStep={currentStep} />

              {isLastStep ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="h-9 px-4 text-xs font-medium shrink-0"
                >
                  Review
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  onClick={handleNext}
                  className="h-9 w-9 shrink-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

        </form>
      </Form>
    </>
  );
}
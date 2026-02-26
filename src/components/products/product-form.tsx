'use client';

// ============================================================
// PRODUCT FORM — Wizard Orchestrator v3.0
// Multi-step wizard pattern (adopted from settings/pembayaran)
// Supports Product & Service with smart step skip logic
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useCreateProduct, useUpdateProduct, useTenant } from '@/hooks';
import { productSchema, type ProductFormData } from '@/lib/validations';
import {
  StepDetails,
  StepMedia,
  StepPricing,
  StepInventory,
  StepPublish,
  PreviewProduct,
  PRODUCT_STEPS,
  SERVICE_STEPS,
  type ProductType,
} from './product-form-section';
import type { Product } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────
function getProductType(product?: Product): ProductType {
  const meta = product?.metadata as Record<string, unknown> | null | undefined;
  return meta?.type === 'service' ? 'service' : 'product';
}

function getShowPrice(product?: Product): boolean {
  const meta = product?.metadata as Record<string, unknown> | null | undefined;
  if (meta?.showPrice === false) return false;
  return true;
}

// ─── Step Indicator ───────────────────────────────────────────────────────
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

// ─── Props ────────────────────────────────────────────────────────────────
interface ProductFormProps {
  product?: Product;
  categories?: string[];
}

// ─── Main Component ───────────────────────────────────────────────────────
export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const isSaving = isCreating || isUpdating;

  const { tenant } = useTenant();
  const currency = tenant?.currency || 'IDR';

  // ── Wizard state ───────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // ── Product type state ─────────────────────────────────────
  const [productType, setProductType] = useState<ProductType>(getProductType(product));
  const isService = productType === 'service';

  // ── Price display state ────────────────────────────────────
  const [showPrice, setShowPrice] = useState<boolean>(getShowPrice(product));

  // ── Steps (dynamic based on type) ─────────────────────────
  const STEPS = isService ? SERVICE_STEPS : PRODUCT_STEPS;
  const isLastStep = currentStep === STEPS.length - 1;

  // ── Form ───────────────────────────────────────────────────
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      sku: product?.sku || '',
      price: product?.price || 0,
      comparePrice: product?.comparePrice || undefined,
      costPrice: product?.costPrice || undefined,
      stock: product?.stock || undefined,
      minStock: product?.minStock || 5,
      trackStock: product?.trackStock ?? true,
      unit: product?.unit || 'pcs',
      images: product?.images || [],
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
    },
  });

  // ── Type change handler ────────────────────────────────────
  const handleTypeChange = (type: ProductType) => {
    setProductType(type);
    if (type === 'service') {
      form.setValue('trackStock', false);
      form.setValue('stock', undefined);
      form.setValue('minStock', undefined);
      form.setValue('sku', '');
      form.setValue('costPrice', undefined);
      form.setValue('unit', 'hour');
    } else {
      form.setValue('trackStock', true);
      form.setValue('unit', 'pcs');
    }
    // Reset to first step on type change to avoid step-index mismatch
    setCurrentStep(0);
  };

  // ── Show price change handler ──────────────────────────────
  const handleShowPriceChange = (checked: boolean) => {
    setShowPrice(checked);
    if (!checked) {
      form.setValue('price', 0);
      form.setValue('comparePrice', undefined);
      form.setValue('costPrice', undefined);
    }
  };

  // ── Navigation ─────────────────────────────────────────────
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

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    const data = form.getValues();
    try {
      const payload: ProductFormData = {
        ...data,
        price: showPrice ? data.price : 0,
        ...(!showPrice && {
          comparePrice: undefined,
          costPrice: undefined,
        }),
        metadata: {
          ...(typeof data.metadata === 'object' && data.metadata !== null
            ? data.metadata
            : {}),
          type: productType,
          showPrice,
        },
        ...(isService && {
          sku: undefined,
          trackStock: false,
          stock: undefined,
          minStock: undefined,
          costPrice: undefined,
        }),
      };

      if (isEditing) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      router.push('/dashboard/products');
    } catch {
      // Errors handled inside hooks (toast etc.)
    }
  };

  // ── Step renderer ──────────────────────────────────────────
  const renderStep = () => {
    // For Service: steps are [0=Details, 1=Media, 2=Pricing, 3=Publish]
    // For Product: steps are [0=Details, 1=Media, 2=Pricing, 3=Inventory, 4=Publish]
    // We match on STEP TITLE to be safe against index drift
    const stepTitle = STEPS[currentStep].title;

    switch (stepTitle) {
      case 'Details':
        return (
          <StepDetails
            form={form}
            productType={productType}
            onTypeChange={handleTypeChange}
            categories={categories}
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
      case 'Inventory':
        return <StepInventory form={form} />;
      case 'Publish':
        return (
          <StepPublish
            form={form}
            productType={productType}
            showPrice={showPrice}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ── Preview Sheet ──────────────────────────────────────── */}
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
                  steps={STEPS}
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="lg"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-[300px]">
              {renderStep()}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-6 border-t mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className={cn(
                  'gap-1.5 min-w-[130px] h-9 text-sm',
                  currentStep === 0 && 'invisible'
                )}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
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
          </div>

          {/* ══════════════════ MOBILE ════════════════════════════ */}
          <div className="lg:hidden flex flex-col pb-24">

            {/* Step header */}
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

            {/* Step body */}
            <div className="min-h-[260px]">
              {renderStep()}
            </div>
          </div>

          {/* ── Mobile bottom nav (fixed) ─────────────────────── */}
          <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
            <div className="bg-background/90 backdrop-blur-sm border-t px-4 py-3 flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className={cn(
                  'gap-1 flex-1 h-9 text-xs font-medium',
                  currentStep === 0 && 'invisible'
                )}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="gap-1 flex-1 h-9 text-xs font-medium"
              >
                {isLastStep ? (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Review
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>

        </form>
      </Form>
    </>
  );
}
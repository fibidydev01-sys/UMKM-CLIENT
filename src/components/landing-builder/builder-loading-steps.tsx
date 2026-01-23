/**
 * ============================================================================
 * FILE: components/landing-builder/builder-loading-steps.tsx
 * ============================================================================
 * Multi-step loading screen for Landing Builder
 * Shows REAL loading progress based on actual data fetching status
 * ============================================================================
 */
'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface LoadingStates {
  tenantLoading: boolean;
  productsLoading: boolean;
  configReady: boolean;
}

interface BuilderLoadingStepsProps {
  loadingStates: LoadingStates;
  onComplete?: () => void;
  className?: string;
}

// ============================================================================
// LOADING STEPS (Dynamic based on actual states)
// ============================================================================

interface StepConfig {
  id: string;
  label: string;
  loadingLabel: string;
  getStatus: (states: LoadingStates) => 'pending' | 'loading' | 'completed';
}

const STEP_CONFIGS: StepConfig[] = [
  {
    id: 'tenant',
    label: 'Data Toko',
    loadingLabel: 'Memuat data toko...',
    getStatus: (s) => s.tenantLoading ? 'loading' : 'completed',
  },
  {
    id: 'products',
    label: 'Produk',
    loadingLabel: 'Mengambil daftar produk...',
    getStatus: (s) => {
      if (s.tenantLoading) return 'pending';
      return s.productsLoading ? 'loading' : 'completed';
    },
  },
  {
    id: 'config',
    label: 'Konfigurasi Landing',
    loadingLabel: 'Memuat konfigurasi...',
    getStatus: (s) => {
      if (s.tenantLoading) return 'pending';
      return s.configReady ? 'completed' : 'loading';
    },
  },
  {
    id: 'ready',
    label: 'Siap!',
    loadingLabel: 'Menyiapkan editor...',
    getStatus: (s) => {
      if (s.tenantLoading || s.productsLoading || !s.configReady) return 'pending';
      return 'completed';
    },
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function BuilderLoadingSteps({ loadingStates, onComplete, className }: BuilderLoadingStepsProps) {
  // Calculate step statuses
  const steps = STEP_CONFIGS.map(config => ({
    ...config,
    status: config.getStatus(loadingStates),
  }));

  // Calculate progress
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = (completedCount / steps.length) * 100;

  // Check if all done
  const allComplete = steps.every(s => s.status === 'completed');

  // Call onComplete when all steps are done
  // Use a ref to store the onComplete callback to avoid stale closure issues
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!allComplete) return;

    // All steps complete - call onComplete after brief delay
    const timer = setTimeout(() => {
      onCompleteRef.current?.();
    }, 300);

    return () => clearTimeout(timer);
  }, [allComplete]); // Only depend on allComplete, not onComplete

  return (
    <div className={cn(
      'h-screen flex flex-col items-center justify-center bg-background',
      className
    )}>
      <div className="w-full max-w-md px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Landing Page Builder</h1>
          <p className="text-muted-foreground text-sm">
            Mempersiapkan workspace Anda
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isLoading = step.status === 'loading';
            const isPending = step.status === 'pending';

            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
                  isLoading && 'bg-primary/5 border border-primary/20',
                  isCompleted && 'opacity-70',
                  isPending && 'opacity-30'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isLoading && 'bg-primary/20',
                  isPending && 'bg-muted'
                )}>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>

                {/* Label */}
                <span className={cn(
                  'text-sm font-medium transition-colors',
                  isLoading && 'text-primary',
                  isCompleted && 'text-muted-foreground',
                  isPending && 'text-muted-foreground/50'
                )}>
                  {isLoading ? step.loadingLabel : step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <p className="text-center text-xs text-muted-foreground">
          Tip: Gunakan drag & drop untuk mengatur urutan section
        </p>
      </div>
    </div>
  );
}

'use client';

import { Check, Circle, Clock, Package, Truck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  order: any; // TODO: Add proper type
}

interface TimelineStep {
  status: string;
  label: string;
  description: string;
  icon: typeof Clock;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: 'PENDING',
    label: 'Pesanan Dibuat',
    description: 'Pesanan Anda telah berhasil dibuat',
    icon: Clock,
  },
  {
    status: 'PROCESSING',
    label: 'Sedang Diproses',
    description: 'Pesanan sedang disiapkan',
    icon: Package,
  },
  {
    status: 'COMPLETED',
    label: 'Selesai',
    description: 'Pesanan telah selesai',
    icon: Check,
  },
];

export function OrderTimeline({ order }: OrderTimelineProps) {
  const currentStatus = order.status;
  const isCancelled = currentStatus === 'CANCELLED';

  // Get current step index
  const currentStepIndex = TIMELINE_STEPS.findIndex((step) => step.status === currentStatus);

  // Helper to check if step is completed
  const isStepCompleted = (stepIndex: number) => {
    if (isCancelled) return false;
    return stepIndex < currentStepIndex;
  };

  // Helper to check if step is current
  const isStepCurrent = (stepIndex: number) => {
    if (isCancelled) return false;
    return stepIndex === currentStepIndex;
  };

  // If cancelled, show special cancelled timeline
  if (isCancelled) {
    return (
      <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
          <X className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <p className="font-medium text-destructive">Pesanan Dibatalkan</p>
          <p className="text-sm text-muted-foreground">
            Pesanan telah dibatalkan
            {order.updatedAt && (
              <span>
                {' '}
                pada{' '}
                {new Date(order.updatedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Steps */}
      <div className="space-y-6">
        {TIMELINE_STEPS.map((step, index) => {
          const Icon = step.icon;
          const completed = isStepCompleted(index);
          const current = isStepCurrent(index);
          const upcoming = !completed && !current;

          return (
            <div key={step.status} className="relative flex gap-4">
              {/* Connector Line */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    'absolute left-5 top-10 h-full w-0.5 -translate-x-1/2',
                    completed ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}

              {/* Icon */}
              <div
                className={cn(
                  'relative flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  completed && 'bg-primary border-primary text-primary-foreground',
                  current && 'bg-primary/10 border-primary text-primary animate-pulse',
                  upcoming && 'bg-muted border-muted-foreground/20 text-muted-foreground'
                )}
              >
                {completed ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <p
                  className={cn(
                    'font-medium',
                    (completed || current) && 'text-foreground',
                    upcoming && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                {/* Show timestamp for completed/current steps */}
                {(completed || current) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {current ? (
                      <>
                        {new Date(order.updatedAt || order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </>
                    ) : (
                      <>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

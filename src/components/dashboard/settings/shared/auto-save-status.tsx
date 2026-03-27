'use client';

import { Save } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/shared/utils';
import type { AutoSaveStatus as AutoSaveStatusType } from '@/hooks/dashboard/use-auto-save';

interface AutoSaveStatusProps {
  status: AutoSaveStatusType;
  className?: string;
}

export function AutoSaveStatus({ status, className }: AutoSaveStatusProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {status === 'saving' ? (
        <>
          <Spinner className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">Saving...</span>
        </>
      ) : status === 'saved' ? (
        <>
          <Save className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Saved • just now</span>
        </>
      ) : status === 'error' ? (
        <>
          <Save className="w-3.5 h-3.5 text-destructive" />
          <span className="text-[11px] text-destructive">Save failed</span>
        </>
      ) : (
        <>
          <Save className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span className="text-[11px] text-muted-foreground/40">Auto save</span>
        </>
      )}
    </div>
  );
}
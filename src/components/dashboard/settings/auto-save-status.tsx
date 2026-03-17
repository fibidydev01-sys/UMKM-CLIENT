'use client';

import { cn } from '@/lib/shared/utils';
import type { AutoSaveStatus } from '@/hooks';

interface AutoSaveStatusProps {
  status: AutoSaveStatus;
  className?: string;
}

export function AutoSaveStatus({ status, className }: AutoSaveStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {status === 'saving' && (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" />
          <span className="text-[11px] text-muted-foreground animate-pulse">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Saved</span>
        </>
      )}
      {status === 'error' && (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
          <span className="text-[11px] text-destructive">Save failed</span>
        </>
      )}
    </div>
  );
}
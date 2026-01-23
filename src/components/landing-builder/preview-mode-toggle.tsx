/**
 * PreviewModeToggle Component
 *
 * Toggle buttons for switching between device preview modes
 */

'use client';

import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DeviceMode } from './device-frame';

interface PreviewModeToggleProps {
  activeMode: DeviceMode;
  onChange: (mode: DeviceMode) => void;
  className?: string;
}

const modes: { value: DeviceMode; label: string; icon: typeof Monitor }[] = [
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
  { value: 'tablet', label: 'Tablet', icon: Tablet },
  { value: 'laptop', label: 'Desktop', icon: Monitor },
];

export function PreviewModeToggle({
  activeMode,
  onChange,
  className,
}: PreviewModeToggleProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 p-1 bg-muted rounded-lg', className)}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.value;

        return (
          <Button
            key={mode.value}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange(mode.value)}
            className={cn(
              'gap-2 transition-all',
              isActive && 'shadow-sm'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

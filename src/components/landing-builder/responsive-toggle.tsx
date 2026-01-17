'use client';

import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveToggleProps {
  deviceType: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

export function ResponsiveToggle({ deviceType, onDeviceChange }: ResponsiveToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'gap-2 h-8',
          deviceType === 'mobile' && 'bg-background shadow-sm'
        )}
        onClick={() => onDeviceChange('mobile')}
      >
        <Smartphone className="h-4 w-4" />
        <span className="hidden sm:inline">Mobile</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'gap-2 h-8',
          deviceType === 'tablet' && 'bg-background shadow-sm'
        )}
        onClick={() => onDeviceChange('tablet')}
      >
        <Tablet className="h-4 w-4" />
        <span className="hidden sm:inline">Tablet</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'gap-2 h-8',
          deviceType === 'desktop' && 'bg-background shadow-sm'
        )}
        onClick={() => onDeviceChange('desktop')}
      >
        <Monitor className="h-4 w-4" />
        <span className="hidden sm:inline">Desktop</span>
      </Button>
    </div>
  );
}

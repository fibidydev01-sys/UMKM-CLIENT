/**
 * DeviceFrame Component
 *
 * Simple viewport resizer like Chrome DevTools (no device mockups)
 */

'use client';

import { cn } from '@/lib/utils';

export type DeviceMode = 'normal' | 'laptop' | 'tablet' | 'mobile';

interface DeviceFrameProps {
  mode: DeviceMode;
  children: React.ReactNode;
  className?: string;
}

export function DeviceFrame({ mode, children, className }: DeviceFrameProps) {
  // Viewport dimensions (like Chrome DevTools)
  const viewportStyles = {
    mobile: 'mx-auto', // 375px default mobile width
    tablet: 'mx-auto', // 768px default tablet width
    laptop: 'w-full', // Full width for desktop
  };

  const viewportWidths = {
    mobile: 'max-w-[375px]',
    tablet: 'max-w-[768px]',
    laptop: 'w-full',
  };

  const width = mode === 'laptop' ? viewportWidths.laptop : viewportWidths[mode as 'mobile' | 'tablet'];
  const alignment = viewportStyles[mode as 'mobile' | 'tablet' | 'laptop'];

  return (
    <div className={cn('w-full h-full overflow-auto', className)}>
      <div className={cn('h-full', width, alignment)}>
        <div className="w-full h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

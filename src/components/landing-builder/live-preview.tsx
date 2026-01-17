'use client';

import { useEffect, useRef, useState } from 'react';
import { TenantLandingConfig } from '@/types/landing';
import { useTenantStore } from '@/store/tenant-store';
import { DeviceType } from './responsive-toggle';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePreviewProps {
  config: TenantLandingConfig;
  deviceType: DeviceType;
  templateId: string;
}

const DEVICE_WIDTHS: Record<DeviceType, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

export function LivePreview({ config, deviceType, templateId }: LivePreviewProps) {
  const { tenant } = useTenantStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!tenant?.slug) return;

    // Create preview URL with config as query params
    const url = new URL(`${window.location.origin}/store/${tenant.slug}`);
    url.searchParams.set('preview', 'true');
    url.searchParams.set('templateId', templateId);

    // Encode config as JSON in URL
    url.searchParams.set('config', JSON.stringify(config));

    setPreviewUrl(url.toString());
    setIsLoading(true);
  }, [tenant?.slug, config, templateId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!tenant) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading tenant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      {/* Device Frame */}
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-2xl transition-all duration-300',
          deviceType === 'mobile' && 'shadow-xl',
          deviceType === 'tablet' && 'shadow-xl',
          deviceType === 'desktop' && 'w-full h-full'
        )}
        style={{
          width: deviceType === 'desktop' ? '100%' : DEVICE_WIDTHS[deviceType],
          maxWidth: '100%',
          height: deviceType === 'desktop' ? '100%' : '90%',
        }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}

        {/* Preview Iframe */}
        <iframe
          ref={iframeRef}
          src={previewUrl}
          className={cn(
            'w-full h-full rounded-lg',
            deviceType === 'mobile' && 'border-8 border-gray-800',
            deviceType === 'tablet' && 'border-4 border-gray-700'
          )}
          title="Landing Page Preview"
          onLoad={handleIframeLoad}
          sandbox="allow-same-origin allow-scripts allow-forms"
        />

        {/* Device Label */}
        {deviceType !== 'desktop' && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium">
            {deviceType === 'mobile' && 'iPhone 12 Pro (375px)'}
            {deviceType === 'tablet' && 'iPad (768px)'}
          </div>
        )}
      </div>
    </div>
  );
}

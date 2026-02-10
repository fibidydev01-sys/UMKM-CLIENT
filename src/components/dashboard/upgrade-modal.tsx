'use client';

import { useRouter } from 'next/navigation';
import { Crown, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function UpgradeModal({
  open,
  onOpenChange,
  title = 'Batas plan tercapai',
  description = 'Upgrade ke Business untuk membuka limit dan fitur premium lainnya.',
}: UpgradeModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              router.push('/dashboard/subscription');
            }}
          >
            <Crown className="mr-2 h-4 w-4" />
            Lihat Paket Upgrade
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Nanti saja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

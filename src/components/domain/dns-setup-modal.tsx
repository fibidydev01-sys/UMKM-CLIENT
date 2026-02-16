'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { DnsInstructions as DnsInstructionsType, DnsStatusResponse } from '@/types';
import { DnsInstructions } from './dns-instructions';

/**
 * SMART DNS SETUP MODAL
 * 
 * Features:
 * ✅ Persistent state via localStorage
 * ✅ User can close tab/browser safely
 * ✅ Modal auto-reopens when user returns
 * ✅ Continues DNS polling from where it left off
 * ✅ Better UX - flexible for users
 */

interface DnsSetupModalProps {
  isOpen: boolean;
  domain: string;
  instructions: DnsInstructionsType;
  dnsStatus: DnsStatusResponse;
  onCancel: () => Promise<void>;
}

// LocalStorage key for tracking ongoing setup
const STORAGE_KEY = 'fibidy_dns_setup_in_progress';

export function DnsSetupModal({
  isOpen,
  domain,
  instructions,
  dnsStatus,
  onCancel,
}: DnsSetupModalProps) {

  const [hasUserDismissed, setHasUserDismissed] = useState(false);

  // ✅ Save setup state to localStorage when modal opens
  useEffect(() => {
    if (isOpen && domain) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        domain,
        timestamp: new Date().toISOString(),
        verified: dnsStatus.allVerified,
      }));
    }
  }, [isOpen, domain, dnsStatus.allVerified]);

  // ✅ Clear localStorage when DNS verified or modal closed
  useEffect(() => {
    if (dnsStatus.allVerified || !isOpen) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [dnsStatus.allVerified, isOpen]);

  const handleMinimize = () => {
    // User wants to minimize/close temporarily
    setHasUserDismissed(true);

    // Show info toast
    if (typeof window !== 'undefined') {
      // You can use your toast library here
      alert('💡 Setup DNS masih berjalan di background. Halaman ini akan otomatis update ketika DNS sudah siap. Anda bisa kembali kapan saja ke menu Domain.');
    }
  };

  const handleCancel = async () => {
    // Show confirmation before canceling
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin membatalkan setup DNS?\n\nDomain akan dihapus dan Anda harus mengulang dari awal.',
    );

    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      await onCancel();
    }
  };

  // If user dismissed modal but setup still ongoing, don't show
  // They can return to domain settings page to see status
  const shouldShow = isOpen && !hasUserDismissed;

  return (
    <Transition appear show={shouldShow} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => { }} // Prevent close on outside click
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-background shadow-xl transition-all">

                {/* Header - Sticky */}
                <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title className="text-xl font-bold">
                        Setup Custom Domain
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-muted-foreground mt-1">
                        Domain: <code className="bg-muted px-2 py-0.5 rounded text-primary font-mono">{domain}</code>
                      </Dialog.Description>
                    </div>

                    {/* Minimize button */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMinimize}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Minimize
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        className="rounded-full"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Batalkan Setup</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info Alert - NEW! */}
                <div className="px-6 pt-4">
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong>💡 Bisa Ditutup Kapan Saja!</strong>
                      <p className="text-sm mt-1">
                        Anda bisa click <strong>&#34;Minimize&#34;</strong> atau close browser.
                        Setup DNS akan tetap berjalan di background.
                        Kembali ke menu <strong>Domain</strong> untuk melihat progress kapan saja.
                      </p>
                    </AlertDescription>
                  </Alert>
                </div>

                {/* DNS Instructions Content - Scrollable */}
                <div className="px-6 pb-6 max-h-[calc(100vh-240px)] overflow-y-auto">
                  <DnsInstructions
                    instructions={instructions}
                    dnsStatus={dnsStatus}
                    onCancel={handleCancel}
                    isInsideModal={true}
                  />
                </div>

                {/* Footer - Sticky */}
                <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${dnsStatus.allVerified ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span>
                        {dnsStatus.allVerified
                          ? '✅ DNS Terverifikasi!'
                          : '🔄 Menunggu DNS propagasi...'
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={handleMinimize}
                      >
                        Minimize
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Batalkan Setup
                      </Button>
                    </div>
                  </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/**
 * HELPER FUNCTION
 * Check if there's an ongoing DNS setup when user returns
 */
export function getOngoingDnsSetup(): { domain: string; timestamp: string } | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);

    // Check if setup is not too old (e.g., max 24 hours)
    const setupTime = new Date(data.timestamp);
    const now = new Date();
    const hoursSinceSetup = (now.getTime() - setupTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceSetup > 24) {
      // Setup too old, remove it
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
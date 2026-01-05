'use client';

import { Toaster } from 'sonner';

// ==========================================
// TOAST PROVIDER
// Using Sonner for notifications
// ==========================================

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          // Match our pink theme
          '--toast-bg': 'white',
          '--toast-border': 'hsl(var(--border))',
          '--toast-text': 'hsl(var(--foreground))',
        } as React.CSSProperties,
        className: 'shadow-lg',
      }}
    />
  );
}

// ==========================================
// TOAST HELPERS
// Convenient toast functions
// ==========================================

import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, options);
  },
};
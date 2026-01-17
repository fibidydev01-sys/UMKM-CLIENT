// ============================================================================
// FILE: src/hooks/use-landing-config.ts
// PURPOSE: Custom hook for managing Landing Page configuration
// ✅ UPDATED: Added validation error handling
// ============================================================================

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { tenantsApi, ApiRequestError, getErrorMessage } from '@/lib/api';
import {
  DEFAULT_LANDING_CONFIG,
  mergeLandingConfig,
  prepareConfigForSave,
} from '@/lib/landing';
import type { TenantLandingConfig } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface UseLandingConfigOptions {
  initialConfig?: TenantLandingConfig | null;
  onSaveSuccess?: () => void;
  onValidationError?: (errors: string[]) => void;
}

interface UseLandingConfigReturn {
  config: TenantLandingConfig;
  savedConfig: TenantLandingConfig;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  validationErrors: string[];
  updateConfig: (config: TenantLandingConfig) => void;
  publishChanges: () => Promise<boolean>;
  discardChanges: () => void;
  resetToDefaults: () => Promise<boolean>;
  clearValidationErrors: () => void;
}

// ============================================================================
// HELPER: Extract all error messages
// ============================================================================

function getAllErrorMessages(error: unknown): string[] {
  if (error instanceof ApiRequestError) {
    const errors: string[] = [];

    // Add main message
    if (error.message) {
      errors.push(error.message);
    }

    // Add detailed errors array
    if (error.errors && error.errors.length > 0) {
      errors.push(...error.errors);
    }

    // Remove duplicates
    return [...new Set(errors)];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return ['Terjadi kesalahan yang tidak diketahui'];
}

// ============================================================================
// HOOK
// ============================================================================

export function useLandingConfig({
  initialConfig,
  onSaveSuccess,
  onValidationError,
}: UseLandingConfigOptions): UseLandingConfigReturn {
  // Merge initial config with defaults
  const mergedInitial = mergeLandingConfig(initialConfig);

  // Current working config (local edits)
  const [config, setConfig] = useState<TenantLandingConfig>(mergedInitial);

  // Last saved config (from server)
  const [savedConfig, setSavedConfig] = useState<TenantLandingConfig>(mergedInitial);

  // Track if initialized
  const isInitialized = useRef(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // ✅ NEW: Validation errors state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ==========================================================================
  // SYNC WITH INITIAL CONFIG (when tenant data loads)
  // ==========================================================================
  useEffect(() => {
    if (initialConfig && !isInitialized.current) {
      const merged = mergeLandingConfig(initialConfig);
      setConfig(merged);
      setSavedConfig(JSON.parse(JSON.stringify(merged)));
      isInitialized.current = true;
    }
  }, [initialConfig]);

  // ==========================================================================
  // CHECK FOR UNSAVED CHANGES
  // ==========================================================================
  const hasUnsavedChanges = JSON.stringify(config) !== JSON.stringify(savedConfig);

  // ==========================================================================
  // UPDATE CONFIG (local only, no auto-save!)
  // ==========================================================================
  const updateConfig = useCallback((newConfig: TenantLandingConfig) => {
    setConfig(newConfig);
    // Clear validation errors when user makes changes
    setValidationErrors([]);
  }, []);

  // ==========================================================================
  // CLEAR VALIDATION ERRORS
  // ==========================================================================
  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  // ==========================================================================
  // PUBLISH CHANGES (save to server)
  // ✅ UPDATED: Better error handling
  // ==========================================================================
  const publishChanges = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setValidationErrors([]); // Clear previous errors

    try {
      // Prepare config (normalize testimonials, etc.)
      const preparedConfig = prepareConfigForSave(config);

      // 🔥 DEBUG: Log what we're sending to backend
      console.group('🚀 [PUBLISH] Landing Config');
      console.log('📤 Prepared Config:', JSON.stringify(preparedConfig, null, 2));
      console.log('📊 Config Size:', JSON.stringify(preparedConfig).length, 'bytes');
      console.groupEnd();

      // Save to server
      const response = await tenantsApi.update({ landingConfig: preparedConfig });

      // 🔥 DEBUG: Log backend response
      console.group('✅ [PUBLISH] Backend Response');
      console.log('📥 Response:', response);
      console.log('📥 Saved landingConfig:', response?.tenant?.landingConfig);
      console.groupEnd();

      // Update saved config reference
      setSavedConfig(JSON.parse(JSON.stringify(preparedConfig)));
      setConfig(preparedConfig);

      toast.success('Landing page berhasil dipublish!');
      onSaveSuccess?.();

      return true;
    } catch (error) {
      console.error('[useLandingConfig] Publish error:', error);

      // ✅ Handle validation errors specifically
      if (error instanceof ApiRequestError && error.isValidationError()) {
        const errors = getAllErrorMessages(error);
        setValidationErrors(errors);
        onValidationError?.(errors);

        // Show detailed toast for validation errors
        if (errors.length === 1) {
          toast.error('Validasi gagal', {
            description: errors[0],
          });
        } else {
          toast.error('Validasi gagal', {
            description: `${errors.length} error ditemukan. Periksa form Anda.`,
          });
        }
      } else {
        // Generic error
        toast.error('Gagal menyimpan landing page', {
          description: getErrorMessage(error),
        });
      }

      return false;
    } finally {
      setIsSaving(false);
    }
  }, [config, onSaveSuccess, onValidationError]);

  // ==========================================================================
  // DISCARD CHANGES (revert to saved)
  // ==========================================================================
  const discardChanges = useCallback(() => {
    setConfig(JSON.parse(JSON.stringify(savedConfig)));
    setValidationErrors([]); // Clear errors
    toast.info('Perubahan dibatalkan');
  }, [savedConfig]);

  // ==========================================================================
  // RESET TO DEFAULTS (all sections disabled)
  // ==========================================================================
  const resetToDefaults = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setValidationErrors([]);

    try {
      // Use DEFAULT_LANDING_CONFIG (all sections disabled)
      const resetConfig: TenantLandingConfig = JSON.parse(
        JSON.stringify(DEFAULT_LANDING_CONFIG)
      );

      // Save to server
      await tenantsApi.update({ landingConfig: resetConfig });

      // Update local state
      setConfig(resetConfig);
      setSavedConfig(JSON.parse(JSON.stringify(resetConfig)));

      toast.success('Landing page berhasil direset ke default');
      onSaveSuccess?.();

      return true;
    } catch (error) {
      console.error('[useLandingConfig] Reset error:', error);

      // Handle validation errors
      if (error instanceof ApiRequestError && error.isValidationError()) {
        const errors = getAllErrorMessages(error);
        setValidationErrors(errors);
        toast.error('Gagal mereset landing page', {
          description: errors[0],
        });
      } else {
        toast.error('Gagal mereset landing page', {
          description: getErrorMessage(error),
        });
      }

      return false;
    } finally {
      setIsSaving(false);
    }
  }, [onSaveSuccess]);

  // ==========================================================================
  // RETURN
  // ==========================================================================
  return {
    config,
    savedConfig,
    hasUnsavedChanges,
    isSaving,
    validationErrors,
    updateConfig,
    publishChanges,
    discardChanges,
    resetToDefaults,
    clearValidationErrors,
  };
}
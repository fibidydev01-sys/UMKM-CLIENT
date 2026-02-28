// ============================================================================
// FILE: src/hooks/use-landing-config.ts
// PURPOSE: Custom hook for managing Landing Page configuration
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

    if (error.message) {
      errors.push(error.message);
    }

    if (error.errors && error.errors.length > 0) {
      errors.push(...error.errors);
    }

    // Remove duplicates
    return [...new Set(errors)];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return ['An unknown error occurred'];
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

  // Validation errors state
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
  // UPDATE CONFIG (local only, no auto-save)
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
  // ==========================================================================
  const publishChanges = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setValidationErrors([]);

    try {
      const preparedConfig = prepareConfigForSave(config);

      // Save to server
      const response = await tenantsApi.update({ landingConfig: preparedConfig });

      // Update saved config reference
      setSavedConfig(JSON.parse(JSON.stringify(preparedConfig)));
      setConfig(preparedConfig);

      toast.success('Landing page published!');
      onSaveSuccess?.();

      return true;
    } catch (error) {
      console.error('[useLandingConfig] Publish error:', error);

      if (error instanceof ApiRequestError && error.isValidationError()) {
        const errors = getAllErrorMessages(error);
        setValidationErrors(errors);
        onValidationError?.(errors);

        if (errors.length === 1) {
          toast.error('Validation failed', {
            description: errors[0],
          });
        } else {
          toast.error('Validation failed', {
            description: `${errors.length} errors found. Please review your settings.`,
          });
        }
      } else {
        toast.error('Failed to save landing page', {
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
    setValidationErrors([]);
    toast.info('Changes discarded');
  }, [savedConfig]);

  // ==========================================================================
  // RESET TO DEFAULTS (all sections disabled)
  // ==========================================================================
  const resetToDefaults = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setValidationErrors([]);

    try {
      const resetConfig: TenantLandingConfig = JSON.parse(
        JSON.stringify(DEFAULT_LANDING_CONFIG)
      );

      // Save to server
      await tenantsApi.update({ landingConfig: resetConfig });

      // Update local state
      setConfig(resetConfig);
      setSavedConfig(JSON.parse(JSON.stringify(resetConfig)));

      toast.success('Landing page reset to defaults');
      onSaveSuccess?.();

      return true;
    } catch (error) {
      console.error('[useLandingConfig] Reset error:', error);

      if (error instanceof ApiRequestError && error.isValidationError()) {
        const errors = getAllErrorMessages(error);
        setValidationErrors(errors);
        toast.error('Failed to reset landing page', {
          description: errors[0],
        });
      } else {
        toast.error('Failed to reset landing page', {
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
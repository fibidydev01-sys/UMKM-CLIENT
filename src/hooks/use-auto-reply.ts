'use client';

import { useState, useCallback } from 'react';
import { autoReplyApi } from '@/lib/api/auto-reply';
import { getErrorMessage } from '@/lib/api/client';
import { toast } from 'sonner';
import type {
  AutoReplyRule,
  AutoReplyRuleWithLogs,
  CreateAutoReplyRuleInput,
  UpdateAutoReplyRuleInput,
} from '@/types/chat';

// ==========================================
// USE AUTO-REPLY HOOK
// ==========================================

export function useAutoReply() {
  const [rules, setRules] = useState<AutoReplyRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<AutoReplyRuleWithLogs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Fetch all auto-reply rules
   */
  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await autoReplyApi.getRules();
      setRules(response.rules);
      return response.rules;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch single rule with logs
   */
  const fetchRule = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const rule = await autoReplyApi.getRuleById(id);
      setSelectedRule(rule);
      return rule;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new rule
   */
  const createRule = useCallback(async (data: CreateAutoReplyRuleInput) => {
    setIsSaving(true);
    try {
      const response = await autoReplyApi.createRule(data);

      if (response.success) {
        setRules((prev) => [...prev, response.rule]);
        toast.success('Aturan auto-reply berhasil dibuat');
      }

      return response.rule;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Update existing rule
   */
  const updateRule = useCallback(async (id: string, data: UpdateAutoReplyRuleInput) => {
    setIsSaving(true);
    try {
      const response = await autoReplyApi.updateRule(id, data);

      if (response.success) {
        setRules((prev) => prev.map((rule) => (rule.id === id ? response.rule : rule)));
        toast.success('Aturan auto-reply berhasil diperbarui');
      }

      return response.rule;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Delete rule
   */
  const deleteRule = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await autoReplyApi.deleteRule(id);

      if (response.success) {
        setRules((prev) => prev.filter((rule) => rule.id !== id));
        toast.success('Aturan auto-reply berhasil dihapus');
      }

      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  /**
   * Toggle rule active status
   */
  const toggleRule = useCallback(async (id: string) => {
    try {
      const response = await autoReplyApi.toggleRule(id);

      if (response.success) {
        setRules((prev) =>
          prev.map((rule) => (rule.id === id ? { ...rule, isActive: response.isActive } : rule))
        );

        toast.success(
          response.isActive ? 'Aturan auto-reply diaktifkan' : 'Aturan auto-reply dinonaktifkan'
        );
      }

      return response.isActive;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    }
  }, []);

  return {
    // Data
    rules,
    selectedRule,

    // Loading states
    isLoading,
    isSaving,
    isDeleting,

    // Actions
    fetchRules,
    fetchRule,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,

    // State setters
    setSelectedRule,
  };
}

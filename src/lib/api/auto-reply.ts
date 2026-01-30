import { api } from './client';
import type {
  AutoReplyRule,
  AutoReplyRuleWithLogs,
  AutoReplyRulesResponse,
  CreateAutoReplyRuleInput,
  UpdateAutoReplyRuleInput,
} from '@/types/chat';

// ==========================================
// AUTO-REPLY API SERVICE
// ==========================================

export const autoReplyApi = {
  /**
   * Get all auto-reply rules
   */
  getRules: (): Promise<AutoReplyRulesResponse> => {
    return api.get<AutoReplyRulesResponse>('/auto-reply/rules');
  },

  /**
   * Get single rule with recent logs
   */
  getRuleById: (id: string): Promise<AutoReplyRuleWithLogs> => {
    return api.get<AutoReplyRuleWithLogs>(`/auto-reply/rules/${id}`);
  },

  /**
   * Create new auto-reply rule
   */
  createRule: (
    data: CreateAutoReplyRuleInput
  ): Promise<{ success: boolean; rule: AutoReplyRule }> => {
    return api.post<{ success: boolean; rule: AutoReplyRule }>('/auto-reply/rules', data);
  },

  /**
   * Update auto-reply rule
   */
  updateRule: (
    id: string,
    data: UpdateAutoReplyRuleInput
  ): Promise<{ success: boolean; rule: AutoReplyRule }> => {
    return api.put<{ success: boolean; rule: AutoReplyRule }>(`/auto-reply/rules/${id}`, data);
  },

  /**
   * Delete auto-reply rule
   */
  deleteRule: (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`/auto-reply/rules/${id}`);
  },

  /**
   * Toggle rule active status
   */
  toggleRule: (id: string): Promise<{ success: boolean; isActive: boolean }> => {
    return api.patch<{ success: boolean; isActive: boolean }>(`/auto-reply/rules/${id}/toggle`);
  },
};

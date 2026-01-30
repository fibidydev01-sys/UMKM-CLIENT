import { api } from './client';
import type { WhatsAppConnectResponse, WhatsAppStatusResponse } from '@/types/chat';

// ==========================================
// WHATSAPP API SERVICE
// ==========================================

export interface SendTestMessageInput {
  to: string;
  messageType: 'TEXT' | 'IMAGE';
  content: string;
  mediaUrl?: string;
}

export const whatsappApi = {
  /**
   * Initialize WhatsApp connection and get QR code
   */
  connect: (phoneNumber?: string): Promise<WhatsAppConnectResponse> => {
    return api.post<WhatsAppConnectResponse>('/whatsapp/connect', { phoneNumber });
  },

  /**
   * Disconnect WhatsApp session
   */
  disconnect: (): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>('/whatsapp/disconnect');
  },

  /**
   * Get current connection status
   */
  getStatus: (): Promise<WhatsAppStatusResponse> => {
    return api.get<WhatsAppStatusResponse>('/whatsapp/status');
  },

  /**
   * Send test message (for testing only)
   */
  sendTestMessage: (
    data: SendTestMessageInput
  ): Promise<{ success: boolean; messageId: string }> => {
    return api.post<{ success: boolean; messageId: string }>('/whatsapp/send', data);
  },
};

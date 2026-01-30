'use client';

import { useState, useCallback } from 'react';
import { whatsappApi } from '@/lib/api/whatsapp';
import { useChatStore } from '@/stores/chat-store';
import { getErrorMessage } from '@/lib/api/client';
import { toast } from 'sonner';
import type { WhatsAppStatus } from '@/types/chat';

// ==========================================
// USE WHATSAPP HOOK
// ==========================================

export function useWhatsApp() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const { whatsappStatus, phoneNumber, qrCode, setWhatsAppStatus, setPhoneNumber, setQRCode } =
    useChatStore();

  /**
   * Initialize WhatsApp connection
   */
  const connect = useCallback(
    async (phoneNum?: string) => {
      setIsConnecting(true);
      try {
        const response = await whatsappApi.connect(phoneNum);

        setWhatsAppStatus(response.status as WhatsAppStatus);

        if (response.qrCode) {
          setQRCode(response.qrCode);
        }

        if (response.phoneNumber) {
          setPhoneNumber(response.phoneNumber);
        }

        if (response.status === 'CONNECTED') {
          toast.success('WhatsApp berhasil terhubung');
        }

        return response;
      } catch (error) {
        toast.error(getErrorMessage(error));
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    [setWhatsAppStatus, setQRCode, setPhoneNumber]
  );

  /**
   * Disconnect WhatsApp session
   */
  const disconnect = useCallback(async () => {
    setIsDisconnecting(true);
    try {
      await whatsappApi.disconnect();

      setWhatsAppStatus('DISCONNECTED');
      setPhoneNumber(null);
      setQRCode(null);

      toast.success('WhatsApp berhasil diputuskan');
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setIsDisconnecting(false);
    }
  }, [setWhatsAppStatus, setPhoneNumber, setQRCode]);

  /**
   * Check current connection status
   */
  const checkStatus = useCallback(async () => {
    setIsCheckingStatus(true);
    try {
      const response = await whatsappApi.getStatus();

      setWhatsAppStatus(response.status as WhatsAppStatus);

      if (response.phoneNumber) {
        setPhoneNumber(response.phoneNumber);
      }

      return response;
    } catch (error) {
      // Silent fail for status check
      console.error('Failed to check WhatsApp status:', error);
      return null;
    } finally {
      setIsCheckingStatus(false);
    }
  }, [setWhatsAppStatus, setPhoneNumber]);

  return {
    // State
    status: whatsappStatus,
    phoneNumber,
    qrCode,
    isConnected: whatsappStatus === 'CONNECTED',
    isConnecting,
    isDisconnecting,
    isCheckingStatus,

    // Actions
    connect,
    disconnect,
    checkStatus,

    // Direct setters (for WebSocket updates)
    setStatus: setWhatsAppStatus,
    setQRCode,
    setPhoneNumber,
  };
}

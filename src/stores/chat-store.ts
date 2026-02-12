'use client';

import { create } from 'zustand';
import type { WhatsAppStatus } from '@/types/chat';

// ==========================================
// WHATSAPP-ONLY STORE (ULTRA CLEAN)
// ==========================================

interface WhatsAppState {
  whatsappStatus: WhatsAppStatus;
  phoneNumber: string | null;
  qrCode: string | null;
}

interface WhatsAppActions {
  setWhatsAppStatus: (status: WhatsAppStatus) => void;
  setPhoneNumber: (phone: string | null) => void;
  setQRCode: (qr: string | null) => void;
  reset: () => void;
}

type WhatsAppStore = WhatsAppState & WhatsAppActions;

// ==========================================
// INITIAL STATE
// ==========================================

const initialState: WhatsAppState = {
  whatsappStatus: 'DISCONNECTED',
  phoneNumber: null,
  qrCode: null,
};

// ==========================================
// WHATSAPP STORE
// ==========================================

export const useChatStore = create<WhatsAppStore>()((set) => ({
  ...initialState,

  setWhatsAppStatus: (status) => set({ whatsappStatus: status }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setQRCode: (qr) => set({ qrCode: qr }),
  reset: () => set(initialState),
}));
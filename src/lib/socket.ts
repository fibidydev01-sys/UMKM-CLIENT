// ==========================================
// SOCKET.IO CLIENT - WhatsApp Only
// ==========================================

import { io, type Socket } from 'socket.io-client';
import { API_URL } from '@/config/constants';
import type { QRCodeEvent, ConnectionStatusEvent } from '@/types/chat';

const WS_URL = API_URL.replace('/api', '');

let whatsappSocket: Socket | null = null;

// ==========================================
// WHATSAPP SOCKET (QR & Connection Status)
// ==========================================

export function initWhatsAppSocket(): Socket {
  if (whatsappSocket?.connected) {
    return whatsappSocket;
  }

  whatsappSocket = io(`${WS_URL}/whatsapp`, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return whatsappSocket;
}

export function getWhatsAppSocket(): Socket | null {
  return whatsappSocket;
}

export function disconnectWhatsAppSocket(): void {
  if (whatsappSocket) {
    whatsappSocket.disconnect();
    whatsappSocket = null;
  }
}

// WhatsApp socket event listeners
export function onQRCode(callback: (data: QRCodeEvent) => void): () => void {
  const socket = initWhatsAppSocket();
  socket.on('qr-code', callback);
  return () => socket.off('qr-code', callback);
}

export function onConnectionStatus(callback: (data: ConnectionStatusEvent) => void): () => void {
  const socket = initWhatsAppSocket();
  socket.on('connection-status', callback);
  return () => socket.off('connection-status', callback);
}

// Cleanup (legacy compatibility)
export function disconnectAllSockets(): void {
  disconnectWhatsAppSocket();
}
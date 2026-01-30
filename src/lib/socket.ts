// ==========================================
// SOCKET.IO CLIENT
// ==========================================

import { io, type Socket } from 'socket.io-client';
import { API_URL } from '@/config/constants';
import type {
  QRCodeEvent,
  ConnectionStatusEvent,
  NewMessageEvent,
  MessageStatusUpdatedEvent,
  NewConversationEvent,
} from '@/types/chat';

// Extract base URL without /api
const WS_URL = API_URL.replace('/api', '');

// ==========================================
// SOCKET INSTANCES
// ==========================================

let whatsappSocket: Socket | null = null;
let messagesSocket: Socket | null = null;

// ==========================================
// WHATSAPP SOCKET (for QR code & connection status)
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

  whatsappSocket.on('connect', () => {
    // Connected to WhatsApp socket
  });

  whatsappSocket.on('disconnect', () => {
    // Disconnected from WhatsApp socket
  });

  whatsappSocket.on('connect_error', () => {
    // Connection error handled by socket.io reconnection
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

// ==========================================
// MESSAGES SOCKET (for real-time chat)
// ==========================================

export function initMessagesSocket(): Socket {
  if (messagesSocket?.connected) {
    return messagesSocket;
  }

  messagesSocket = io(`${WS_URL}/messages`, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  messagesSocket.on('connect', () => {
    // Connected to messages socket
  });

  messagesSocket.on('disconnect', () => {
    // Disconnected from messages socket
  });

  messagesSocket.on('connect_error', () => {
    // Connection error handled by socket.io reconnection
  });

  return messagesSocket;
}

export function getMessagesSocket(): Socket | null {
  return messagesSocket;
}

export function disconnectMessagesSocket(): void {
  if (messagesSocket) {
    messagesSocket.disconnect();
    messagesSocket = null;
  }
}

// Messages socket actions
export function joinConversation(conversationId: string): void {
  const socket = initMessagesSocket();
  socket.emit('join-conversation', { conversationId });
}

export function leaveConversation(conversationId: string): void {
  const socket = initMessagesSocket();
  socket.emit('leave-conversation', { conversationId });
}

export function emitMarkAsRead(conversationId: string): void {
  const socket = initMessagesSocket();
  socket.emit('mark-as-read', { conversationId });
}

// Messages socket event listeners
export function onNewMessage(callback: (data: NewMessageEvent) => void): () => void {
  const socket = initMessagesSocket();
  socket.on('new-message', callback);
  return () => socket.off('new-message', callback);
}

export function onMessageStatusUpdated(
  callback: (data: MessageStatusUpdatedEvent) => void
): () => void {
  const socket = initMessagesSocket();
  socket.on('message-status-updated', callback);
  return () => socket.off('message-status-updated', callback);
}

export function onNewConversation(callback: (data: NewConversationEvent) => void): () => void {
  const socket = initMessagesSocket();
  socket.on('new-conversation', callback);
  return () => socket.off('new-conversation', callback);
}

// ==========================================
// CLEANUP
// ==========================================

export function disconnectAllSockets(): void {
  disconnectWhatsAppSocket();
  disconnectMessagesSocket();
}

// ==========================================
// CHAT TYPES - WhatsApp Chat System
// ==========================================

/**
 * WhatsApp Connection Status
 */
export type WhatsAppStatus = 'DISCONNECTED' | 'QR_PENDING' | 'CONNECTING' | 'CONNECTED';

/**
 * Conversation Status
 */
export type ConversationStatus = 'ACTIVE' | 'RESOLVED' | 'CLOSED';

/**
 * Message Sender Type
 */
export type SenderType = 'CUSTOMER' | 'OWNER' | 'AUTO_REPLY';

/**
 * Message Type
 */
export type MessageType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'DOCUMENT';

/**
 * Message Delivery Status
 */
export type MessageStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

/**
 * Auto-Reply Trigger Type
 */
export type TriggerType = 'WELCOME' | 'KEYWORD' | 'TIME_BASED' | 'ORDER_STATUS' | 'PAYMENT_STATUS';

/**
 * Keyword Match Type
 */
export type MatchType = 'EXACT' | 'CONTAINS' | 'STARTS_WITH';

// ==========================================
// WHATSAPP SESSION
// ==========================================

export interface WhatsAppSession {
  id: string;
  tenantId: string;
  phoneNumber: string | null;
  qrCode: string | null;
  status: WhatsAppStatus;
  lastConnectedAt: string | null;
  lastDisconnectedAt: string | null;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppConnectResponse {
  status: WhatsAppStatus;
  qrCode?: string;
  phoneNumber?: string;
  sessionId: string;
}

export interface WhatsAppStatusResponse {
  status: WhatsAppStatus;
  phoneNumber?: string;
  lastConnected?: string;
  isOnline: boolean;
}

// ==========================================
// CONTACT
// ==========================================

export interface Contact {
  id: string;
  tenantId: string;
  phone: string;
  waId?: string;
  name?: string;
  avatarUrl?: string;
  totalConversations: number;
  firstContactAt: string;
  lastContactAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  phone: string;
  name?: string;
  avatarUrl?: string;
}

export interface UpdateContactInput {
  name?: string;
  avatarUrl?: string;
}

// ==========================================
// CONVERSATION
// ==========================================

export interface Conversation {
  id: string;
  tenantId: string;
  customerPhone: string;
  customerName?: string;
  customerAvatarUrl?: string;
  status: ConversationStatus;
  unreadCount: number;
  totalMessages: number;
  lastMessageAt: string;
  lastMessageContent?: string;
  lastMessageFrom?: SenderType;
  createdAt: string;
  updatedAt: string;
  contact?: Contact;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface ConversationListResponse {
  data: Conversation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ConversationDetailResponse {
  conversation: Conversation;
  messages: Message[];
}

export interface ConversationFilters {
  status?: ConversationStatus;
  search?: string;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdateConversationInput {
  status?: ConversationStatus;
}

// ==========================================
// MESSAGE
// ==========================================

export interface Message {
  id: string;
  conversationId: string;
  tenantId: string;
  waMessageId?: string;
  senderType: SenderType;
  senderId?: string;
  senderName?: string;
  messageType: MessageType;
  content: string;
  mediaUrl?: string;
  mediaMimeType?: string;
  quotedMessageId?: string;
  quotedMessage?: Message;
  status: MessageStatus;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface SendMessageInput {
  conversationId: string;
  messageType: MessageType;
  content: string;
  mediaUrl?: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: {
    id: string;
    waMessageId: string;
    status: MessageStatus;
    sentAt: string;
  };
}

export interface MessagesListResponse {
  messages: Message[];
  hasMore: boolean;
}

export interface MessageFilters {
  conversationId: string;
  before?: string;
  limit?: number;
}

// ==========================================
// AUTO-REPLY
// ==========================================

export interface WorkingHours {
  start: string; // "09:00"
  end: string; // "21:00"
  timezone: string; // "Asia/Jakarta"
  days: number[]; // [1,2,3,4,5] = Mon-Fri
}

export interface AutoReplyRule {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  triggerType: TriggerType;
  keywords: string[];
  matchType?: MatchType;
  caseSensitive: boolean;
  workingHours?: WorkingHours;
  statusTrigger?: string; // For ORDER_STATUS & PAYMENT_STATUS
  responseMessage: string;
  priority: number;
  delaySeconds: number;
  isActive: boolean;
  totalTriggered: number;
  lastTriggeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutoReplyLog {
  id: string;
  ruleId: string;
  tenantId: string;
  conversationId: string;
  triggeredByMessage: string;
  responseSent: string;
  matchedKeyword?: string;
  delaySeconds: number;
  triggeredAt: string;
}

export interface AutoReplyRuleWithLogs extends AutoReplyRule {
  recentLogs?: AutoReplyLog[];
}

export interface AutoReplyRulesResponse {
  rules: AutoReplyRule[];
}

export interface CreateAutoReplyRuleInput {
  name: string;
  description?: string;
  triggerType: TriggerType;
  keywords?: string[];
  matchType?: MatchType;
  caseSensitive?: boolean;
  workingHours?: WorkingHours;
  statusTrigger?: string; // For ORDER_STATUS & PAYMENT_STATUS
  responseMessage: string;
  priority?: number;
  delaySeconds?: number;
  isActive?: boolean;
}

export type UpdateAutoReplyRuleInput = Partial<CreateAutoReplyRuleInput>;

// ==========================================
// WEBSOCKET EVENTS
// ==========================================

export interface QRCodeEvent {
  qrCode: string;
  expiresIn: number;
}

export interface ConnectionStatusEvent {
  status: WhatsAppStatus;
  phoneNumber?: string;
}

export interface NewMessageEvent {
  conversationId: string;
  message: Message;
}

export interface MessageStatusUpdatedEvent {
  messageId: string;
  status: MessageStatus;
  deliveredAt?: string;
  readAt?: string;
}

export interface NewConversationEvent {
  conversation: Conversation;
}

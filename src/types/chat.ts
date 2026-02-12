// ==========================================
// CHAT TYPES - WhatsApp Auto-Reply Only
// ==========================================

/**
 * WhatsApp Connection Status
 */
export type WhatsAppStatus = 'DISCONNECTED' | 'QR_PENDING' | 'CONNECTING' | 'CONNECTED';

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
  triggeredByMessage: string | null;
  responseSent: string | null;
  matchedKeyword?: string | null;
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
  statusTrigger?: string;
  responseMessage: string;
  priority?: number;
  delaySeconds?: number;
  isActive?: boolean;
}

export type UpdateAutoReplyRuleInput = Partial<CreateAutoReplyRuleInput>;

// ==========================================
// WEBSOCKET EVENTS (WhatsApp Only)
// ==========================================

export interface QRCodeEvent {
  qrCode: string;
  expiresIn: number;
}

export interface ConnectionStatusEvent {
  status: WhatsAppStatus;
  phoneNumber?: string;
}
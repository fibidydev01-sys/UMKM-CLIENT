// ==========================================
// CUSTOM DOMAIN TYPES (AUTO-POLLING VERSION)
// ==========================================

/**
 * DNS Record instruction (single record)
 */
export interface DnsRecord {
  type: 'CNAME' | 'TXT' | 'A';
  name: string;
  value: string;
  ttl: string;
  note: string;
}

/**
 * DNS Instructions object (stored in tenant.dnsRecords)
 */
export interface DnsInstructions {
  cname: DnsRecord;
  cnameWWW: DnsRecord;
  txtVerification: DnsRecord;
}

/**
 * Domain verification check results
 */
export interface DomainChecks {
  cname: boolean;
  txt: boolean;
}

// ==========================================
// 🆕 AUTO-POLLING TYPES
// ==========================================

/**
 * Individual DNS record status
 */
export type DnsRecordStatus = 'pending' | 'checking' | 'verified' | 'failed';

/**
 * DNS status response from /check-status endpoint
 */
export interface DnsStatusResponse {
  cname: DnsRecordStatus;
  cnameWWW: DnsRecordStatus;
  txt: DnsRecordStatus;
  allVerified: boolean;
  lastChecked?: string;
}

// ==========================================
// API REQUEST TYPES
// ==========================================

/**
 * POST /tenants/domain/request - body
 */
export interface RequestDomainInput {
  tenantId: string;
  customDomain: string;
}

/**
 * POST /tenants/domain/verify - body
 */
export interface VerifyDomainInput {
  tenantId: string;
}

/**
 * DELETE /tenants/domain/remove - body
 */
export interface RemoveDomainInput {
  tenantId: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * POST /tenants/domain/request - response
 */
export interface RequestDomainResponse {
  success: boolean;
  tenant: import('./tenant').Tenant;
  instructions: DnsInstructions;
}

/**
 * POST /tenants/domain/verify - response (success)
 */
export interface VerifyDomainResponse {
  success: boolean;
  message: string;
  domain: string;
}

/**
 * POST /tenants/domain/verify - response (failed)
 */
export interface VerifyDomainErrorResponse {
  error: string;
  checks: DomainChecks;
}

/**
 * GET /tenants/domain/ssl-status - response
 */
export interface SslStatusResponse {
  sslStatus: 'pending' | 'active' | 'failed' | 'not_configured' | 'unknown';
  domain?: string;
  issuedAt?: string | null;
  message?: string;
}

/**
 * DELETE /tenants/domain/remove - response
 */
export interface RemoveDomainResponse {
  success: boolean;
  message: string;
}

// ==========================================
// UI STATE TYPES
// ==========================================

/**
 * Multi-step wizard state
 */
export type DomainSetupStep =
  | 'idle'          // Belum mulai / belum ada domain
  | 'input'         // User input domain
  | 'instructions'  // Tampilkan DNS instructions (AUTO-POLLING!)
  | 'verifying'     // Sedang verifikasi (not used in auto-polling)
  | 'verified'      // DNS verified, SSL pending
  | 'active'        // SSL active, domain live!
  | 'error';        // Error state

/**
 * Domain status summary
 */
export interface DomainStatus {
  hasDomain: boolean;
  domain: string | null;
  isVerified: boolean;
  sslStatus: string | null;
  isFullyActive: boolean; // verified + SSL active
}
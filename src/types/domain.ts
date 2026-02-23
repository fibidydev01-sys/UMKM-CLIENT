// ==========================================
// CUSTOM DOMAIN TYPES
// Simple & Clean — No over-engineering
// ==========================================

/**
 * DNS Record dari Vercel
 */
export interface DnsRecord {
  type: 'CNAME' | 'TXT' | 'A';
  name: string;
  value: string;
  ttl?: string;
}

/**
 * Response dari Vercel saat add/get domain
 * Vercel yang tentukan DNS records apa yang dipasang
 */
export interface VercelDomainInfo {
  name: string;
  verified: boolean;
  verification?: DnsRecord[];   // Records yang harus dipasang user
  configured?: boolean;
  sslStatus?: 'pending' | 'active' | 'failed';
}

// ==========================================
// API REQUEST TYPES
// ==========================================

export interface RequestDomainInput {
  tenantId: string;
  customDomain: string;
}

export interface RemoveDomainInput {
  tenantId: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * POST /tenants/domain/request
 * Backend add domain ke Vercel → return DNS records dari Vercel
 */
export interface RequestDomainResponse {
  success: boolean;
  tenant: import('./tenant').Tenant;
  dnsRecords: DnsRecord[];       // Dari Vercel langsung!
  verified: boolean;
}

/**
 * GET /tenants/domain/status
 * Backend tanya Vercel → return status terkini
 */
export interface DomainStatusResponse {
  verified: boolean;
  configured: boolean;
  sslStatus: 'pending' | 'active' | 'failed' | 'not_configured';
  dnsRecords: DnsRecord[];       // Kalau belum verified, tampilkan lagi
  domain: string;
}

/**
 * DELETE /tenants/domain/remove
 */
export interface RemoveDomainResponse {
  success: boolean;
  message: string;
}

// ==========================================
// UI STATE TYPES
// Simple — derived dari tenant data langsung
// ==========================================

/**
 * Status domain tenant — derived dari Tenant object
 * Tidak perlu state management berlapis
 */
export interface DomainStatus {
  hasDomain: boolean;
  domain: string | null;
  isVerified: boolean;
  sslStatus: 'pending' | 'active' | 'failed' | 'not_configured' | null;
  isFullyActive: boolean;        // verified + SSL active
  dnsRecords: DnsRecord[];       // Records yang harus dipasang
}
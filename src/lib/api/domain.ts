import { api } from './client';
import type {
  RequestDomainInput,
  RequestDomainResponse,
  VerifyDomainInput,
  VerifyDomainResponse,
  SslStatusResponse,
  RemoveDomainInput,
  RemoveDomainResponse,
  DnsStatusResponse, // 🆕 ADD THIS
} from '@/types';

// ==========================================
// DOMAIN API SERVICE (AUTO-POLLING VERSION)
// ==========================================

export const domainApi = {
  /**
   * 🆕 Check DNS status (for auto-polling)
   * GET /tenants/domain/check-status?domain=example.com
   *
   * Returns individual status for each DNS record.
   * Called every 10 seconds by frontend auto-polling.
   */
  checkDnsStatus: async (domain: string): Promise<DnsStatusResponse> => {
    return api.get<DnsStatusResponse>('/tenants/domain/check-status', {
      params: { domain },
    });
  },

  /**
   * Request a custom domain
   * POST /tenants/domain/request
   *
   * Generates verification token + DNS instructions.
   * User must then add DNS records at their registrar.
   */
  request: async (data: RequestDomainInput): Promise<RequestDomainResponse> => {
    return api.post<RequestDomainResponse>('/tenants/domain/request', data);
  },

  /**
   * Verify DNS records (manual fallback)
   * POST /tenants/domain/verify
   *
   * Note: With auto-polling, this is rarely needed.
   * Frontend auto-polling handles verification automatically.
   */
  verify: async (data: VerifyDomainInput): Promise<VerifyDomainResponse> => {
    return api.post<VerifyDomainResponse>('/tenants/domain/verify', data);
  },

  /**
   * Check SSL certificate status
   * GET /tenants/domain/ssl-status?tenantId=xxx
   *
   * Polls Vercel API for SSL status.
   * Auto-updates tenant when SSL becomes active.
   */
  sslStatus: async (tenantId: string): Promise<SslStatusResponse> => {
    return api.get<SslStatusResponse>('/tenants/domain/ssl-status', {
      params: { tenantId },
    });
  },

  /**
   * Remove custom domain
   * DELETE /tenants/domain/remove
   *
   * Removes from Vercel + resets all domain fields in DB.
   */
  remove: async (data: RemoveDomainInput): Promise<RemoveDomainResponse> => {
    return api.deleteWithBody<RemoveDomainResponse>(
      '/tenants/domain/remove',
      data,
    );
  },
};
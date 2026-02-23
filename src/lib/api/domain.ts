import { api } from './client';
import type {
  RequestDomainInput,
  RequestDomainResponse,
  DomainStatusResponse,
  RemoveDomainInput,
  RemoveDomainResponse,
} from '@/types';

// ==========================================
// DOMAIN API SERVICE
// Simple — No polling, no magic
// ==========================================

export const domainApi = {
  /**
   * Request custom domain
   * POST /tenants/domain/request
   *
   * Backend akan:
   * 1. Add domain ke Vercel API
   * 2. Vercel return DNS records yang harus dipasang
   * 3. Simpan ke DB
   * 4. Return DNS records ke frontend
   */
  request: async (data: RequestDomainInput): Promise<RequestDomainResponse> => {
    return api.post<RequestDomainResponse>('/tenants/domain/request', data);
  },

  /**
   * Cek status domain (manual — user yang klik)
   * GET /tenants/domain/status?tenantId=xxx
   *
   * Backend akan:
   * 1. Tanya Vercel: sudah verified? SSL status?
   * 2. Update DB kalau ada perubahan
   * 3. Return status terkini
   *
   * Dipanggil HANYA saat user klik "Cek Status"
   * Tidak ada auto-polling!
   */
  checkStatus: async (tenantId: string): Promise<DomainStatusResponse> => {
    return api.get<DomainStatusResponse>('/tenants/domain/status', {
      params: { tenantId },
    });
  },

  /**
   * Hapus custom domain
   * DELETE /tenants/domain/remove
   *
   * Backend akan:
   * 1. Remove dari Vercel
   * 2. Reset semua domain fields di DB
   */
  remove: async (data: RemoveDomainInput): Promise<RemoveDomainResponse> => {
    return api.deleteWithBody<RemoveDomainResponse>(
      '/tenants/domain/remove',
      data,
    );
  },
};
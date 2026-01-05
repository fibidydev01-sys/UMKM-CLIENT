import type { Tenant } from './tenant';

// ==========================================
// AUTH TYPES
// ==========================================

/**
 * Login request payload
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterInput {
  slug: string;
  name: string;
  category: string;
  email: string;
  password: string;
  whatsapp: string;
  description?: string;
  phone?: string;
  address?: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  message: string;
  access_token: string;
  tenant: Tenant;
}

/**
 * JWT Payload (decoded token)
 */
export interface JwtPayload {
  sub: string;      // tenant id
  email: string;
  slug: string;
  iat: number;
  exp: number;
}

/**
 * Change password request
 */
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
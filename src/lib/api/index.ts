// ==========================================
// API
// ==========================================

export { api, ApiRequestError, isApiError, getErrorMessage } from './client';
export type { RequestConfig } from './client';

export { authApi } from './auth';
export { autoReplyApi } from './auto-reply';
export { customersApi } from './customers';
export { domainApi } from './domain';
export { feedApi } from './feed';
export { ordersApi } from './orders';
export { productsApi } from './products';
export { tenantsApi } from './tenants';
export { whatsappApi } from './whatsapp';
export { subscriptionApi } from './subscription';
export { adminApiClient } from './admin-client';
export { adminApi } from './admin';

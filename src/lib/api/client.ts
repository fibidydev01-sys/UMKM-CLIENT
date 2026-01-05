import { API_URL } from '@/config/constants';
import type { ApiError } from '@/types';

// ==========================================
// API CLIENT CONFIGURATION
// ==========================================

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  skipAuthRedirect?: boolean; // ✅ NEW: Option to skip auto-redirect
}

export interface ApiClientConfig {
  baseURL: string;
  onUnauthorized?: () => void;
}

// ==========================================
// API CLIENT CLASS
// ==========================================

class ApiClient {
  private baseURL: string;
  private onUnauthorized?: () => void;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.onUnauthorized = config.onUnauthorized;
  }

  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const fullURL = `${this.baseURL}${endpoint}`;
    const url = new URL(fullURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  private async handleResponse<T>(
    response: Response,
    skipAuthRedirect?: boolean,
  ): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      // ✅ Only trigger unauthorized handler if not skipped
      if (response.status === 401 && !skipAuthRedirect) {
        this.onUnauthorized?.();
      }

      let error: ApiError;
      if (isJson) {
        error = await response.json();
      } else {
        error = {
          statusCode: response.status,
          message: response.statusText || 'An error occurred',
        };
      }

      throw new ApiRequestError(error);
    }

    if (isJson) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 30000,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include', // ✅ Include cookies for auth
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = this.getHeaders(config?.headers);

    const response = await this.fetchWithTimeout(
      url,
      { method: 'GET', headers, ...config },
      config?.timeout,
    );

    return this.handleResponse<T>(response, config?.skipAuthRedirect);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = this.getHeaders(config?.headers);

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      },
      config?.timeout,
    );

    return this.handleResponse<T>(response, config?.skipAuthRedirect);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = this.getHeaders(config?.headers);

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      },
      config?.timeout,
    );

    return this.handleResponse<T>(response, config?.skipAuthRedirect);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = this.getHeaders(config?.headers);

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      },
      config?.timeout,
    );

    return this.handleResponse<T>(response, config?.skipAuthRedirect);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = this.getHeaders(config?.headers);

    const response = await this.fetchWithTimeout(
      url,
      { method: 'DELETE', headers, ...config },
      config?.timeout,
    );

    return this.handleResponse<T>(response, config?.skipAuthRedirect);
  }

  // ✅ NEW: Delete with body (for bulk operations)
  async deleteWithBody<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = this.getHeaders(config?.headers);

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'DELETE',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      },
      config?.timeout || 60000, // Longer timeout for bulk ops
    );

    return this.handleResponse<T>(response, config?.skipAuthRedirect);
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig,
  ): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = new Headers(config?.headers);

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers,
        body: formData,
        ...config,
      },
      config?.timeout || 60000,
    );

    return this.handleResponse<T>(response, config?.skipAuthRedirect);
  }
}

// ==========================================
// API ERROR CLASS
// ==========================================

export class ApiRequestError extends Error {
  public statusCode: number;
  public errors?: string[];

  constructor(error: ApiError) {
    const message = Array.isArray(error.message)
      ? error.message.join(', ')
      : error.message;

    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = error.statusCode;
    this.errors = Array.isArray(error.message) ? error.message : undefined;
  }

  isValidationError(): boolean {
    return this.statusCode === 400;
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

// ==========================================
// CREATE API CLIENT INSTANCE
// ==========================================

/**
 * ✅ IMPROVED: Handle unauthorized with proper state cleanup
 */
function handleUnauthorized(): void {
  if (typeof window === 'undefined') return;

  // Skip if already on login page
  if (window.location.pathname === '/login') return;

  // ✅ Clear any localStorage tokens (legacy cleanup)
  try {
    localStorage.removeItem('fibidy_token');
  } catch {
    // Ignore localStorage errors
  }

  // ✅ Dispatch custom event for auth store to listen
  // This allows the store to reset before redirect
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));

  // ✅ Small delay to allow store cleanup, then redirect
  setTimeout(() => {
    const currentPath = window.location.pathname + window.location.search;
    const loginUrl = `/login?from=${encodeURIComponent(currentPath)}`;
    window.location.href = loginUrl;
  }, 100);
}

export const api = new ApiClient({
  baseURL: API_URL,
  onUnauthorized: handleUnauthorized,
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function isApiError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'Request timeout - coba lagi dalam beberapa saat';
    }
    return error.message;
  }
  return 'Terjadi kesalahan yang tidak diketahui';
}
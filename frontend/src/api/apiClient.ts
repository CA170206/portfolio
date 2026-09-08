/**
 * Shared API Client & URL Construction Utility
 *
 * Centralizes base URL normalization and URL construction for both
 * public and admin API requests across development and production.
 * Ensures the API URL always includes the '/api' prefix without duplication,
 * whether VITE_API_URL is configured with or without '/api'.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

/**
 * Resolves the base API URL from VITE_API_URL or localhost fallback.
 * Ensures the returned base URL always ends with '/api' (without trailing slashes),
 * so that both `https://example.com` and `https://example.com/api` resolve properly.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  const rawBase = envUrl || 'http://localhost:5000/api';
  const cleanBase = rawBase.replace(/\/+$/, '');
  return cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
};

/**
 * Builds a clean, fully-qualified API URL for any given endpoint:
 * - Strips redundant '/api' prefix from the endpoint if present to prevent '/api/api/...'
 * - Handles endpoints with or without leading slashes ('profile/public' vs '/profile/public')
 * - Ensures final URL is: ${baseUrl}${cleanPath}
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If endpoint already starts with '/api/', strip '/api' from endpoint to prevent '/api/api/...'
  const path = cleanEndpoint.startsWith('/api/')
    ? cleanEndpoint.slice(4) // keeps the slash after '/api', e.g. '/api/profile/public' -> '/profile/public'
    : cleanEndpoint === '/api'
      ? ''
      : cleanEndpoint;

  return `${baseUrl}${path}`;
};

const TOKEN_KEY = 'admin_jwt_token';

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Ignore storage write errors (e.g. private browsing restrictions)
  }
};

export const clearStoredToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
};

export class ApiClient {
  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);

    const headers = this.getHeaders(options.headers);
    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Session Expiration
      if (response.status === 401) {
        clearStoredToken();
        // Dispatch event for AuthContext to sync state without infinite loops
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      let data: ApiResponse<T>;
      try {
        data = await response.json();
      } catch {
        data = {
          success: false,
          message: response.statusText || 'An unexpected error occurred',
        };
      }

      if (!response.ok && data.success === undefined) {
        data.success = false;
      }

      return data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Network error occurred';
      return {
        success: false,
        message,
      };
    }
  }

  get<T = unknown>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  post<T = unknown>(endpoint: string, body?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  put<T = unknown>(endpoint: string, body?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  delete<T = unknown>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
export default apiClient;

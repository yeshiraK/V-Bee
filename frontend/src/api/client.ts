import { CONFIG } from '../config/env';
import { ApiResponse } from '../types/api';

let currentToken: string | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedCallback = handler;
};

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | undefined>;
  requiresAuth?: boolean;
}

/**
 * Centralized API client for communicating with the VTOP backend.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, requiresAuth = true, headers = {}, ...customConfig } = options;

  let url = `${CONFIG.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth && currentToken) {
    reqHeaders['Authorization'] = `Bearer ${currentToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeoutMs);

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: reqHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
      throw new ApiError('Your session has expired or is invalid. Please log in again.', 401);
    }

    const json: ApiResponse<T> = await response.json().catch(() => {
      throw new ApiError('Failed to parse response from server', response.status);
    });

    if (!response.ok || json.status === 'error') {
      const errorMsg = json.error || `Request failed with status ${response.status}`;
      throw new ApiError(errorMsg, response.status, json.data);
    }

    return json.data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Connection timed out. Please check your network connection.', 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err.message || 'Unable to connect to VTOP server. Please verify backend is running.',
      500
    );
  }
}

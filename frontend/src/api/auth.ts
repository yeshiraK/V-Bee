import { apiClient } from './client';
import { LoginResponse, LoginVerifyResponse } from '../types/api';

/**
 * Step 1: Initiate login to get a login_session_id and captcha image data URI.
 */
export async function initiateLogin(username: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username }),
    requiresAuth: false,
  });
}

/**
 * Step 2: Submit username, password, captcha text and login_session_id to receive a JWT.
 */
export async function verifyLogin(params: {
  login_session_id: string;
  username: string;
  password: string;
  captcha: string;
}): Promise<LoginVerifyResponse> {
  return apiClient<LoginVerifyResponse>('/api/login/verify', {
    method: 'POST',
    body: JSON.stringify(params),
    requiresAuth: false,
  });
}

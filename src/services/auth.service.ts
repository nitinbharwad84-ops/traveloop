import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '@/schemas/auth.schema';
import { ApiResponse } from '@/types';

// Centralize the API fetch wrapper
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await res.json();
    return data as ApiResponse<T>;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'A network error occurred. Please try again.',
      },
    };
  }
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterInput) {
    return fetchApi('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Log in an existing user
   */
  async login(data: LoginInput) {
    return fetchApi('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Log out the current user
   */
  async logout() {
    return fetchApi('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Request a password reset email
   */
  async forgotPassword(data: ForgotPasswordInput) {
    return fetchApi('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Reset the password (used after clicking the email link)
   */
  async resetPassword(data: ResetPasswordInput) {
    return fetchApi('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    return fetchApi<{ user: { id: string; email: string } }>('/api/v1/auth/me', {
      method: 'GET',
    });
  },
};

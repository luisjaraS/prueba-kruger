import { apiClient } from '@/lib/api-client';
import { jwtDecode } from 'jwt-decode';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface JWTPayload {
  sub: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}

export class AuthService {
  private decodeToken(token: string): User | null {
    try {
      const payload: JWTPayload = jwtDecode(token);
      const username = payload.sub.split('@')[0];

      return {
        id: payload.sub,
        username: username,
        email: payload.sub,
        role: payload.role,
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<{ token: string }>(
        '/auth/login',
        credentials
      );

      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        apiClient.setToken(response.token);

        const user = this.decodeToken(response.token);

        if (user) {
          return {
            token: response.token,
            user: user,
          };
        } else {
          throw new Error('Token inválido');
        }
      } else {
        throw new Error('No se recibió token');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(
        error.response?.data?.message || 'Credenciales inválidas'
      );
    }
  }

  setAuthHeader(token: string): void {
    apiClient.setToken(token);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    apiClient.clearToken();
  }

  removeAuthHeader(): void {
    apiClient.clearToken();
  }

  getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getStoredToken() !== null;
  }

  getCurrentUser(): User | null {
    const token = this.getStoredToken();
    if (!token) return null;

    return this.decodeToken(token);
  }
}

export const authService = new AuthService();

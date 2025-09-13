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

// Interface para el payload del JWT
interface JWTPayload {
  sub: string; // email del usuario
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}

export class AuthService {
  // Decodificar token JWT y extraer información del usuario
  private decodeToken(token: string): User | null {
    try {
      const payload: JWTPayload = jwtDecode(token);

      // Extraer el username del email (antes del @)
      const username = payload.sub.split('@')[0];

      return {
        id: payload.sub, // Usamos el email como ID por ahora
        username: username,
        email: payload.sub,
        role: payload.role,
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  // Login de usuario
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<{ token: string }>(
        '/auth/login',
        credentials
      );

      if (response.token) {
        // Guardar token en localStorage
        localStorage.setItem('auth_token', response.token);
        // Configurar token en el cliente API
        apiClient.setToken(response.token);

        // Decodificar token para obtener información del usuario
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

  // Establece el token en el cliente API
  setAuthHeader(token: string): void {
    apiClient.setToken(token);
  }

  // Logout de usuario
  logout(): void {
    localStorage.removeItem('auth_token');
    apiClient.clearToken();
  }

  // Remover header de autorización
  removeAuthHeader(): void {
    apiClient.clearToken();
  }

  // Verificar si hay token guardado
  getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getStoredToken() !== null;
  }

  // Obtener el usuario actual decodificando el token
  getCurrentUser(): User | null {
    const token = this.getStoredToken();
    if (!token) return null;

    return this.decodeToken(token);
  }
}

export const authService = new AuthService();

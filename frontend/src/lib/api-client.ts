import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

// Tipos para la configuración de la API
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Tipos para los interceptors
export interface ApiInterceptors {
  request?: {
    onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    onRejected?: (error: AxiosError) => Promise<AxiosError>;
  };
  response?: {
    onFulfilled?: (response: AxiosResponse) => AxiosResponse;
    onRejected?: (error: AxiosError) => Promise<AxiosError>;
  };
}

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor(config: ApiConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Añade el token automáticamente
    this.instance.interceptors.request.use(
      config => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Maneja errores globales
    this.instance.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          this.clearToken();
          // Redirigir al login o renovar token
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos para manejo de tokens
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;

    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }

    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // Obtener instancia de axios para casos específicos
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Instancia principal de la API
export const apiClient = new ApiClient({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9180/kevaluacion',
  timeout: 15000,
});

// Configurar token inicial si existe
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  if (token) {
    apiClient.setToken(token);
  }
}

export default apiClient;

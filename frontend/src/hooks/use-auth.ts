import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authService, LoginCredentials } from '@/services/auth';
import { useAuthStore } from '@/store';

// Hook para inicializar el usuario desde el token almacenado
export function useInitializeAuth() {
  const { login: loginStore, logout: logoutStore, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = () => {
      setLoading(true);

      const token = authService.getStoredToken();
      if (token) {
        try {
          const user = authService.getCurrentUser();
          if (user) {
            // Actualizar el store con el usuario del token
            loginStore(user, token);
            // Configurar el token en los headers de axios
            authService.setAuthHeader(token);
          } else {
            // Token inválido, hacer logout
            authService.logout();
            logoutStore();
          }
        } catch (error) {
          // Token inválido o expirado, hacer logout
          console.error('Error inicializando autenticación:', error);
          authService.logout();
          logoutStore();
        }
      } else {
        // No hay token, asegurar logout
        authService.removeAuthHeader();
        logoutStore();
      }

      setLoading(false);
    };

    initializeAuth();
  }, [loginStore, logoutStore, setLoading]);
}

// Hook para el login
export function useLogin() {
  const router = useRouter();
  const { login: loginStore, logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: data => {
      // Actualizar el store con los datos del usuario
      loginStore(data.user, data.token);
      // Configurar header de autorización
      authService.setAuthHeader(data.token);
      // Redirigir al dashboard
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      console.error('Error en login:', error);
      // Limpiar cualquier estado de autenticación
      authService.logout();
      logoutStore();
      throw error;
    },
  });
}

// Hook para logout
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Limpiar el store
      logoutStore();

      // Limpiar cache de React Query
      queryClient.clear();

      // Redirigir al login
      router.push('/login');
    },
    onError: () => {
      // Aunque falle el logout, redirigir al login
      router.push('/login');
    },
  });
}

// Hook para verificar autenticación
export function useAuth() {
  const authState = useAuthStore();

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
  };
}

// Hook para proteger rutas
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const checkAuth = () => {
    if (!isAuthenticated && !authService.isAuthenticated()) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return { checkAuth, isAuthenticated };
}

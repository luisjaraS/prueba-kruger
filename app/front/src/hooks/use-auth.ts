import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authService, LoginCredentials } from '@/services/auth';
import { useAuthStore } from '@/store';

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
            loginStore(user, token);
            authService.setAuthHeader(token);
          } else {
            authService.logout();
            logoutStore();
          }
        } catch (error) {
          console.error('Error inicializando autenticación:', error);
          authService.logout();
          logoutStore();
        }
      } else {
        authService.removeAuthHeader();
        logoutStore();
      }

      setLoading(false);
    };

    initializeAuth();
  }, [loginStore, logoutStore, setLoading]);
}

export function useLogin() {
  const router = useRouter();
  const { login: loginStore, logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: data => {
      loginStore(data.user, data.token);
      authService.setAuthHeader(data.token);
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      console.error('Error en login:', error);
      authService.logout();
      logoutStore();
      throw error;
    },
  });
}

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
      logoutStore();
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      router.push('/login');
    },
  });
}

export function useAuth() {
  const authState = useAuthStore();

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
  };
}

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

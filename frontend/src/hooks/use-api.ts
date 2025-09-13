import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResponse } from '@/types';

// Hook personalizado para queries GET
export function useApiQuery<TData = any, TError = AxiosError>(
  key: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: () => apiClient.get<TData>(endpoint),
    ...options,
  });
}

// Hook para queries paginadas
export function usePaginatedQuery<TData = any, TError = AxiosError>(
  key: string[],
  endpoint: string,
  params: { page: number; limit: number; [key: string]: any },
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TData>, TError>,
    'queryKey' | 'queryFn'
  >
) {
  const queryString = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...Object.fromEntries(
      Object.entries(params).filter(([k]) => k !== 'page' && k !== 'limit')
    ),
  }).toString();

  return useQuery<PaginatedResponse<TData>, TError>({
    queryKey: [...key, params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<TData>>(`${endpoint}?${queryString}`),
    ...options,
  });
}

// Hook personalizado para mutaciones
export function useApiMutation<
  TData = any,
  TVariables = any,
  TError = AxiosError,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidar queries relacionadas automáticamente
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// Hook para mutaciones POST
export function useCreateMutation<
  TData = any,
  TVariables = any,
  TError = AxiosError,
>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, TError, TVariables>
) {
  return useApiMutation(
    (variables: TVariables) =>
      apiClient.post<ApiResponse<TData>>(endpoint, variables),
    options
  );
}

// Hook para mutaciones PUT
export function useUpdateMutation<
  TData = any,
  TVariables = any,
  TError = AxiosError,
>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, TError, TVariables>
) {
  return useApiMutation(
    (variables: TVariables) =>
      apiClient.put<ApiResponse<TData>>(endpoint, variables),
    options
  );
}

// Hook para mutaciones DELETE
export function useDeleteMutation<
  TData = any,
  TVariables = string,
  TError = AxiosError,
>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, TError, TVariables>
) {
  return useApiMutation(
    (id: TVariables) =>
      apiClient.delete<ApiResponse<TData>>(`${endpoint}/${id}`),
    options
  );
}

// Hook para invalidar queries específicas
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidate: (keys: string[]) =>
      queryClient.invalidateQueries({ queryKey: keys }),
    invalidateAll: () => queryClient.invalidateQueries(),
    refetch: (keys: string[]) => queryClient.refetchQueries({ queryKey: keys }),
  };
}

// Hook para manejo de cache
export function useQueryCache() {
  const queryClient = useQueryClient();

  return {
    getQueryData: <T = any>(keys: string[]) =>
      queryClient.getQueryData<T>(keys),
    setQueryData: <T = any>(keys: string[], data: T) =>
      queryClient.setQueryData(keys, data),
    removeQueries: (keys: string[]) =>
      queryClient.removeQueries({ queryKey: keys }),
    clear: () => queryClient.clear(),
  };
}

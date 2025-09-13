import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/tasks';
import { Task } from '@/types';

// Query keys para React Query
export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...taskQueryKeys.lists(), { filters }] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskQueryKeys.details(), id] as const,
  byProject: (projectId: number) =>
    [...taskQueryKeys.all, 'project', projectId] as const,
};

/**
 * Hook para obtener todas las tareas del usuario
 */
export function useTasks() {
  return useQuery({
    queryKey: taskQueryKeys.lists(),
    queryFn: () => taskService.getUserTasks(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener tareas de un proyecto específico
 */
export function useTasksByProject(projectId: number) {
  return useQuery({
    queryKey: taskQueryKeys.byProject(projectId),
    queryFn: () => taskService.getTasksByProject(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para crear una nueva tarea
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => taskService.createTask(task),
    onSuccess: () => {
      // Invalidar la cache de tareas para refrescar la lista
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists(),
      });
      // También invalidar las tareas por proyecto si es relevante
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });
}

/**
 * Hook para actualizar una tarea
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: Task }) =>
      taskService.updateTask(id, task),
    onSuccess: (data, variables) => {
      // Invalidar tanto la lista como el detalle específico
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.detail(variables.id),
      });
      // Invalidar tareas por proyecto
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });
}

/**
 * Hook para eliminar una tarea
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      // Invalidar la cache de tareas
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });
}

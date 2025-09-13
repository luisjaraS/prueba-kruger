import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/tasks';
import { Task } from '@/types';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...taskQueryKeys.lists(), { filters }] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskQueryKeys.details(), id] as const,
  byProject: (projectId: number) =>
    [...taskQueryKeys.all, 'project', projectId] as const,
};

export function useTasks() {
  return useQuery({
    queryKey: taskQueryKeys.lists(),
    queryFn: () => taskService.getUserTasks(),
  staleTime: 5 * 60 * 1000,
  });
}

export function useTasksByProject(projectId: number) {
  return useQuery({
    queryKey: taskQueryKeys.byProject(projectId),
    queryFn: () => taskService.getTasksByProject(projectId),
    enabled: !!projectId,
  staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: Task }) =>
      taskService.updateTask(id, task),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });
}

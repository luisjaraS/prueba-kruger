import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/projects';
import { Project } from '@/types';

// Query keys para React Query
export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...projectQueryKeys.lists(), { filters }] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...projectQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener todos los proyectos del usuario
 */
export function useProjects() {
  return useQuery({
    queryKey: projectQueryKeys.lists(),
    queryFn: () => projectService.getUserProjects(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para crear un nuevo proyecto
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: Project) => projectService.createProject(project),
    onSuccess: () => {
      // Invalidar la cache de proyectos para refrescar la lista
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.lists(),
      });
    },
  });
}

/**
 * Hook para actualizar un proyecto
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, project }: { id: number; project: Project }) =>
      projectService.updateProject(id, project),
    onSuccess: (data, variables) => {
      // Invalidar tanto la lista como el detalle específico
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Hook para eliminar un proyecto
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: () => {
      // Invalidar la cache de proyectos
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.lists(),
      });
    },
  });
}

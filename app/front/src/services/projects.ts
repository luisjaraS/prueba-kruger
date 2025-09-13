import { apiClient } from '@/lib/api-client';
import { ProjectResponse, Project } from '@/types';

class ProjectService {
  private baseUrl = '/projects';

  async getUserProjects(): Promise<ProjectResponse[]> {
    try {
      const response = await apiClient.get<ProjectResponse[]>(this.baseUrl);
      return response;
    } catch (error: any) {
      console.error('Error obteniendo proyectos:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener proyectos'
      );
    }
  }

  async createProject(project: Project): Promise<ProjectResponse> {
    try {
      const response = await apiClient.post<ProjectResponse>(
        this.baseUrl,
        project
      );
      return response;
    } catch (error: any) {
      console.error('Error creando proyecto:', error);
      throw new Error(
        error.response?.data?.message || 'Error al crear proyecto'
      );
    }
  }

  async updateProject(id: number, project: Project): Promise<ProjectResponse> {
    try {
      const response = await apiClient.put<ProjectResponse>(
        `${this.baseUrl}/${id}`,
        project
      );
      return response;
    } catch (error: any) {
      console.error('Error actualizando proyecto:', error);
      throw new Error(
        error.response?.data?.message || 'Error al actualizar proyecto'
      );
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('Error eliminando proyecto:', error);
      throw new Error(
        error.response?.data?.message || 'Error al eliminar proyecto'
      );
    }
  }
}

export const projectService = new ProjectService();
export { ProjectService };

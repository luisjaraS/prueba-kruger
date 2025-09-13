import { apiClient } from '@/lib/api-client';
import { TaskResponse, Task } from '@/types';

class TaskService {
  private baseUrl = '/tasks';

  /**
   * Obtiene todas las tareas del usuario autenticado
   */
  async getUserTasks(): Promise<TaskResponse[]> {
    try {
      const response = await apiClient.get<TaskResponse[]>(this.baseUrl);
      return response;
    } catch (error: any) {
      console.error('Error obteniendo tareas:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener tareas'
      );
    }
  }

  /**
   * Obtiene las tareas de un proyecto específico
   */
  async getTasksByProject(projectId: number): Promise<TaskResponse[]> {
    try {
      const response = await apiClient.get<TaskResponse[]>(
        `${this.baseUrl}/project/${projectId}`
      );
      return response;
    } catch (error: any) {
      console.error('Error obteniendo tareas del proyecto:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener tareas del proyecto'
      );
    }
  }

  /**
   * Crea una nueva tarea
   */
  async createTask(task: Task): Promise<TaskResponse> {
    try {
      const response = await apiClient.post<TaskResponse>(this.baseUrl, task);
      return response;
    } catch (error: any) {
      console.error('Error creando tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al crear tarea');
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id: number, task: Task): Promise<TaskResponse> {
    try {
      const response = await apiClient.put<TaskResponse>(
        `${this.baseUrl}/${id}`,
        task
      );
      return response;
    } catch (error: any) {
      console.error('Error actualizando tarea:', error);
      throw new Error(
        error.response?.data?.message || 'Error al actualizar tarea'
      );
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('Error eliminando tarea:', error);
      throw new Error(
        error.response?.data?.message || 'Error al eliminar tarea'
      );
    }
  }
}

export const taskService = new TaskService();
export { TaskService };

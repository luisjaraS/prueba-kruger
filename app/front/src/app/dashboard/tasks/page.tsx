'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Calendar, User, Folder, Clock as ClockIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';
import { Card } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { TaskResponse, Task } from '@/types';

import { TaskState } from '@/types';

interface TaskFormData {
  title: string;
  description: string;
  taskState: TaskState;
  dueDate?: string;
  projectId?: number | '';
  assignedTo?: string;
}

export default function TasksPage() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects } = useProjects();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    taskState: 'PENDIENTE',
    dueDate: '',
    projectId: '',
    assignedTo: user?.username,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading(editingTask ? 'Actualizando tarea...' : 'Creando tarea...');
    try {
      if (!formData.projectId || !user?.username) {
        toast.error('Debes seleccionar un proyecto y estar autenticado para crear una tarea.');
        return;
      }
      const taskData: Partial<Task> = {
        title: formData.title,
        description: formData.description,
        taskState: formData.taskState,
        dueDate: formData.dueDate || undefined,
        projectId: formData.projectId,
        assignedTo: user.username,
      };

      if (editingTask?.id) {
        await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          task: taskData as Task,
        });
        toast.success('Tarea actualizada');
      } else {
        await createTaskMutation.mutateAsync(taskData as Task);
        toast.success('Tarea creada');
      }

      resetForm();
    } catch (error) {
      toast.error('Error guardando tarea');
      console.error('Error guardando tarea:', error);
    } finally {
      toast.dismiss();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      taskState: 'PENDIENTE',
      dueDate: '',
      projectId: '',
      assignedTo: user?.username,
    });
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task | TaskResponse) => {
    const projectId = (task as any).projectId || (task as any).project?.id || '';
    const taskData: Task = {
      id: task.id,
      title: task.title,
      description: task.description,
      taskState: (task as any).taskState || 'PENDIENTE',
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      assignedTo: (task as any).assignedTo,
      projectId,
      project: (task as Task).project,
    };

    setEditingTask(taskData);
    setFormData({
      title: taskData.title,
      description: taskData.description || '',
      taskState: taskData.taskState,
      dueDate: taskData.dueDate
        ? new Date(taskData.dueDate).toISOString().split('T')[0]
        : '',
      projectId: projectId,
      assignedTo: taskData.assignedTo,
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } catch (error) {
        console.error('Error eliminando tarea:', error);
      }
    }
  };

  const handleInputChange = (
    field: keyof TaskFormData,
    value: string | number | ''
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTaskStateBadge = (taskState: string) => {
    switch (taskState) {
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800';
      case 'EN_PROGRESO':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTaskStateText = (taskState: string) => {
    switch (taskState) {
      case 'COMPLETADA':
        return 'Completada';
      case 'EN_PROGRESO':
        return 'En Progreso';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Tareas</h1>
          <p className="text-[var(--foreground)]/80">Gestiona todas tus tareas</p>
        </div>
        <Button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? 'Cancelar' : 'Nueva Tarea'}
        </Button>
      </div>

      {showForm && (
  <Card className="p-6 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Título*
                </label>
                <Input
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Título de la tarea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Estado de la tarea
                </label>
                <select
                  value={formData.taskState}
                  onChange={e =>
                    handleInputChange(
                      'taskState',
                      e.target.value as TaskState
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROGRESO">En Progreso</option>
                  <option value="COMPLETADA">Completada</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Descripción*
              </label>
              <textarea
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder="Descripción de la tarea"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Fecha de vencimiento
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => handleInputChange('dueDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Proyecto
                </label>
                <select
                  value={formData.projectId || ''}
                  onChange={e =>
                    handleInputChange(
                      'projectId',
                      e.target.value ? Number(e.target.value) : ''
                    )
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un proyecto</option>
                  {projects?.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createTaskMutation.isPending || updateTaskMutation.isPending
                }
              >
                {createTaskMutation.isPending || updateTaskMutation.isPending
                  ? editingTask
                    ? 'Actualizando...'
                    : 'Creando...'
                  : editingTask
                    ? 'Actualizar Tarea'
                    : 'Crear Tarea'}
              </Button>
            </div>
          </form>
        </Card>
      )}

  <Card className="p-6 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-4">Todas las Tareas</h2>

        {tasksLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks && tasks.length > 0 ? (
              tasks.map((task: TaskResponse) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {task.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskStateBadge((task as any).taskState)}`}
                        >
                          {getTaskStateText((task as any).taskState)}
                        </span>
                      </div>

                      <p className="text-[var(--foreground)]/80 mb-2">{task.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-[var(--foreground)]/60">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 inline-block" /> Vence:{' '}
                            {new Date(task.dueDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {task.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4 inline-block" /> Asignado a: {task.assignedTo}
                          </span>
                        )}
                        {task.projectId && projects && (
                          <span className="flex items-center gap-1">
                            <Folder className="w-4 h-4 inline-block" /> Proyecto:{' '}
                            {projects.find((p) => p.id === task.projectId)?.name || `ID: ${task.projectId}`}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4 inline-block" /> Creado:{' '}
                          {new Date(task.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        disabled={deleteTaskMutation.isPending}
                      >
                        {deleteTaskMutation.isPending
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[var(--foreground)]/60 text-lg">No hay tareas</p>
                <p className="text-[var(--foreground)]/40">
                  Crea tu primera tarea para comenzar
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

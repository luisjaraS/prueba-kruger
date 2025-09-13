'use client';

import { useParams } from 'next/navigation';
import { useProjects } from '@/hooks/use-projects';
import { useTasksByProject } from '@/hooks/use-tasks';
import { CheckCircle, Clock, Play, AlertCircle } from 'lucide-react';

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = Number(params.id);

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks = [], isLoading: tasksLoading } =
    useTasksByProject(projectId);

  const project = projects?.find(p => p.id === projectId);

  if (projectsLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-[var(--card-border)]/30 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-[var(--card-border)]/30 rounded animate-pulse" />
          <div className="h-24 bg-[var(--card-border)]/30 rounded animate-pulse" />
          <div className="h-24 bg-[var(--card-border)]/30 rounded animate-pulse" />
        </div>
        <div className="h-64 bg-[var(--card-border)]/30 rounded animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--foreground)]/50">Proyecto no encontrado</p>
      </div>
    );
  }

  // Permitir estados en inglés y español
  const isDone = (status: string) => status === 'DONE' || status === 'COMPLETADA';
  const isInProgress = (status: string) => status === 'IN_PROGRESS' || status === 'EN_PROGRESO';
  const isPending = (status: string) => status === 'PENDING' || status === 'PENDIENTE';

  const completedTasks = tasks.filter(task => isDone(task.status)).length;
  const inProgressTasks = tasks.filter(task => isInProgress(task.status)).length;

  const getStatusBadge = (status: string) => {
    const baseClasses =
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    if (isDone(status)) return `${baseClasses} bg-green-700/30 text-green-300`;
    if (isInProgress(status)) return `${baseClasses} bg-blue-700/30 text-blue-300`;
    if (isPending(status)) return `${baseClasses} bg-yellow-700/30 text-yellow-200`;
    return `${baseClasses} bg-[var(--card-border)]/30 text-[var(--foreground)]/70`;
  };

  const getStatusIcon = (status: string) => {
    if (isDone(status)) return <CheckCircle className="h-3 w-3 mr-1" />;
    if (isInProgress(status)) return <Play className="h-3 w-3 mr-1" />;
    if (isPending(status)) return <Clock className="h-3 w-3 mr-1" />;
    return null;
  };

  const getStatusText = (status: string) => {
    if (isDone(status)) return 'Completada';
    if (isInProgress(status)) return 'En Progreso';
    if (isPending(status)) return 'Pendiente';
    return status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {project.name}
        </h1>
        <p className="text-[var(--foreground)]/60 mt-2">{project.description}</p>
      </div>

      {/* Estadísticas de las tareas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border border-[var(--card-border)]/60 shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-[var(--primary)]/80" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--foreground)]/60 truncate">
                    Total de Tareas
                  </dt>
                  <dd className="text-lg font-medium text-[var(--foreground)]">
                    {tasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border border-[var(--card-border)]/60 shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400/80" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--foreground)]/60 truncate">
                    Completadas
                  </dt>
                  <dd className="text-lg font-medium text-[var(--foreground)]">
                    {completedTasks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border border-[var(--card-border)]/60 shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Play className="h-6 w-6 text-blue-400/80" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--foreground)]/60 truncate">
                    En Progreso
                  </dt>
                  <dd className="text-lg font-medium text-[var(--foreground)]">
                    {inProgressTasks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border border-[var(--card-border)]/60 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">
            Lista de Tareas
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-[var(--foreground)]/60">
            Tareas asignadas a este proyecto
          </p>
        </div>
        <div className="border-t border-[var(--card-border)]/40">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--foreground)]/50">No hay tareas para este proyecto</p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--card-border)]/30">
              {tasks.map(task => (
                <li key={task.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[var(--foreground)]">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-[var(--foreground)]/60 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={getStatusBadge(task.taskState)}>
                          {getStatusIcon(task.taskState)}
                          {getStatusText(task.taskState)}
                        </span>
                        <span className="text-xs text-[var(--foreground)]/50">
                          Asignado a: {task.assignedTo}
                        </span>
                      </div>
                      {task.dueDate && (
                        <p className="text-xs text-[var(--foreground)]/40 mt-1">
                          Fecha límite:{' '}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

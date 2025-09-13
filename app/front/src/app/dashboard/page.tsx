'use client';

import { useTasks } from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';
import { Card } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  // Estadísticas calculadas
  const taskStats = {
    total: tasks?.length || 0,
    pending: tasks?.filter(task => task.taskState === 'PENDIENTE').length || 0,
    inProgress:
      tasks?.filter(task => task.taskState === 'EN_PROGRESO').length || 0,
    completed: tasks?.filter(task => task.taskState === 'COMPLETADA').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[var(--foreground)]/80">Resumen de tus proyectos y tareas</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/dashboard/tasks">
            <Button variant="outline">Ver Tareas</Button>
          </Link>
          <Link href="/dashboard/projects">
            <Button>Ver Proyectos</Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-lg border-0 shadow-lg backdrop-blur-sm bg-gradient-to-br from-[#232a4d] via-[#23232b] to-[var(--background)]">
          <div className="flex items-center">
            <div className="p-2 bg-blue-900/60 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--foreground)]/80">Total Tareas</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {tasksLoading ? '...' : taskStats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-lg border-0 shadow-lg backdrop-blur-sm bg-gradient-to-br from-[#4d4423] via-[#23232b] to-[var(--background)]">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-900/60 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--foreground)]/80">Pendientes</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {tasksLoading ? '...' : taskStats.pending}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-lg border-0 shadow-lg backdrop-blur-sm bg-gradient-to-br from-[#4d2c23] via-[#23232b] to-[var(--background)]">
          <div className="flex items-center">
            <div className="p-2 bg-orange-900/60 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--foreground)]/80">En Progreso</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {tasksLoading ? '...' : taskStats.inProgress}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-lg border-0 shadow-lg backdrop-blur-sm bg-gradient-to-br from-[#234d23] via-[#23232b] to-[var(--background)]">
          <div className="flex items-center">
            <div className="p-2 bg-green-900/60 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--foreground)]/80">Completadas</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {tasksLoading ? '...' : taskStats.completed}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tasks and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="p-6 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Tareas Recientes
            </h2>
            <Link href="/dashboard/tasks">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>

          {tasksLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks?.slice(0, 5).map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm bg-[var(--card-bg)]/90 bg-gradient-to-br from-[var(--card-bg)] via-[var(--card-bg)] to-[var(--background)]"
                >
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{task.title}</p>
                    <p className="text-sm text-[var(--foreground)]/80 truncate">
                      {task.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${task.taskState === 'COMPLETADA'
                        ? 'bg-green-100 text-green-800'
                        : task.taskState === 'EN_PROGRESO'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {task.taskState === 'COMPLETADA'
                      ? 'Completada'
                      : task.taskState === 'EN_PROGRESO'
                        ? 'En Progreso'
                        : 'Pendiente'}
                  </span>
                </div>
              )) || (
                  <p className="text-[var(--foreground)]/60 text-center py-4">No hay tareas</p>
                )}
            </div>
          )}
        </Card>

        {/* Recent Projects */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Proyectos Recientes
            </h2>
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>

          {projectsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {projects?.slice(0, 5).map(project => (
                <div key={project.id} className="p-3 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm bg-[var(--card-bg)]/90 bg-gradient-to-br from-[var(--card-bg)] via-[var(--card-bg)] to-[var(--background)]">
                  <p className="font-medium text-[var(--foreground)]">{project.name}</p>
                  <p className="text-sm text-[var(--foreground)]/80 truncate">
                    {project.description}
                  </p>
                  <p className="text-xs text-[var(--foreground)]/60 mt-1">
                    Por: {project.ownerUsername}
                  </p>
                </div>
              )) || (
                  <p className="text-[var(--foreground)]/60 text-center py-4">
                    No hay proyectos
                  </p>
                )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useAuth, useLogout } from '@/hooks/use-auth';
import { Button } from '@/components/primitives/button';
import { useProjects } from '@/hooks/use-projects';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const { data: projects } = useProjects();
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--foreground)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--foreground)]">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <aside className="w-64 hidden md:flex flex-col h-screen bg-[var(--card-bg)]/80 border-r border-[var(--card-border)] backdrop-blur-lg">
        <div className="flex items-center h-16 px-6 border-b border-[var(--card-border)]">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Task Manager</span>
        </div>
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <span className="block px-3 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--primary)]/10 transition">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/projects">
                <span className="block px-3 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--primary)]/10 transition">Proyectos</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/tasks">
                <span className="block px-3 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--primary)]/10 transition">Tareas</span>
              </Link>
            </li>
            <li className="mt-6">
              <span className="block px-3 py-2 text-xs font-semibold text-[var(--foreground)]/60 uppercase tracking-wider">Tus Proyectos</span>
              <ul className="space-y-1 mt-2">
                {projects?.map((project) => (
                  <li key={project.id}>
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--primary)]/10 transition ${openProjectId === project.id ? 'bg-[var(--primary)]/10' : ''}`}
                      onClick={() => setOpenProjectId(openProjectId === project.id ? null : project.id)}
                    >
                      <span className="truncate">{project.name}</span>
                      <svg className={`w-4 h-4 ml-2 transition-transform ${openProjectId === project.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {openProjectId === project.id && (
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>
                          <Link href={`/dashboard/projects/${project.id}/tasks`} className="block px-3 py-1 rounded text-[var(--foreground)]/80 hover:bg-[var(--primary)]/20 text-sm">Ver tareas</Link>
                        </li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-[var(--card-border)]">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--foreground)]">{user?.username || 'Usuario'}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 w-full h-16 bg-[var(--card-bg)]/70 border-b border-[var(--card-border)] backdrop-blur-lg flex items-center px-4 md:px-8 shadow-sm">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-[var(--foreground)]">Panel</span>
            </div>
            <div className="md:hidden">
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

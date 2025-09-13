'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/use-projects';
import { Card } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { ProjectResponse, Project } from '@/types';

interface ProjectFormData {
  name: string;
  description: string;
}

export default function ProjectsPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading(editingProject ? 'Actualizando proyecto...' : 'Creando proyecto...');
    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
      };

      if (editingProject?.id) {
        await updateProjectMutation.mutateAsync({
          id: editingProject.id,
          project: projectData as Project,
        });
        toast.success('Proyecto actualizado');
      } else {
        await createProjectMutation.mutateAsync(projectData);
        toast.success('Proyecto creado');
      }

      resetForm();
    } catch (error) {
      toast.error('Error guardando proyecto');
      console.error('Error guardando proyecto:', error);
    } finally {
      toast.dismiss();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project: Project | ProjectResponse) => {
    const projectData: Project = {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      owner:
        'ownerUsername' in project
          ? ({ username: project.ownerUsername } as any)
          : (project as Project).owner,
    };

    setEditingProject(projectData);
    setFormData({
      name: projectData.name,
      description: projectData.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (projectId: number) => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres eliminar este proyecto? Esto también eliminará todas las tareas asociadas.'
      )
    ) {
      try {
        await deleteProjectMutation.mutateAsync(projectId);
      } catch (error) {
        console.error('Error eliminando proyecto:', error);
      }
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Proyectos</h1>
          <p className="text-[var(--foreground)]/80">Gestiona todos tus proyectos</p>
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
          {showForm ? 'Cancelar' : 'Nuevo Proyecto'}
        </Button>
      </div>

      {showForm && (
  <Card className="p-6 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Nombre del Proyecto*
              </label>
              <Input
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Nombre del proyecto"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Descripción*
              </label>
              <textarea
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder="Descripción del proyecto"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createProjectMutation.isPending ||
                  updateProjectMutation.isPending
                }
              >
                {createProjectMutation.isPending ||
                updateProjectMutation.isPending
                  ? editingProject
                    ? 'Actualizando...'
                    : 'Creando...'
                  : editingProject
                    ? 'Actualizar Proyecto'
                    : 'Crear Proyecto'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg backdrop-blur-sm">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))
        ) : projects && projects.length > 0 ? (
          projects.map((project: ProjectResponse) => (
            <Card
              key={project.id}
              className="p-6 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] line-clamp-2">
                      {project.name}
                    </h3>
                  </div>

                  <p className="text-[var(--foreground)]/80 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-[var(--foreground)]/60">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {project.ownerUsername}
                    </span>
                  </div>

                  <div className="text-xs text-[var(--foreground)]/60">
                    <span className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Creado:{' '}
                      {new Date(project.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/dashboard/projects/${project.id}/tasks`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Tareas
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteProjectMutation.isPending}
                    >
                      {deleteProjectMutation.isPending
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="p-12 bg-gradient-to-br from-[#181c2b] via-[#23232b] to-[var(--background)] border-0 shadow-lg backdrop-blur-sm">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-[var(--foreground)]/30 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                  No hay proyectos
                </h3>
                <p className="text-[var(--foreground)]/60 mb-4">
                  Crea tu primer proyecto para comenzar a organizar tus tareas
                </p>
                <Button onClick={() => setShowForm(true)}>
                  Crear Primer Proyecto
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

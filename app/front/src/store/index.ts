import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User } from '@/types';

// Estado de la aplicación
interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Store de autenticación
export const useAuthStore = create<AppState>()(
  devtools(
    persist(
      immer(set => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        login: (user: User, token: string) => {
          set(state => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        },

        logout: () => {
          set(state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });
        },

        setLoading: (loading: boolean) => {
          set(state => {
            state.isLoading = loading;
          });
        },
      })),
      {
        name: 'auth-storage',
        partialize: state => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Interfaces para otros stores
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
  updatedAt: string;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Store de tareas
export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      immer(set => ({
        tasks: [],
        isLoading: false,
        error: null,

        addTask: task => {
          set(state => {
            const newTask = {
              ...task,
              id: Date.now().toString(),
            };
            state.tasks.push(newTask);
          });
        },

        updateTask: (id, updates) => {
          set(state => {
            const taskIndex = state.tasks.findIndex(t => t.id === id);
            if (taskIndex !== -1) {
              state.tasks[taskIndex] = {
                ...state.tasks[taskIndex],
                ...updates,
              };
            }
          });
        },

        deleteTask: id => {
          set(state => {
            state.tasks = state.tasks.filter(t => t.id !== id);
          });
        },

        setTasks: tasks => {
          set(state => {
            state.tasks = tasks;
          });
        },

        setLoading: loading => {
          set(state => {
            state.isLoading = loading;
          });
        },

        setError: error => {
          set(state => {
            state.error = error;
          });
        },
      })),
      {
        name: 'task-storage',
        partialize: state => ({
          tasks: state.tasks,
        }),
      }
    ),
    {
      name: 'task-store',
    }
  )
);

interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Store de proyectos
export const useProjectStore = create<ProjectStore>()(
  devtools(
    persist(
      immer(set => ({
        projects: [],
        isLoading: false,
        error: null,

        setProjects: projects => {
          set(state => {
            state.projects = projects;
          });
        },

        setLoading: loading => {
          set(state => {
            state.isLoading = loading;
          });
        },

        setError: error => {
          set(state => {
            state.error = error;
          });
        },
      })),
      {
        name: 'project-storage',
        partialize: state => ({
          projects: state.projects,
        }),
      }
    ),
    {
      name: 'project-store',
    }
  )
);

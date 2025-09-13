// Tipos base para la aplicación
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para el usuario
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
}

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para formularios
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
}

// Tipos para tablas
export interface TableColumn<T = any> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sorting?: {
    field: keyof T;
    direction: 'asc' | 'desc';
    onSort: (field: keyof T) => void;
  };
  filtering?: {
    filters: Record<string, any>;
    onFilterChange: (filters: Record<string, any>) => void;
  };
  selection?: {
    selectedRows: T[];
    onSelectionChange: (rows: T[]) => void;
  };
}

// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Tipos para notificaciones
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Tipos para componentes primitivos
export interface ButtonVariants {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
}

export interface InputVariants {
  variant: 'default' | 'outline' | 'filled';
  size: 'sm' | 'md' | 'lg';
}

// Tipos específicos de la API según OpenAPI

// Tipos para proyectos
export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  ownerUsername: string;
}

export interface Project {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  owner?: User;
}

// Tipos para tareas

export type TaskState = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE'; // borrado lógico
  taskState: TaskState;
  dueDate: string;
  createdAt: string;
  assignedTo: number;
  projectId: number;
}


export interface Task {
  id?: number;
  title: string;
  description: string;
  status?: 'ACTIVE' | 'INACTIVE'; // borrado lógico
  taskState: TaskState;
  dueDate?: string;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  assignedTo?: string;
  projectId?: number;
  project?: Project;
}

// Tipos para usuarios de la API
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

// Tipos para hooks
export interface UseApiOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number | boolean;
  staleTime?: number;
  cacheTime?: number;
}

export interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onSettled?: () => void;
}

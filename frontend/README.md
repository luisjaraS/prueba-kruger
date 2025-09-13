# Julio Dender Prueba Kruger App - Next.js 13+ Architecture

Una aplicación Next.js moderna con arquitectura modular, componentes primitivos reutilizables y manejo de estado avanzado.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 13+ con App Router
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS + class-variance-authority
- **Estado**: Zustand con persistencia
- **Formularios**: React Hook Form + Zod
- **Datos**: React Query + Axios
- **Tablas**: TanStack Table
- **Calidad**: ESLint + Prettier

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 13+
├── components/
│   ├── primitives/         # Componentes base (Button, Input, Card)
│   ├── commons/           # Componentes compuestos (DataTable, Layout)
│   └── forms/             # Componentes de formularios
├── lib/                   # Utilidades y configuraciones
├── hooks/                 # Hooks personalizados
├── services/              # Servicios de API
├── store/                 # Manejo de estado con Zustand
└── types/                 # Definiciones TypeScript
```

## 🛠️ Instalación y Configuración

1. **Clonar e instalar dependencias:**

```bash
npm install
```

2. **Ejecutar en modo desarrollo:**

```bash
npm run dev
```

3. **Construir para producción:**

```bash
npm run build
npm start
```

## 🏗️ Arquitectura de Componentes

### Primitivos

Los componentes primitivos son la base reutilizable del sistema:

- **Button**: Variantes (primary, secondary, outline, ghost, danger) y tamaños
- **Input**: Estados de error, variantes de estilo
- **Card**: Composición modular para contenedores

### Commons

Componentes compuestos que combinan primitivos:

- **DataTable**: Tabla completa con paginación, filtros y ordenamiento
- **Form**: Wrapper para React Hook Form con validación

### Forms

Sistema de formularios con validación robusta:

- Integración React Hook Form + Zod
- Manejo automático de errores
- Componentes reutilizables para campos

## 🔄 Manejo de Estado

### Zustand Store

```typescript
// Autenticación
const { user, login, logout } = useAuthStore();

// Estado de la aplicación
const { theme, toggleTheme, notifications } = useAppStore();
```

### React Query

```typescript
// Queries con cache inteligente
const { data, isLoading } = useApiQuery(['users'], '/api/users');

// Mutaciones con invalidación automática
const createUser = useCreateMutation('/api/users');
```

## 🌐 Cliente API

### Configuración Axios

- Interceptors automáticos para autenticación
- Manejo centralizado de errores
- Instancia singleton configurable

```typescript
// Uso básico
const data = await apiClient.get('/endpoint');
const result = await apiClient.post('/endpoint', payload);

// Con tipos
const users = await apiClient.get<User[]>('/users');
```

## 📋 Formularios

### Esquema de validación con Zod

```typescript
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
});
```

### Implementación del formulario

```typescript
<Form schema={userSchema} onSubmit={handleSubmit}>
  <FormField
    name="name"
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>Nombre</FormLabel>
        <FormControl>
          <Input {...field} error={!!fieldState.error} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

## 📊 Tablas de Datos

### TanStack Table integrado

- Paginación automática
- Ordenamiento por columnas
- Filtros en tiempo real
- Selección de filas

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => <CustomCell data={row.original} />
  }
];

<DataTable
  columns={columns}
  data={users}
  searchKey="name"
  onRowClick={handleRowClick}
/>
```

## 🎨 Sistema de Estilos

### TailwindCSS + CVA

```typescript
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-100 text-gray-900',
    },
    size: {
      sm: 'h-8 px-3',
      md: 'h-9 px-4',
    },
  },
});
```

## 🔐 Autenticación

### Sistema completo implementado

- Login/Logout con JWT
- Persistencia automática
- Interceptors para renovación de tokens
- Protección de rutas

```typescript
// Hooks de autenticación
const { login, isLoading } = useLogin();
const { logout } = useLogout();
const { user, isAuthenticated } = useAuth();
```

## 🧪 Desarrollo y Testing

### Scripts disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
npm run lint         # Linting
npm run lint:fix     # Fix automático
```

### Configuración de calidad

- ESLint con reglas personalizadas
- Prettier para formateo automático
- TypeScript estricto
- Husky para pre-commit hooks (opcional)

## 🚀 Deploy

La aplicación está optimizada para deploy en:

- Vercel (recomendado)
- Netlify
- Docker
- Servidores VPS

## 📖 Ejemplos de Uso

Revisa la página principal (`src/app/page.tsx`) para ver ejemplos completos de:

- Formularios con validación
- Tablas interactivas
- Componentes primitivos
- Manejo de estado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Sigue las convenciones de código establecidas
4. Ejecuta linting antes de commit
5. Crea un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

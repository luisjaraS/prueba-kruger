# Despliegue del Aplicativo Fullstack (Backend + Frontend)

## Despliegue con Docker y Docker Compose

Puedes levantar toda la aplicación (base de datos, backend y frontend) fácilmente usando Docker Compose.

### 1. Requisitos

- Docker y Docker Compose instalados

### 2. Comando único para levantar todo

Desde la raíz del proyecto, ejecuta:

```sh
docker-compose up --build
```

Esto construirá y levantará automáticamente los tres servicios:

- **db**: Base de datos PostgreSQL (con script de inicialización)
- **back**: Backend Spring Boot (Java 17)
- **front**: Frontend Next.js (Node 18)

### 3. Servicios y puertos

| Servicio | URL/Host         | Puerto local |
|----------|------------------|--------------|
| db       | localhost        | 5432         |
| backend  | localhost        | 9180         |
| frontend | localhost        | 3000         |


### 4. Apagar los servicios

Para detener y eliminar los contenedores:

```sh
docker-compose down
```
---

## Despliegue manual (sin Docker)

Si prefieres levantar los servicios manualmente:

### Base de datos

1. Instala PostgreSQL desde https://www.postgresql.org/download/ según tu sistema operativo.
2. Asegúrate de que el servicio esté corriendo y puedas acceder con un usuario administrador (por ejemplo, `postgres`).
3. Usa el archivo `db/init.sql` para crear la base de datos, tablas y datos iniciales. Puedes ejecutarlo así:
   ```sh
   psql -U postgres -f db/init.sql
   ```
   (Ajusta el usuario si es necesario)


### Backend
1. Abre una terminal y navega a la carpeta `back`.
2. Ejecuta:
   ```sh
   ./mvnw spring-boot:run
   ```
   o si tienes Maven instalado globalmente:
   ```sh
   mvn spring-boot:run
   ```

### Frontend
1. Abre otra terminal y navega a la carpeta `front`.
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Inicia la aplicación:
   ```sh
   npm run dev
   ```

La aplicación estará disponible en http://localhost:3000 y la API en http://localhost:9180

## 5. Acceso a la Aplicación

- Frontend: http://localhost:3000
- Backend (API): http://localhost:9180

## 6. Credenciales para prueba

- Email: prueba@sasf.net
- Contaseña: prueba

---
¿Dudas? Consulta la documentación oficial de Spring Boot, SQL Server y Node.js.

# Despliegue del Aplicativo Fullstack (Backend + Frontend)

## 1. Requisitos Previos

- Java 17
- Node.js 18+
- Acceso a una instancia de SQL Server (puede ser local o en otro servidor)

## 2. Levantar SQL Server Manualmente

Puedes instalar SQL Server de forma local o usar una instancia existente en red o en la nube.

1. Descarga e instala SQL Server Express o Developer desde el sitio oficial de Microsoft.
2. Asegúrate de que el servicio esté iniciado y escuchando en el puerto 1433.
3. Crea la base de datos que usará la aplicación.

## 3. Configuración del Backend para SQL Server

Edita el archivo `backend/src/main/resources/application.properties` con los siguientes valores (ajusta host, usuario y contraseña según tu entorno):

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=nombre_de_tu_db
spring.datasource.username=tu usuario
spring.datasource.password=tu contraseña
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 4. Levantar el Backend y Frontend Manualmente

### Backend

1. Abre una terminal y navega a la carpeta `backend`.
2. Ejecuta:
	```sh
	./mvnw spring-boot:run
	```
	o si tienes Maven instalado globalmente:
	```sh
	mvn spring-boot:run
	```

### Frontend

1. Abre otra terminal y navega a la carpeta `frontend`.
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


## 7. Notas para despliegue en otras máquinas

- Asegúrate de que la máquina destino tenga acceso a SQL Server (puerto 1433 abierto y accesible).
- Si SQL Server está en otra máquina, cambia `localhost` por la IP o hostname correspondiente en la configuración.

---
¿Dudas? Consulta la documentación oficial de Spring Boot, SQL Server y Node.js.

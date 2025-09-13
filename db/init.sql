-- Crear base de datos si no existe
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kdevfulldb') THEN
      CREATE DATABASE kdevfulldb;
   END IF;
END
$$;


\c kdevfulldb;

-- Tabla users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    created_by VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255) CHECK (role IN ('USER', 'ADMIN')),
    updated_by VARCHAR(255),
    username VARCHAR(255)
);

-- Tabla project
CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP,
    owner_id BIGINT REFERENCES users(id),
    created_by VARCHAR(255),
    description VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    updated_by VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

-- Tabla task
CREATE TABLE task (
    id BIGSERIAL PRIMARY KEY,
    due_date DATE,
    assigned_to_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP,
    project_id BIGINT REFERENCES project(id),
    created_by VARCHAR(255),
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    task_state VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (task_state IN ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA')),
    title VARCHAR(100) NOT NULL,
    updated_by VARCHAR(255)
);

-- Insert inicial
INSERT INTO users (created_by, email, password, role, updated_by, username)
VALUES ('ADM', 'prueba@sasf.net', '$2a$10$LHDwwz3Ix83xB.0pm7gfIeIoDjwBO2GUwud/RO6smdzfw/SA0V8Eu', 'ADMIN', '', 'prueba');

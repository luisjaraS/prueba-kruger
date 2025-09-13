-- Tabla USERS
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    created_by VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255) CHECK (role IN ('USER', 'ADMIN')),
    updated_by VARCHAR(255),
    username VARCHAR(255)
);

CREATE TABLE project (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    created_at DATETIME2,
    owner_id BIGINT,
    created_by VARCHAR(255),
    description VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    updated_by VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE task (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    due_date DATE,
    assigned_to_id BIGINT,
    created_at DATETIME2,
    project_id BIGINT,
    created_by VARCHAR(255),
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    task_state VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (task_state IN ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA')),
    title VARCHAR(100) NOT NULL,
    updated_by VARCHAR(255),
    CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to_id) REFERENCES users(id),
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES project(id)
);

-- Insert inicial
INSERT INTO users (
    created_by,
    email,
    password,
    role,
    updated_by,
    username
) VALUES (
    'ADM',
    'prueba@sasf.net',
    '$2a$10$LHDwwz3Ix83xB.0pm7gfIeIoDjwBO2GUwud/RO6smdzfw/SA0V8Eu',
    'ADMIN',
    '',
    'prueba'
);


CREATE DATABASE IF NOT EXISTS peluqueria_db;
USE peluqueria_db;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(10) UNIQUE,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20) UNIQUE,
    fecha_nac DATE,
    direccion TEXT,
    estado_civil VARCHAR(30),
    sexo VARCHAR(30),
    email VARCHAR(100) UNIQUE,
    enfermedades_capi TEXT,
    alergias TEXT,
    preferencias_prod TEXT
);

CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    num_lote VARCHAR(50),
    fecha_caducidad DATE,
    tipo VARCHAR(50),
    stock_min INT
);

CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    cantidad INT,
    fecha_ingreso DATE,
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

CREATE TABLE cita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id VARCHAR(10),
    fecha DATE,
    hora TIME,
    servicio VARCHAR(100),
    observaciones TEXT,
    FOREIGN KEY (cliente_id) REFERENCES cliente(cedula)
);

CREATE TABLE factura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id VARCHAR(10),
    fecha DATE,
    total DECIMAL(10,2),
    FOREIGN KEY (cliente_id) REFERENCES cliente(cedula)
);

CREATE TABLE factura_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factura_id INT,
    tipo VARCHAR(20), -- 'PRODUCTO' o 'SERVICIO'
    descripcion VARCHAR(100),
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (factura_id) REFERENCES factura(id)
);

ALTER TABLE usuario
  ADD COLUMN username VARCHAR(50) NOT NULL UNIQUE,
  ADD COLUMN password VARCHAR(100) NOT NULL,
  ADD COLUMN rol VARCHAR(10) NOT NULL;
  
INSERT INTO usuario (username, password, rol)
    -- Contraseña:admin123
VALUES ('admin', '$2a$10$A4aB7J0giknEz8/qQItiH.4996OxKjcwQf7seXCX49pLPeKOdq73O', 'ADMIN');

CREATE DATABASE IF NOT EXISTS webCorporativa
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE webCorporativa;

DROP TABLE IF EXISTS Image;
DROP TABLE IF EXISTS New;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS User;



-- Tabla de usuarios
-- ROL (admin, editor )
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    rol ENUM('admin', 'editor') NOT NULL
);

-- Tabla de categorías
CREATE TABLE Category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Tabla de  Noticias
CREATE TABLE New (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    body VARCHAR(255) NOT NULL,
    id_category INT NOT NULL,
    id_user INT NOT NULL,
    id_image INT,  
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_category_id FOREIGN KEY (id_category) REFERENCES Category(id),
    CONSTRAINT fk_user_id FOREIGN KEY (id_user) REFERENCES User(id)
);

-- Tabla imagenes de noticias
CREATE TABLE Image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    `order` INT DEFAULT 0,
    id_new INT NOT NULL,
    CONSTRAINT fk_new_id FOREIGN KEY (id_new) REFERENCES New(id)
);

-- Taula Contactar

CREATE TABLE Contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL, 
    subject TEXT NOT NULL,
    date DATETIME NOT NULL
);
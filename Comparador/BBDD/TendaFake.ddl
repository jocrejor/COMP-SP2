
/* Taula: family
Atributs : 
- id: PK, AUTO_INCREMENT, INT, NOT NULL
- name: VARCHAR(100), NOT NULL
- image NOT NULL
- description: VARCHAR(250), NOT NULL
- parentId: FK (id), INT (te familia)
*/
CREATE TABLE Family (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(200) NOT NULL,
    description VARCHAR(250) NOT NULL,
    parentId INT,
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES Family(id)
);

/* Taula: Product */
CREATE TABLE Product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(7,2),
    description TEXT,
    family_id INT,
    FOREIGN KEY (family_id) REFERENCES Family(id)
);

/* Taula: Productimage */
CREATE TABLE Productimage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    url VARCHAR(255),
    `order` INT,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES Product(id)
);

-- Taula d'Atributs
CREATE TABLE Attribute (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Taula intermitja ProductAttribute per la relació N:N
CREATE TABLE Productattribute (
    product_id INT,
    attribute_id INT,
    value VARCHAR(255),
    PRIMARY KEY (product_id, attribute_id),
    FOREIGN KEY (product_id) REFERENCES Product(id),
    FOREIGN KEY (attribute_id) REFERENCES Attribute(id)
);


-- Taula: Rol
CREATE TABLE Rol (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Taula: User
CREATE TABLE User (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(30) NOT NULL,
    rol_id INT NOT NULL,
    CONSTRAINT fk_user_rol FOREIGN KEY (rol_id) REFERENCES Rol(id)
);


/*JSON de valors de pais- provincia - ciutat    
https://github.com/millan2993/countries/tree/master/json
*/

-- Taula: Country
CREATE TABLE Country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Taula: Province
CREATE TABLE Province (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(id) ON DELETE CASCADE
);

-- Taula: City
CREATE TABLE City (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    province_id INT NOT NULL,
    FOREIGN KEY (province_id) REFERENCES province(id) ON DELETE CASCADE
);

-- Taula: Sale
CREATE TABLE Sale (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
    coupon VARCHAR(15),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dates CHECK (end_date > start_date)
);
-- Taula: Prductsale
CREATE TABLE Productsale (
    sale_id INT PRIMARY KEY,
    product_id INT PRIMARY KEY,
    CONSTRAINT fk_sale_id FOREIGN KEY (sale_id) REFERENCES Sale(id), 
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES Product(id)
)



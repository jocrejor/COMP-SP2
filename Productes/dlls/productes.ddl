CREATE TABLE Product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(7,2),
    description TEXT,
    family_id INT,
    FOREIGN KEY (family_id) REFERENCES Family(id)
);
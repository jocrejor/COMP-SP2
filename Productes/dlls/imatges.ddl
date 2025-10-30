CREATE TABLE Image (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    url VARCHAR(255),
    `order` INT,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES Product(id)
);
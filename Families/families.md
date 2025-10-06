
# Taula: family

Atributs : 

- id: PK, AUTO_INCREMENT, INT, NOT NULL

- name: VARCHAR(100), NOT NULL

- image NOT NULL

- description: VARCHAR(100), NOT NULL

- parentId: FK (id), INT (te familia)

CREATE TABLE family (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    parentId INT,
    CONSTRAINT fk_parent FOREIGN KEY (parentId) REFERENCES family(id)
);


# MODEL DE DADES
country:
    - id: INT, PK, AUTO_INCREMENT, NOT NULL 
    - country_name: VARCHAR (100), NOT NULL

province:
    - id: INT, PK, AUTO_INCREMENT, NOT NULL
    - province_name: VARCHAR (100), NOT NULL
    - id_country: INT, FK, NOT NULL

city:
    - id: INT, PK, AUTO_INCREMENT, NOT NULL
    - city_name: VARCHAR (100), NOT NULL
    - id_province: INT, FK, NOT NULL


JSON de valors de pais- provincia - ciutat    
https://github.com/millan2993/countries/tree/master/json

# MODEL DE DADES
-- TAULA COUNTRY
CREATE TABLE country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- TAULA PROVINCE
CREATE TABLE province (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(id) ON DELETE CASCADE
);

-- TAULA CITY
CREATE TABLE city (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    province_id INT NOT NULL,
    FOREIGN KEY (province_id) REFERENCES province(id) ON DELETE CASCADE
);
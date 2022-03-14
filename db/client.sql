CREATE DATABASE IF NOT EXISTS dhr;

USE dhr;

CREATE TABLE clients (
	id INT (6) AUTO_INCREMENT,
    name VARCHAR(2000) DEFAULT NULL,
    phone_number VARCHAR(2000) DEFAULT NULL,
    zone VARCHAR(2000) DEFAULT NULL,
    adress VARCHAR(2000) DEFAULT NULL,
    email VARCHAR(2000) DEFAULT NULL,
    detail VARCHAR(2000) DEFAULT NULL,
    PRIMARY KEY (id)
);

DESCRIBE clients;

INSERT INTO clients (name, phone_number, zone, adress, email,detail)
VALUES ("Lucas", "11-2176-6315", "Villa-Bosch", "prueba", "rusmanlucas@gmail.com", "prueba");
	
SELECT * FROM clients ORDER BY id DESC;
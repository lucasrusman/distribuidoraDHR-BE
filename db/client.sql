CREATE DATABASE IF NOT EXISTS DHR;

USE DHR;

CREATE TABLE clients (
	id INT (6) AUTO_INCREMENT,
    name VARCHAR(3000) DEFAULT NULL,
    phone_number VARCHAR(3000) DEFAULT NULL,
    zone VARCHAR(3000) DEFAULT NULL,
    adress VARCHAR(3000) DEFAULT NULL,
    email VARCHAR(3000) DEFAULT NULL,
    PRIMARY KEY (id)
);

DESCRIBE clients;

INSERT INTO clients (name, phone_number, zone, adress, email)
VALUES ("Lucas", "11-2176-6315", "Villa-Bosch", "prueba", "rusmanlucas@gmail.com");
	
SELECT * FROM clients ORDER BY id DESC;
CREATE TABLE products (
	id INT (6) AUTO_INCREMENT,
    description VARCHAR(3000) DEFAULT NULL,
    price INT(6) DEFAULT NULL,
    PRIMARY KEY (id)
);

DESCRIBE products;

INSERT INTO products (description, price)
VALUES ("aaa", 1234);
	
SELECT * FROM products ORDER BY id DESC;
CREATE TABLE sales (
	id INT (6) AUTO_INCREMENT,
    name VARCHAR(3000) DEFAULT NULL,
    total INT DEFAULT NULL,
    date VARCHAR(3000) DEFAULT NULL,
    PRIMARY KEY (id)
);

DESCRIBE sales;

INSERT INTO sales (name, total, date)
VALUES ("aaa", 1234, "dmaklsd");
	
SELECT * FROM sales ORDER BY id DESC;
CREATE DATABASE produto_db;

USE produtos_db;


CREATE TABLE produtos(
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100),
preco DECIMAL(10, 2),
quantidade INT 
);
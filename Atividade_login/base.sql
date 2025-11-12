-- 1. Criar o banco de dados
CREATE DATABASE produtos_cadastro;

-- 2. Usar o banco
USE produtos_cadastro;

-- 3. Criar tabela de usuários
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

-- 4. Criar tabela de produtos
CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL
);

-- 5. Verificar se as tabelas foram criadas
SHOW TABLES;

-- 6. Ver a estrutura das tabelas


USE produtos_cadastro;
SELECT * FROM user;
SELECT * FROM produto;

SELECT * FROM user;

USE produtos_cadastro;
SELECT * FROM user;

SELECT * FROM produto;

USE produtos_cadastro;

-- Adicionar coluna user_id na tabela produto
ALTER TABLE produto ADD COLUMN user_id INT;

-- Adicionar chave estrangeira
ALTER TABLE produto ADD CONSTRAINT fk_produto_user 
FOREIGN KEY (user_id) REFERENCES user(id);

-- Verificar a alteração


USE produtos_cadastro;

-- Esta query mostra cada produto com seu respectivo usuário
SELECT 
    p.id AS 'ID Produto',
    p.nome AS 'Nome Produto', 
    p.preco AS 'Preço',
    p.quantidade AS 'Quantidade',
    u.id AS 'ID Usuário',
    u.email AS 'Email Usuário'
FROM produto p 
JOIN user u ON p.user_id = u.id
ORDER BY u.email, p.id;
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
DESCRIBE user;
DESCRIBE produto;
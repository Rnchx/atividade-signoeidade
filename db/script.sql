-- Criação da tabela de signos
CREATE TABLE signos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INTEGER NOT NULL,
    signo VARCHAR(20) NOT NULL,
    datanascimento DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    sexo VARCHAR(10) NOT NULL
);
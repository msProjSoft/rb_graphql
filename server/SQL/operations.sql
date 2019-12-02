-- Criar nova base dados
CREATE DATABASE league;

/* Criar nova tabela */
CREATE TABLE team (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT
);

CREATE TABLE player (
 id SERIAL PRIMARY KEY NOT NULL,
 first_name TEXT,
 last_name TEXT,
 team_id INT NOT NULL REFERENCES team (id)
);

CREATE TABLE match (
  id SERIAL PRIMARY KEY NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  winner_team_id INT NOT NULL REFERENCES team (id),
  loser_team_id INT NOT NULL REFERENCES team (id)
);

CREATE TABLE itemsX (
 id SERIAL PRIMARY KEY NOT NULL,
 nome TEXT NOT NULL,
 apelido TEXT,
 idade INT
);

INSERT INTO items(type, description) 
VALUES ('prefix', 'HEROKU'), ('prefix', 'KUKU'), ('prefix', 'URU'),
       ('sufix', 'hero'), ('sufix', 'HRu'), ('sufix', 'RKUN')

INSERT INTO itemsX(nome, apelido, idade) 
VALUES ('rui', 'sousa', 22), ('ana', 'Peres', 44)

DELETE FROM itemsX WHERE itemsX.idade = 44

-- Eliminar tabela
DROP TABLE IF EXISTS match CASCADE;

--- Adiconar registos
INSERT INTO team(name) VALUES ('Porto'), ('Sporting')

INSERT INTO player(first_name, last_name, team_id) 
VALUES ('Eusebio', 'Ferreira', 1), ('Yazald', 'Yac', 3), 
      ('Futre', 'Almeida', 3), ('Gomes', 'Almeida', 2)

INSERT INTO match (winner_team_id, loser_team_id)
VALUES (1,2), (1, 3)
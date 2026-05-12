CREATE DATABASE IF NOT EXISTS habitflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE habitflow;

-- Usuarios (registro/login)
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_completo VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  login VARCHAR(60) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  UNIQUE KEY uq_usuarios_login (login)
) ENGINE=InnoDB;

-- Habitos cadastrados por usuario
CREATE TABLE IF NOT EXISTS habitos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  nome VARCHAR(80) NOT NULL,
  categoria VARCHAR(30) NOT NULL,
  frequencia ENUM('Diario','Semanal','Mensal') NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_habitos_usuario (usuario_id),
  KEY idx_habitos_categoria (categoria),
  CONSTRAINT fk_habitos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Conclusao diaria do habito (base para "Concluidos hoje" e pontuacao)
CREATE TABLE IF NOT EXISTS habito_checkins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  habito_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  data_ref DATE NOT NULL,
  concluido TINYINT(1) NOT NULL DEFAULT 1,
  pontos INT NOT NULL DEFAULT 50,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_checkin_habito_data (habito_id, data_ref),
  KEY idx_checkins_usuario_data (usuario_id, data_ref),
  CONSTRAINT fk_checkins_habito
    FOREIGN KEY (habito_id) REFERENCES habitos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_checkins_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- View para ranking mensal dinamico
CREATE OR REPLACE VIEW vw_ranking_mensal AS
SELECT
  u.id AS usuario_id,
  u.nome_completo,
  DATE_FORMAT(c.data_ref, '%Y-%m') AS ano_mes,
  SUM(CASE WHEN c.concluido = 1 THEN c.pontos ELSE 0 END) AS pontos_total
FROM usuarios u
LEFT JOIN habito_checkins c ON c.usuario_id = u.id
GROUP BY u.id, u.nome_completo, DATE_FORMAT(c.data_ref, '%Y-%m');

-- Usuario de exemplo (senha: 123456, hash de exemplo bcrypt)
INSERT INTO usuarios (nome_completo, email, login, senha_hash)
VALUES
  ('Usuario Demo', 'demo@habitflow.com', 'demo', '$2b$10$yOXdxC/q2BDq/GOkNDwrH..WW3u0fnnhP2zEQCby5IHaxbYIhW0/C')
ON DUPLICATE KEY UPDATE email = VALUES(email);

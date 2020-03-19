
CREATE DATABASE IF NOT EXISTS db_acessibilidade;
USE db_acessibilidade ;

-- -----------------------------------------------------
-- Table tipo_usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tipo_usuario (
  id_tipo_usuario TINYINT NOT NULL AUTO_INCREMENT,
  tipo VARCHAR(45) NULL,
  PRIMARY KEY (id_tipo_usuario)
)ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  username VARCHAR(45) NOT NULL,
  senha VARCHAR(45) NOT NULL,
  id_tipo_usuario TINYINT NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT fk_usuario_tipo_usuario1
    FOREIGN KEY (id_tipo_usuario)
    REFERENCES tipo_usuario (id_tipo_usuario)
)ENGINE = InnoDB;
    


-- -----------------------------------------------------
-- Table tipo_deficiencia
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tipo_deficiencia (
  id_tipo_deficiencia INT NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_tipo_deficiencia))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table curriculo
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS curriculo (
  id_curriculo INT NOT NULL,
  objetivo MEDIUMTEXT NULL,
  PRIMARY KEY (id_curriculo))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table endereco
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS endereco (
  id_endereco INT NOT NULL,
  pais VARCHAR(45) NOT NULL,
  estado VARCHAR(45) NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  bairro VARCHAR(45) NULL,
  cep INT NULL,
  logradouro VARCHAR(45) NULL,
  numero INT NULL,
  complemento VARCHAR(45) NULL,
  PRIMARY KEY (id_endereco))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table usuario_pcd
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_pcd (
  rg INT NOT NULL,
  dt_nascimento DATE NOT NULL,
  laudo_verificado BOOLEAN NULL,
  laudo_url VARCHAR(45) NULL,
  id_tipo_deficiencia INT NOT NULL,
  id_usuario INT NOT NULL,
  id_curriculo INT NOT NULL,
  id_endereco INT NOT NULL,
  PRIMARY KEY (rg),
  CONSTRAINT fk_usuario_pcd_tipo_deficiencia1
    FOREIGN KEY (id_tipo_deficiencia)
    REFERENCES tipo_deficiencia (id_tipo_deficiencia)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_usuario_pcd_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_usuario_pcd_curriculo1
    FOREIGN KEY (id_curriculo)
    REFERENCES curriculo (id_curriculo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_usuario_pcd_endereco1
    FOREIGN KEY (id_endereco)
    REFERENCES endereco (id_endereco)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table usuario_freelancer
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_freelancer (
  cpf VARCHAR(45) NOT NULL,
  id_endereco INT NOT NULL,
  id_usuario INT NOT NULL,
  id_curriculo INT NOT NULL,
  PRIMARY KEY (cpf),
  CONSTRAINT fk_usuario_freelancer_endereco1
    FOREIGN KEY (id_endereco)
    REFERENCES endereco (id_endereco)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_usuario_freelancer_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_usuario_freelancer_curriculo1
    FOREIGN KEY (id_curriculo)
    REFERENCES curriculo (id_curriculo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table usuario_empresa
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_empresa (
  cnpj VARCHAR(14) NOT NULL,
  razao_social VARCHAR(45) NOT NULL,
  id_endereco INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (cnpj),
  CONSTRAINT fk_usuario_empresa_endereco1
    FOREIGN KEY (id_endereco)
    REFERENCES endereco (id_endereco)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_usuario_empresa_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table vaga
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS vaga (
  id_vaga INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(45) NOT NULL,
  descricao TEXT NOT NULL,
  qtd_vagas INT NOT NULL,
  usuario_empresa_cnpj VARCHAR(14) NOT NULL,
  PRIMARY KEY (id_vaga),
  CONSTRAINT fk_vaga_usuario_empresa1
    FOREIGN KEY (usuario_empresa_cnpj)
    REFERENCES usuario_empresa (cnpj)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table avaliacao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS avaliacao (
  id_avaliacao INT NOT NULL AUTO_INCREMENT,
  nota TINYINT NOT NULL,
  comentario TEXT NULL,
  usuario_pcd_rg INT NOT NULL,
  usuario_empresa_cnpj VARCHAR(14) NOT NULL,
  PRIMARY KEY (id_avaliacao),
  CONSTRAINT fk_avaliacao_usuario_pcd1
    FOREIGN KEY (usuario_pcd_rg)
    REFERENCES usuario_pcd (rg)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_avaliacao_usuario_empresa1
    FOREIGN KEY (usuario_empresa_cnpj)
    REFERENCES usuario_empresa (cnpj)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table experiencias_empresariais
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS experiencias_empresariais (
  id_experiencias_empresariais INT NOT NULL,
  titulo TINYTEXT NOT NULL,
  cargo VARCHAR(45) NOT NULL,
  descricao TEXT NOT NULL,
  entrada DATE NOT NULL,
  saida DATE NULL,
  curriculo_id_curriculo INT NOT NULL,
  PRIMARY KEY (id_experiencias_empresariais),
  CONSTRAINT fk_experiencias_empresariais_curriculo
    FOREIGN KEY (curriculo_id_curriculo)
    REFERENCES curriculo (id_curriculo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table experiencias_academicas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS experiencias_academicas (
  id_experiencias_academicas INT NOT NULL,
  instituicao VARCHAR(45) NOT NULL,
  curso VARCHAR(45) NOT NULL,
  entrada DATE NOT NULL,
  saida DATE NULL,
  curriculo_id_curriculo INT NOT NULL,
  PRIMARY KEY (id_experiencias_academicas),
  CONSTRAINT fk_experiencias_academicas_curriculo1
    FOREIGN KEY (curriculo_id_curriculo)
    REFERENCES curriculo (id_curriculo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table qualificacoes_adicionais
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS qualificacoes_adicionais (
  id_qualificacoes_adicionais INT NOT NULL,
  titulo VARCHAR(45) NOT NULL,
  descricao VARCHAR(45) NOT NULL,
  curriculo_id_curriculo INT NOT NULL,
  PRIMARY KEY (id_qualificacoes_adicionais),
  CONSTRAINT fk_qualificacoes_adicionais_curriculo1
    FOREIGN KEY (curriculo_id_curriculo)
    REFERENCES curriculo (id_curriculo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table candidato
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS candidato (
  id_candidato INT NOT NULL AUTO_INCREMENT,
  vaga_id_vaga INT NOT NULL,
  usuario_pcd_rg INT NOT NULL,
  PRIMARY KEY (id_candidato),
  CONSTRAINT fk_vaga_has_usuario_pcd_vaga1
    FOREIGN KEY (vaga_id_vaga)
    REFERENCES vaga (id_vaga)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_vaga_has_usuario_pcd_usuario_pcd1
    FOREIGN KEY (usuario_pcd_rg)
    REFERENCES usuario_pcd (rg)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table proposta
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS proposta (
  usuario_freelancer_cpf INT NOT NULL,
  usuario_empresa_cnpj VARCHAR(14) NOT NULL,
  id_proposta INT NOT NULL AUTO_INCREMENT,
  valor DOUBLE NULL,
  mensagem TEXT NULL,
  PRIMARY KEY (id_proposta),
  CONSTRAINT fk_usuario_freelancer_has_usuario_empresa_usuario_freelancer1
    FOREIGN KEY (usuario_freelancer_cpf)
    REFERENCES usuario_freelancer (cpf)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_usuario_freelancer_has_usuario_empresa_usuario_empresa1
    FOREIGN KEY (usuario_empresa_cnpj)
    REFERENCES usuario_empresa (cnpj)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
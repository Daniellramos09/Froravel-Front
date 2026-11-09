-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
-- Host: localhost    Database: floraveldb
-- Versão com Suporte B2C + B2B Corporate Integrados
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ==============================================================================
-- 1. TABELAS ORIGINAIS DO SISTEMA (FLORAVEL B2C - INTACTAS)
-- ==============================================================================

--
-- Table structure for table `usuarios`
--
DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo_perfil` varchar(50) NOT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `telefone` varchar(30) DEFAULT NULL,
  `foto_url` varchar(500) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maes`
--
DROP TABLE IF EXISTS `maes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maes` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `usuario_id` char(36) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fk_mae_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `psicologos`
--
DROP TABLE IF EXISTS `psicologos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psicologos` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `usuario_id` char(36) NOT NULL,
  `foto_url` varchar(500) DEFAULT NULL,
  `crp` varchar(50) NOT NULL,
  `biografia` text,
  `valor_consulta` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `crp` (`crp`),
  CONSTRAINT `fk_psicologo_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `triagem_edimburgo`
--
DROP TABLE IF EXISTS `triagem_edimburgo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `triagem_edimburgo` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `mae_id` char(36) NOT NULL,
  `data_realizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pontuacao_total` int NOT NULL,
  `nivel_risco` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_triagem_mae` (`mae_id`),
  CONSTRAINT `fk_triagem_mae` FOREIGN KEY (`mae_id`) REFERENCES `maes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `respostas_edimburgo`
--
DROP TABLE IF EXISTS `respostas_edimburgo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respostas_edimburgo` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `triagem_id` char(36) NOT NULL,
  `numero_questao` int NOT NULL,
  `valor_resposta` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_resposta_triagem` (`triagem_id`),
  CONSTRAINT `fk_resposta_triagem` FOREIGN KEY (`triagem_id`) REFERENCES `triagem_edimburgo` (`id`) ON DELETE CASCADE,
  CONSTRAINT `respostas_edimburgo_chk_1` CHECK ((`numero_questao` between 1 and 10)),
  CONSTRAINT `respostas_edimburgo_chk_2` CHECK ((`valor_resposta` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agendamentos`
--
DROP TABLE IF EXISTS `agendamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendamentos` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `mae_id` char(36) NOT NULL,
  `psicologo_id` char(36) NOT NULL,
  `data_hora_inicio` datetime NOT NULL,
  `data_hora_fim` datetime NOT NULL,
  `status` varchar(50) DEFAULT 'AGENDADO',
  `link_sessao` varchar(500) DEFAULT NULL,
  `observacoes` text,
  PRIMARY KEY (`id`),
  KEY `fk_agendamento_mae` (`mae_id`),
  KEY `fk_agendamento_psicologo` (`psicologo_id`),
  CONSTRAINT `fk_agendamento_mae` FOREIGN KEY (`mae_id`) REFERENCES `maes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_agendamento_psicologo` FOREIGN KEY (`psicologo_id`) REFERENCES `psicologos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rodas_de_conversa`
--
DROP TABLE IF EXISTS `rodas_de_conversa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rodas_de_conversa` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `psicologo_id` char(36) NOT NULL,
  `tema` varchar(200) NOT NULL,
  `data_hora_inicio` datetime NOT NULL,
  `duracao_minutos` int DEFAULT '60',
  `limite_participantes` int DEFAULT '15',
  `link_sessao` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'AGENDADA',
  PRIMARY KEY (`id`),
  KEY `fk_roda_psicologo` (`psicologo_id`),
  CONSTRAINT `fk_roda_psicologo` FOREIGN KEY (`psicologo_id`) REFERENCES `psicologos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `participantes_roda`
--
DROP TABLE IF EXISTS `participantes_roda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participantes_roda` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `roda_id` char(36) NOT NULL,
  `mae_id` char(36) NOT NULL,
  `data_inscricao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status_participacao` varchar(50) DEFAULT 'CONFIRMADA',
  PRIMARY KEY (`id`),
  UNIQUE KEY `roda_id` (`roda_id`,`mae_id`),
  KEY `fk_participante_mae` (`mae_id`),
  CONSTRAINT `fk_participante_mae` FOREIGN KEY (`mae_id`) REFERENCES `maes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_participante_roda` FOREIGN KEY (`roda_id`) REFERENCES `rodas_de_conversa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `disponibilidade_psicologo`
--
DROP TABLE IF EXISTS `disponibilidade_psicologo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disponibilidade_psicologo` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `psicologo_id` char(36) NOT NULL,
  `data_hora_inicio` datetime NOT NULL,
  `data_hora_fim` datetime NOT NULL,
  `tipo_vaga` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'DISPONIVEL',
  PRIMARY KEY (`id`),
  KEY `fk_disponibilidade_psicologo` (`psicologo_id`),
  CONSTRAINT `fk_disponibilidade_psicologo` FOREIGN KEY (`psicologo_id`) REFERENCES `psicologos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


-- ==============================================================================
-- 2. MÓDULO CORPORATE (RH / B2B) - ADICIONADO SEM ALTERAR AS TABELAS ACIMA
-- ==============================================================================

--
-- Table structure for table `empresas`
--
DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `nome` varchar(150) NOT NULL,
  `cnpj` varchar(18) NOT NULL,
  `status` varchar(30) DEFAULT 'ATIVA',
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`),
  KEY `idx_empresas_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gestores_rh`
--
DROP TABLE IF EXISTS `gestores_rh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gestores_rh` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `empresa_id` char(36) NOT NULL,
  `usuario_id` char(36) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `nivel_permissao` varchar(50) DEFAULT 'ANALISTA_RH',
  `data_vinculo` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `fk_gestor_empresa` (`empresa_id`),
  CONSTRAINT `fk_gestor_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gestor_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `licencas_colaboradoras`
--
DROP TABLE IF EXISTS `licencas_colaboradoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licencas_colaboradoras` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `empresa_id` char(36) NOT NULL,
  `nome_colaboradora` varchar(150) NOT NULL,
  `email_corporativo` varchar(150) NOT NULL,
  `departamento` varchar(100) NOT NULL,
  `status` varchar(30) DEFAULT 'PENDENTE',
  `token_convite` varchar(100) DEFAULT NULL,
  `data_convite` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_ativacao` timestamp NULL DEFAULT NULL,
  `mae_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_empresa_email` (`empresa_id`,`email_corporativo`),
  UNIQUE KEY `token_convite` (`token_convite`),
  KEY `fk_licenca_mae` (`mae_id`),
  KEY `idx_licenca_busca` (`empresa_id`,`status`),
  CONSTRAINT `fk_licenca_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_licenca_mae` FOREIGN KEY (`mae_id`) REFERENCES `maes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `faturas_empresa`
--
DROP TABLE IF EXISTS `faturas_empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faturas_empresa` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `empresa_id` char(36) NOT NULL,
  `mes_referencia` varchar(30) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `status` varchar(30) DEFAULT 'PENDENTE',
  `data_vencimento` date NOT NULL,
  `data_pagamento` date DEFAULT NULL,
  `numero_nfe` varchar(50) DEFAULT NULL,
  `url_pdf_nfe` varchar(500) DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_fatura_empresa` (`empresa_id`),
  KEY `idx_faturas_status` (`empresa_id`,`status`),
  CONSTRAINT `fk_fatura_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `configuracoes_empresa`
--
DROP TABLE IF EXISTS `configuracoes_empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracoes_empresa` (
  `empresa_id` char(36) NOT NULL,
  `email_resumo_mensal` tinyint(1) DEFAULT '1',
  `alerta_sobrecarga_clinica` tinyint(1) DEFAULT '1',
  `alerta_limite_licencas` tinyint(1) DEFAULT '1',
  `limiar_alerta_licencas_percentual` int DEFAULT '90',
  `autenticacao_2fa_obrigatoria` tinyint(1) DEFAULT '1',
  `data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`empresa_id`),
  CONSTRAINT `fk_config_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `empresas`;
CREATE TABLE `empresas` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `nome` varchar(150) NOT NULL,
  `cnpj` varchar(18) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'ATIVA',
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_empresas_cnpj` (`cnpj`),
  KEY `idx_empresas_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `gestores_rh`;
CREATE TABLE `gestores_rh` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `empresa_id` char(36) NOT NULL,
  `usuario_id` char(36) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `data_vinculo` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_gestores_usuario` (`usuario_id`),
  KEY `fk_gestores_empresa` (`empresa_id`),
  CONSTRAINT `fk_gestores_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gestores_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `licencas_colaboradoras`;
CREATE TABLE `licencas_colaboradoras` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `empresa_id` char(36) NOT NULL,
  `nome_colaboradora` varchar(150) NOT NULL,
  `email_corporativo` varchar(150) NOT NULL,
  `departamento` varchar(100) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'PENDENTE',
  `token_convite` varchar(100) DEFAULT NULL,
  `data_convite` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_ativacao` timestamp NULL DEFAULT NULL,
  `mae_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_empresa_email` (`empresa_id`, `email_corporativo`),
  UNIQUE KEY `uk_licencas_token` (`token_convite`),
  KEY `fk_licencas_mae` (`mae_id`),
  KEY `idx_licencas_busca` (`empresa_id`, `status`),
  CONSTRAINT `fk_licencas_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_licencas_mae` FOREIGN KEY (`mae_id`) REFERENCES `maes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `faturas_empresa`;
CREATE TABLE `faturas_empresa` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `empresa_id` char(36) NOT NULL,
  `mes_referencia` varchar(30) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'PENDENTE',
  `data_vencimento` date NOT NULL,
  `data_pagamento` date DEFAULT NULL,
  `numero_nfe` varchar(50) DEFAULT NULL,
  `url_pdf_nfe` varchar(500) DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_faturas_empresa` (`empresa_id`),
  KEY `idx_faturas_busca` (`empresa_id`, `status`),
  CONSTRAINT `fk_faturas_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `configuracoes_empresa`;
CREATE TABLE `configuracoes_empresa` (
  `empresa_id` char(36) NOT NULL,
  `email_resumo_mensal` tinyint(1) NOT NULL DEFAULT '1',
  `alerta_sobrecarga_clinica` tinyint(1) NOT NULL DEFAULT '1',
  `alerta_limite_licencas` tinyint(1) NOT NULL DEFAULT '1',
  `limiar_alerta_licencas_percentual` int NOT NULL DEFAULT '90',
  `autenticacao_2fa_obrigatoria` tinyint(1) NOT NULL DEFAULT '1',
  `data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`empresa_id`),
  CONSTRAINT `fk_config_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;

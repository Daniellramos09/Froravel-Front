SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `onboarding_mae`;
CREATE TABLE `onboarding_mae` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `mae_id` char(36) NOT NULL,
  `fase_maternidade` varchar(50) NOT NULL,
  `principal_desafio` varchar(50) NOT NULL,
  `faixa_renda` varchar(50) NOT NULL,
  `disposto_pagar_psicologia` varchar(50) NOT NULL,
  `expectativa_principal` varchar(50) NOT NULL,
  `data_resposta` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_onboarding_mae` (`mae_id`),
  CONSTRAINT `fk_onboarding_mae` FOREIGN KEY (`mae_id`) REFERENCES `maes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `salas_reuniao`;
CREATE TABLE `salas_reuniao` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `titulo` varchar(200) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `psicologo_id` char(36) NOT NULL,
  `referencia_id` char(36) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'AGENDADA',
  `link_sala` varchar(500) DEFAULT NULL,
  `data_inicio` datetime NOT NULL,
  `data_fim` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sala_psicologo` (`psicologo_id`),
  KEY `idx_salas_status` (`status`),
  CONSTRAINT `fk_sala_psicologo` FOREIGN KEY (`psicologo_id`) REFERENCES `psicologos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `feedbacks_reuniao`;
CREATE TABLE `feedbacks_reuniao` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `sala_id` char(36) NOT NULL,
  `usuario_id` char(36) NOT NULL,
  `expectativa_pre` text DEFAULT NULL,
  `nota_satisfacao` int NOT NULL,
  `atendeu_expectativa` varchar(30) NOT NULL DEFAULT 'sim',
  `o_que_achou_texto` text NOT NULL,
  `permitir_divulgacao_anonima` tinyint(1) NOT NULL DEFAULT '1',
  `data_feedback` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_feedback_sala` (`sala_id`),
  KEY `fk_feedback_usuario` (`usuario_id`),
  CONSTRAINT `fk_feedback_sala` FOREIGN KEY (`sala_id`) REFERENCES `salas_reuniao` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_feedback_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `feedbacks_plataforma`;
CREATE TABLE `feedbacks_plataforma` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `usuario_id` char(36) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `nota` int NOT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_feedback_plat_usuario` (`usuario_id`),
  CONSTRAINT `fk_feedback_plat_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `denuncias`;
CREATE TABLE `denuncias` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `denunciante_usuario_id` char(36) NOT NULL,
  `denunciado_usuario_id` char(36) DEFAULT NULL,
  `sala_id` char(36) DEFAULT NULL,
  `motivo` varchar(50) NOT NULL,
  `o_que_fez` text NOT NULL,
  `o_que_sentiu` text NOT NULL,
  `bloquear_usuario` tinyint(1) NOT NULL DEFAULT '1',
  `status` varchar(30) NOT NULL DEFAULT 'PENDENTE',
  `data_denuncia` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_denuncia_denunciante` (`denunciante_usuario_id`),
  KEY `idx_denuncias_status` (`status`),
  CONSTRAINT `fk_denuncia_denunciante` FOREIGN KEY (`denunciante_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `planos_monetizacao`;
CREATE TABLE `planos_monetizacao` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `nome` varchar(100) NOT NULL,
  `valor_mensal` decimal(10,2) DEFAULT '80.00',
  `taxa_fixa_consulta` decimal(10,2) DEFAULT '15.00',
  `taxa_percentual_consulta` decimal(5,2) DEFAULT '5.00',
  `status` varchar(30) NOT NULL DEFAULT 'ATIVO',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;

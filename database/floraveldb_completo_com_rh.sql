SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `usuarios`;
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

DROP TABLE IF EXISTS `maes`;
CREATE TABLE `maes` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `usuario_id` char(36) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fk_mae_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `psicologos`;
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

DROP TABLE IF EXISTS `triagem_edimburgo`;
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

DROP TABLE IF EXISTS `respostas_edimburgo`;
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

DROP TABLE IF EXISTS `agendamentos`;
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

DROP TABLE IF EXISTS `rodas_de_conversa`;
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

DROP TABLE IF EXISTS `participantes_roda`;
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

DROP TABLE IF EXISTS `disponibilidade_psicologo`;
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
  UNIQUE KEY `uk_empresa_email` (`empresa_id`,`email_corporativo`),
  UNIQUE KEY `uk_licencas_token` (`token_convite`),
  KEY `fk_licencas_mae` (`mae_id`),
  KEY `idx_licencas_busca` (`empresa_id`,`status`),
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
  KEY `idx_faturas_busca` (`empresa_id`,`status`),
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


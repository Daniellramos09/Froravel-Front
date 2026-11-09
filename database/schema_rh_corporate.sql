-- ==============================================================================
-- MÓDULO FLORÁVEL CORPORATE (PAINEL DE RECURSOS HUMANOS / B2B)
-- Integração 100% compatível com o dump oficial: `floraveldb` (MySQL 8.0+)
--
-- Padrões respeitados do seu dump:
-- 1. UUID nativo: `char(36) NOT NULL DEFAULT (uuid())`
-- 2. Collation: `utf8mb4_0900_ai_ci` e `ENGINE=InnoDB`
-- 3. Sem ENUM no banco (validações no backend)
-- 4. Sem duplicidade de dados (utiliza `usuarios` para login dos gestores)
-- 5. Nenhuma das 9 tabelas existentes do dump é alterada ou quebrada.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABELA DE EMPRESAS CLIENTES (B2B)
-- Armazena os dados essenciais da pessoa jurídica contratante
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `empresas`;
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

-- ------------------------------------------------------------------------------
-- 2. GESTORES DE RH (QUEM TEM ACESSO AO PAINEL CORPORATE)
-- Vincula-se diretamente à tabela `usuarios` já existente no seu dump
-- O tipo_perfil no `usuarios` para eles será 'GESTOR_RH'
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `gestores_rh`;
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

-- ------------------------------------------------------------------------------
-- 3. LICENÇAS E CONVITES DE COLABORADORAS
-- Gerenciadas pelo RH na tela de Licenças (LicensesScreen)
-- BLINDAGEM LGPD: O RH enxerga apenas nome, e-mail, departamento e status.
-- NENHUM dado de consulta, triagem ou saúde mental fica exposto ao RH.
-- O campo `mae_id` conecta de forma transparente à tabela `maes` quando ela ativa.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `licencas_colaboradoras`;
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
  UNIQUE KEY `uk_empresa_email` (`empresa_id`, `email_corporativo`),
  UNIQUE KEY `token_convite` (`token_convite`),
  KEY `fk_licenca_mae` (`mae_id`),
  KEY `idx_licenca_busca` (`empresa_id`, `status`),
  CONSTRAINT `fk_licenca_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_licenca_mae` FOREIGN KEY (`mae_id`) REFERENCES `maes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------------------------
-- 4. HISTÓRICO DE FATURAMENTO DA EMPRESA (TELA BILLING)
-- Controla mensalidades, faturas e comprovantes de pagamento do plano B2B
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `faturas_empresa`;
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
  KEY `idx_faturas_status` (`empresa_id`, `status`),
  CONSTRAINT `fk_fatura_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------------------------
-- 5. PREFERÊNCIAS E CONFIGURAÇÕES DA EMPRESA (TELA CONFIGURAÇÕES)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `configuracoes_empresa`;
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

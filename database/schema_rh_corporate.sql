-- ==============================================================================
-- MÓDULO FLORÁVEL CORPORATE (PAINEL DE RECURSOS HUMANOS / B2B)
-- Compatível com MySQL 8.0+
-- Regra de Boas Práticas: Sem ENUMs no banco (validação gerenciada no backend)
-- Mantém 100% intactas as tabelas existentes (usuarios, maes, psicologos, etc.)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABELA DE EMPRESAS CLIENTES (B2B)
-- Armazena os dados cadastrais e fiscais da pessoa jurídica contratante
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS empresas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,            -- Formato: 00.000.000/0000-00
    email_corporativo VARCHAR(150) NOT NULL,     -- E-mail institucional de RH / Benefícios
    telefone VARCHAR(30),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    setor_atuacao VARCHAR(100),                  -- Ex: "Tecnologia", "Financeiro", "Saúde"
    status VARCHAR(50) DEFAULT 'ATIVA',          -- 'ATIVA', 'SUSPENSA', 'CANCELADA'
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_empresas_cnpj (cnpj),
    INDEX idx_empresas_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 2. TABELA DE GESTORES DE RH (QUEM TEM ACESSO AO PAINEL CORPORATE)
-- Profissionais da empresa com login e permissões no painel
-- Vincula-se à tabela 'usuarios' já existente
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gestores_rh (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL,
    usuario_id CHAR(36) NOT NULL UNIQUE,         -- ID na tabela usuarios
    cargo VARCHAR(100),                          -- Ex: "Gerente de D&I", "BP de RH"
    nivel_permissao VARCHAR(50) DEFAULT 'ANALISTA_RH', -- 'ADMIN_MASTER', 'ANALISTA_RH', 'AUDITOR_D_I'
    status VARCHAR(50) DEFAULT 'ATIVO',          -- 'ATIVO', 'INATIVO'
    data_vinculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_gestor_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    CONSTRAINT fk_gestor_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_gestores_empresa (empresa_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 3. PLANOS CORPORATIVOS
-- Catálogo de planos de assinatura empresarial oferecidos pela Florável
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planos_corporativos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nome VARCHAR(100) NOT NULL,                  -- Ex: "Starter 20", "Mid-Market 50", "Enterprise 100+"
    quantidade_licencas INT NOT NULL,            -- Limite de licenças incluídas
    valor_mensal DECIMAL(10, 2) NOT NULL,        -- Valor fixo mensal do plano
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'ATIVO',          -- 'ATIVO', 'DESCONTINUADO'
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. ASSINATURAS DA EMPRESA (CONTRATO E PAGAMENTO REVOLVENTE)
-- Registra o plano contratado, quantidade de licenças e dados seguros de pagamento
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assinaturas_empresa (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL UNIQUE,
    plano_id CHAR(36) NOT NULL,
    quantidade_licencas_contratadas INT NOT NULL DEFAULT 50,
    valor_mensal_recorrente DECIMAL(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_proxima_renovacao DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ATIVA',          -- 'ATIVA', 'INADIMPLENTE', 'CANCELADA'
    
    -- Dados seguros do cartão (apenas os 4 últimos dígitos para exibição visual)
    cartao_ultimos_digitos VARCHAR(4) DEFAULT '4092',
    cartao_bandeira VARCHAR(30) DEFAULT 'MASTERCARD',
    cartao_titular VARCHAR(150),
    cartao_validade VARCHAR(10),                 -- Ex: "09/2029"
    gateway_subscription_id VARCHAR(100),        -- Identificador da assinatura no Gateway (Stripe/Asaas)
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_assinatura_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    CONSTRAINT fk_assinatura_plano FOREIGN KEY (plano_id) 
        REFERENCES planos_corporativos(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. HISTÓRICO DE FATURAS E NOTAS FISCAIS (BILLING CORPORATIVO)
-- Registra as cobranças mensais, comprovantes e status de pagamento
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faturas_empresa (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL,
    mes_referencia VARCHAR(30) NOT NULL,         -- Ex: "Outubro / 2026"
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE NULL,
    status VARCHAR(50) DEFAULT 'PENDENTE',       -- 'PAGO', 'FALHA_COBRANCA', 'PENDENTE', 'CANCELADO'
    numero_nfe VARCHAR(50),                      -- Ex: "NF-e #89211"
    url_pdf_nfe VARCHAR(500),
    mensagem_erro TEXT NULL,                     -- Detalhe caso a cobrança falhe (ex: limite excedido)
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_fatura_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_faturas_empresa_data (empresa_id, data_vencimento),
    INDEX idx_faturas_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 6. GESTÃO DE LICENÇAS E CONVITES (COLABORADORAS DA EMPRESA)
-- Registra as colaboradoras convidadas pelo RH para usufruírem do benefício
-- BLINDAGEM LGPD: O RH enxerga apenas nome, e-mail, departamento e status do convite.
-- NENHUM dado de saúde, diário ou prontuário é associado nesta tabela.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS licencas_colaboradoras (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL,
    nome_colaboradora VARCHAR(150) NOT NULL,
    email_corporativo VARCHAR(150) NOT NULL,
    departamento VARCHAR(100) NOT NULL,          -- Ex: "Engenharia", "Design", "Operações"
    cargo VARCHAR(100),
    token_convite VARCHAR(100) UNIQUE NOT NULL,  -- Token seguro enviado por e-mail para ativação
    status VARCHAR(50) DEFAULT 'PENDENTE',       -- 'PENDENTE', 'ATIVA', 'REVOGADA', 'EXPIRADA'
    data_convite TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ativacao TIMESTAMP NULL,
    mae_id CHAR(36) NULL,                        -- Preenchido quando a mãe conclui cadastro na tabela 'maes'
    
    CONSTRAINT fk_licenca_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    CONSTRAINT fk_licenca_mae FOREIGN KEY (mae_id) 
        REFERENCES maes(id) ON DELETE SET NULL,
    UNIQUE(empresa_id, email_corporativo),
    INDEX idx_licencas_busca (empresa_id, status, departamento)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 7. CONFIGURAÇÕES E ALERTAS DE RH DA EMPRESA
-- Preferências salvas na tela de Configurações (SettingsScreen)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS configuracoes_empresa (
    empresa_id CHAR(36) PRIMARY KEY,
    email_resumo_mensal BOOLEAN DEFAULT TRUE,
    alerta_sobrecarga_clinica BOOLEAN DEFAULT TRUE,
    alerta_limite_licencas BOOLEAN DEFAULT TRUE,
    limiar_alerta_licencas_percentual INT DEFAULT 90,
    autenticacao_2fa_obrigatoria BOOLEAN DEFAULT TRUE,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_config_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 8. MÉTRICAS AGREGADAS E ANÔNIMAS DE SAÚDE (SNAPSHOTS HISTÓRICOS PARA GRÁFICOS)
-- Armazena os dados agregados mensais exibidos no Dashboard e nos Relatórios de Saúde
-- Garante por design que o RH só consome dados consolidados (sem expor indivíduos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS metricas_saude_mensal_empresa (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL,
    mes_ano VARCHAR(7) NOT NULL,                 -- Formato "AAAA-MM" (ex: "2026-10")
    departamento VARCHAR(100) DEFAULT 'GERAL',   -- 'GERAL' para toda a empresa ou nome do setor
    total_colaboradoras_ativas INT NOT NULL,
    media_pontuacao_edimburgo DECIMAL(4, 2),     -- Média agregada EPDS
    percentual_baixo_risco DECIMAL(5, 2),        -- % faixa saudável
    percentual_risco_moderado DECIMAL(5, 2),     -- % atenção moderada
    percentual_alerta_clinico DECIMAL(5, 2),     -- % suporte prioritário
    taxa_engajamento DECIMAL(5, 2),              -- % de colaboradoras ativas no mês
    sessoes_realizadas INT DEFAULT 0,            -- Total de consultas psicológicas corporativas
    indice_esgotamento DECIMAL(5, 2),            -- Pontuação calculada do gráfico temporal
    indice_recuperacao DECIMAL(5, 2),            -- Pontuação de bem-estar calculada
    desafio_principal VARCHAR(150),              -- Ex: "Conciliação Trabalho-Família"
    data_consolidacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_metricas_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    UNIQUE(empresa_id, mes_ano, departamento),
    INDEX idx_metricas_empresa_periodo (empresa_id, mes_ano)
) ENGINE=InnoDB;

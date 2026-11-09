-- ==============================================================================
-- FLORÁVEL & FLORÁVEL CORPORATE - MODELO DE BANCO DE DADOS (MySQL 8.0+)
-- Arquitetura Integrada: B2C (Mães e Psicólogos) + B2B (Painel RH e Empresas)
-- Conformidade: LGPD, Ética CFP e Sigilo Médico-Psicológico
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS floravel_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE floravel_db;

-- ==============================================================================
-- 1. NÚCLEO DE IDENTIDADE E AUTENTICAÇÃO
-- ==============================================================================

-- Tabela central de usuários do sistema (Mães, Psicólogos e Gestores de RH)
CREATE TABLE IF NOT EXISTS usuarios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    foto_url VARCHAR(500),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    tipo_perfil ENUM('MAE', 'PSICOLOGO', 'GESTOR_RH', 'ADMIN_FLORAVEL') NOT NULL,
    status ENUM('ATIVO', 'INATIVO', 'BLOQUEADO') DEFAULT 'ATIVO',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_tipo (tipo_perfil)
) ENGINE=InnoDB;

-- ==============================================================================
-- 2. PERFIS ESPECÍFICOS: MÃES E PSICÓLOGOS (B2C)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS maes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL UNIQUE,
    data_nascimento DATE,
    data_parto DATE,                             -- Auxilia no cálculo de semanas do puerpério
    possui_rede_apoio BOOLEAN DEFAULT FALSE,
    tipo_parto ENUM('NORMAL', 'CESAREA', 'OUTRO'),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mae_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS psicologos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL UNIQUE,
    crp VARCHAR(50) UNIQUE NOT NULL,
    biografia TEXT,
    especialidades VARCHAR(255),                 -- Ex: "Psicologia Perinatal, Luto Materno, Pós-parto"
    valor_consulta DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (valor_consulta >= 0),
    duracao_sessao_minutos INT DEFAULT 50,
    google_calendar_sync BOOLEAN DEFAULT FALSE,  -- Sincronização externa de agenda
    google_calendar_token TEXT,                  -- Token OAuth criptografado
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_psicologo_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==============================================================================
-- 3. MÓDULO B2B: FLORÁVEL CORPORATE (EMPRESAS E RH)
-- ==============================================================================

-- Tabela de Empresas Clientes B2B (ex: TechCorp Brasil)
CREATE TABLE IF NOT EXISTS empresas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,            -- Formato: 00.000.000/0000-00
    email_corporativo VARCHAR(150) NOT NULL,     -- E-mail central de benefícios / RH
    telefone VARCHAR(30),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    setor_atuacao VARCHAR(100),                  -- Ex: "Tecnologia", "Financeiro", "Varejo"
    status ENUM('ATIVA', 'SUSPENSA', 'CANCELADA') DEFAULT 'ATIVA',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_empresas_cnpj (cnpj)
) ENGINE=InnoDB;

-- Gestores de RH associados a uma empresa (Acesso ao Dashboard Corporate)
CREATE TABLE IF NOT EXISTS gestores_rh (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL UNIQUE,
    empresa_id CHAR(36) NOT NULL,
    cargo VARCHAR(100) DEFAULT 'Gestor de Recursos Humanos',
    nivel_permissao ENUM('ADMIN_MASTER', 'ANALISTA_RH', 'AUDITOR_D_I') DEFAULT 'ANALISTA_RH',
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    data_vinculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gestor_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_gestor_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Planos Corporativos Contratáveis
CREATE TABLE IF NOT EXISTS planos_corporativos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nome VARCHAR(100) NOT NULL,                  -- Ex: "Starter 20", "Mid-Market 50", "Enterprise 100+"
    quantidade_licencas INT NOT NULL,
    valor_mensal DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Assinatura ativa da empresa (Faturamento & Cartão)
CREATE TABLE IF NOT EXISTS assinaturas_empresa (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL UNIQUE,
    plano_id CHAR(36) NOT NULL,
    quantidade_licencas_contratadas INT NOT NULL DEFAULT 50,
    valor_recorrente_mensal DECIMAL(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_proxima_renovacao DATE NOT NULL,
    status ENUM('ATIVA', 'INADIMPLENTE', 'CANCELADA') DEFAULT 'ATIVA',
    
    -- Dados seguros do Cartão Corporativo (PCI-DSS Compliant: Apenas 4 últimos dígitos)
    cartao_ultimos_digitos VARCHAR(4) DEFAULT '4092',
    cartao_bandeira VARCHAR(30) DEFAULT 'MASTERCARD',
    cartao_titular VARCHAR(150) DEFAULT 'TECHCORP BRASIL SERVICOS LTDA',
    cartao_validade VARCHAR(7) DEFAULT '09/2029',
    gateway_customer_id VARCHAR(100),            -- ID do cliente no gateway (Asaas, Stripe, etc.)
    gateway_subscription_id VARCHAR(100),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_assinatura_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    CONSTRAINT fk_assinatura_plano FOREIGN KEY (plano_id) 
        REFERENCES planos_corporativos(id)
) ENGINE=InnoDB;

-- Histórico de Faturas e Notas Fiscais (Billing)
CREATE TABLE IF NOT EXISTS faturas_empresa (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL,
    mes_referencia VARCHAR(30) NOT NULL,         -- Ex: "Outubro / 2026"
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE NULL,
    status ENUM('PAGO', 'FALHA_COBRANCA', 'PENDENTE', 'CANCELADO') DEFAULT 'PENDENTE',
    numero_nfe VARCHAR(50),                      -- Ex: "NF-e #89211"
    url_pdf_nfe VARCHAR(500),
    mensagem_erro TEXT NULL,                     -- Ex: "Tentativa de cobrança falhou em 15/10. Atualize seu cartão..."
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fatura_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_faturas_empresa_status (empresa_id, status)
) ENGINE=InnoDB;

-- Gestão de Licenças e Convites (A ponte controlada entre a Empresa e a Colaboradora)
-- REGRA LGPD: O RH vê apenas quem foi convidado e o status da licença.
-- NENHUM dado de prontuário, triagem ou psicoterapia é gravado nesta tabela.
CREATE TABLE IF NOT EXISTS licencas_colaboradoras (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    empresa_id CHAR(36) NOT NULL,
    nome_colaboradora VARCHAR(150) NOT NULL,
    email_corporativo VARCHAR(150) NOT NULL,
    departamento VARCHAR(100) NOT NULL,          -- Ex: "Engenharia", "Design", "Marketing"
    token_convite VARCHAR(100) UNIQUE NOT NULL,  -- Token único de ativação enviado por e-mail
    status ENUM('PENDENTE', 'ATIVA', 'REVOGADA', 'EXPIRADA') DEFAULT 'PENDENTE',
    data_convite TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ativacao TIMESTAMP NULL,
    mae_id CHAR(36) NULL,                        -- Preenchido quando a mãe conclui o cadastro
    
    CONSTRAINT fk_licenca_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    CONSTRAINT fk_licenca_mae FOREIGN KEY (mae_id) 
        REFERENCES maes(id) ON DELETE SET NULL,
    UNIQUE(empresa_id, email_corporativo),
    INDEX idx_licencas_busca (empresa_id, status, departamento)
) ENGINE=InnoDB;

-- Configurações e Alertas do RH da Empresa
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

-- ==============================================================================
-- 4. CLÍNICA & TRIAGEM EDIMBURGO (DADOS SIGILOSOS E MÉDICOS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS triagem_edimburgo (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    mae_id CHAR(36) NOT NULL,
    data_realizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pontuacao_total INT NOT NULL CHECK (pontuacao_total BETWEEN 0 AND 30),
    nivel_risco ENUM('BAIXO_RISCO', 'MODERADO', 'ALERTA_CLINICO') NOT NULL,
    alerta_ideacao_suicida BOOLEAN DEFAULT FALSE, -- Flag derivada da Questão 10
    
    CONSTRAINT fk_triagem_mae FOREIGN KEY (mae_id) 
        REFERENCES maes(id) ON DELETE CASCADE,
    INDEX idx_triagem_mae_data (mae_id, data_realizacao)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS respostas_edimburgo (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    triagem_id CHAR(36) NOT NULL,
    numero_questao INT NOT NULL CHECK (numero_questao BETWEEN 1 AND 10),
    valor_resposta INT NOT NULL CHECK (valor_resposta BETWEEN 0 AND 3),
    CONSTRAINT fk_resposta_triagem FOREIGN KEY (triagem_id) 
        REFERENCES triagem_edimburgo(id) ON DELETE CASCADE,
    UNIQUE(triagem_id, numero_questao)
) ENGINE=InnoDB;

-- Registro de Diário Emocional Rápido (Check-ins Diários da Mãe)
CREATE TABLE IF NOT EXISTS diario_emocional (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    mae_id CHAR(36) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    humor ENUM('SERENA', 'CANSADA', 'ANSIOSA', 'SENSIVEL', 'APOIADA') NOT NULL,
    horas_sono VARCHAR(30),                      -- Ex: "3h a 5h picadas"
    tags_presentes JSON,                         -- Array de tags selecionadas
    nota_livre TEXT,                             -- Desabafo pessoal (criptografado em app)
    CONSTRAINT fk_diario_mae FOREIGN KEY (mae_id) 
        REFERENCES maes(id) ON DELETE CASCADE,
    INDEX idx_diario_mae_data (mae_id, data_registro)
) ENGINE=InnoDB;

-- ==============================================================================
-- 5. AGENDAMENTOS INDIVIDUAIS & DISPONIBILIDADE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS disponibilidade_psicologo (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    psicologo_id CHAR(36) NOT NULL,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    tipo_vaga ENUM('REGULAR', 'EMERGENCIAL', 'RODA') DEFAULT 'REGULAR',
    status ENUM('DISPONIVEL', 'RESERVADA', 'BLOQUEADA') DEFAULT 'DISPONIVEL',
    
    CONSTRAINT fk_disponibilidade_psicologo FOREIGN KEY (psicologo_id) 
        REFERENCES psicologos(id) ON DELETE CASCADE,
    INDEX idx_disp_psicologo_horario (psicologo_id, data_hora_inicio, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agendamentos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    mae_id CHAR(36) NOT NULL,
    psicologo_id CHAR(36) NOT NULL,
    disponibilidade_id CHAR(36) NULL,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    status ENUM('AGENDADO', 'CONCLUIDO', 'CANCELADO_MAE', 'CANCELADO_PSICO') DEFAULT 'AGENDADO',
    link_sessao VARCHAR(500),
    observacoes_psicologo TEXT,                  -- Prontuário sigiloso (CFP)
    origem_beneficio ENUM('PARTICULAR', 'PLANO_CORPORATIVO') DEFAULT 'PARTICULAR',
    empresa_id CHAR(36) NULL,                    -- Opcional, para faturamento de coparticipação
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_agendamento_mae FOREIGN KEY (mae_id) 
        REFERENCES maes(id) ON DELETE CASCADE,
    CONSTRAINT fk_agendamento_psicologo FOREIGN KEY (psicologo_id) 
        REFERENCES psicologos(id) ON DELETE CASCADE,
    CONSTRAINT fk_agendamento_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE SET NULL,
    CONSTRAINT fk_agendamento_disp FOREIGN KEY (disponibilidade_id) 
        REFERENCES disponibilidade_psicologo(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==============================================================================
-- 6. RODAS DE CONVERSA E GESTÃO CONCORRENTE DE VAGAS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS rodas_de_conversa (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    psicologo_id CHAR(36) NOT NULL,
    tema VARCHAR(200) NOT NULL,
    tipo_roda ENUM('TEMATICA_ABERTA', 'GRUPO_FECHADO_COORTE') DEFAULT 'TEMATICA_ABERTA',
    data_hora_inicio DATETIME NOT NULL,
    duracao_minutos INT DEFAULT 60,
    limite_participantes INT DEFAULT 10 CHECK (limite_participantes > 0),
    link_sessao VARCHAR(500),
    status ENUM('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA') DEFAULT 'AGENDADA',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_roda_psicologo FOREIGN KEY (psicologo_id) 
        REFERENCES psicologos(id) ON DELETE CASCADE,
    INDEX idx_rodas_status_inicio (status, data_hora_inicio)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS participantes_roda (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    roda_id CHAR(36) NOT NULL,
    mae_id CHAR(36) NOT NULL,
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_participacao ENUM('CONFIRMADA', 'LISTA_ESPERA', 'CANCELADA', 'PRESENTE') DEFAULT 'CONFIRMADA',
    
    CONSTRAINT fk_participante_roda FOREIGN KEY (roda_id) 
        REFERENCES rodas_de_conversa(id) ON DELETE CASCADE,
    CONSTRAINT fk_participante_mae FOREIGN KEY (mae_id) 
        REFERENCES maes(id) ON DELETE CASCADE,
    UNIQUE(roda_id, mae_id)
) ENGINE=InnoDB;

-- ==============================================================================
-- 7. TRIGGER DE CONTROLE CONCORRENTE DE VAGAS (RODA DE CONVERSA)
-- Garante que o limite de participantes seja respeitado no momento do INSERT.
-- Se a roda estiver cheia, coloca automaticamente na LISTA_ESPERA ou rejeita.
-- ==============================================================================

DELIMITER $$

CREATE TRIGGER trg_limite_participantes_roda
BEFORE INSERT ON participantes_roda
FOR EACH ROW
BEGIN
    DECLARE total_confirmados INT;
    DECLARE vagas_maximas INT;

    -- Obtém o total de confirmados atuais
    SELECT COUNT(*) INTO total_confirmados
    FROM participantes_roda
    WHERE roda_id = NEW.roda_id AND status_participacao = 'CONFIRMADA';

    -- Obtém o limite configurado na roda
    SELECT limite_participantes INTO vagas_maximas
    FROM rodas_de_conversa
    WHERE id = NEW.roda_id;

    -- Se atingiu o limite e tenta confirmar, redireciona para LISTA_ESPERA
    IF total_confirmados >= vagas_maximas AND NEW.status_participacao = 'CONFIRMADA' THEN
        SET NEW.status_participacao = 'LISTA_ESPERA';
    END IF;
END$$

DELIMITER ;

-- ==============================================================================
-- 8. VIEW DE BLINDAGEM LGPD PARA O RH (RELATÓRIOS AGREGADOS ANÔNIMOS)
-- ==============================================================================
-- REGRA CRÍTICA: O RH NUNCA consulta maes ou triagens por ID!
-- Esta VIEW agrega os dados por empresa e departamento.
-- Se o grupo tiver menos de 5 colaboradoras (K-Anonymity < 5),
-- o resultado do departamento é ocultado para impedir a desanonimização.
-- ==============================================================================

CREATE OR REPLACE VIEW vw_relatorio_saude_rh_anonimo AS
SELECT 
    l.empresa_id,
    l.departamento,
    COUNT(DISTINCT l.mae_id) AS total_colaboradoras_com_triagem,
    -- Aplicação de regra K-anonymity (>= 5 colaboradoras):
    CASE 
        WHEN COUNT(DISTINCT l.mae_id) >= 5 THEN ROUND(AVG(t.pontuacao_total), 1)
        ELSE NULL -- Bloqueado para proteger o anonimato da colaboradora
    END AS media_pontuacao_edimburgo,
    CASE 
        WHEN COUNT(DISTINCT l.mae_id) >= 5 THEN
            ROUND((COUNT(CASE WHEN t.nivel_risco = 'BAIXO_RISCO' THEN 1 END) / COUNT(*)) * 100, 1)
        ELSE NULL
    END AS percentual_baixo_risco,
    CASE 
        WHEN COUNT(DISTINCT l.mae_id) >= 5 THEN
            ROUND((COUNT(CASE WHEN t.nivel_risco = 'MODERADO' THEN 1 END) / COUNT(*)) * 100, 1)
        ELSE NULL
    END AS percentual_moderado,
    CASE 
        WHEN COUNT(DISTINCT l.mae_id) >= 5 THEN
            ROUND((COUNT(CASE WHEN t.nivel_risco = 'ALERTA_CLINICO' THEN 1 END) / COUNT(*)) * 100, 1)
        ELSE NULL
    END AS percentual_alerta_clinico
FROM licencas_colaboradoras l
INNER JOIN maes m ON l.mae_id = m.id
INNER JOIN triagem_edimburgo t ON t.mae_id = m.id
WHERE l.status = 'ATIVA'
GROUP BY l.empresa_id, l.departamento;

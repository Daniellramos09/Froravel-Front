# Decisões Arquiteturais: Acolhimento a Menores, Faixa Etária e Diretrizes de Domínio

> **Data de Registro:** 18 de Novembro de 2026  
> **Status:** Aprovado e Vigente  
> **Área:** Domínio da Mãe / Jurídico / LGPD / Segurança Clínica

---

## 1. Diretriz Inegociável: Ausência de Prontuários (Zero Prontuário)
* **Definição de Produto:** A Florável **NÃO É** um Prontuário Eletrônico do Paciente (PEP) ou sistema de gestão médica hospitalar.
* **Propósito Real:** É uma **comunidade de apoio mútuo entre mães**, com pontes para escuta psicológica, rodas de conversa em grupo e atendimentos com terapeutas parceiras.
* **Impacto Arquitetural e Legal:**
  * O sistema não armazena evoluções clínicas formais, diagnósticos CID ou prontuários médicos.
  * O sigilo e os registros clínicos de cada atendimento são de responsabilidade profissional externa da psicóloga, conforme as normas do CFP (Conselho Federal de Psicologia).
  * Desonera a plataforma das pesadas exigências de guarda documental de 20 anos (CFM/CFP) e certificação hospitalar de servidores.

---

## 2. Faixa Etária e Limite Máximo da Maternidade
* **Limite Máximo de Idade:** Fixado em **80 anos** (`IDADE_MAXIMA_MATERNA = 80`).
  * **Motivação:** Reconhece a pluralidade da maternidade e criação de vínculos (reprodução assistida tardia, adoções de recém-nascidos, guarda materna por avós no puerpério). Valores acima de 80 anos são classificados como erro de digitação de ano e barrados na validação.
* **Limite Mínimo Absoluto:** **13 anos** (`IDADE_MINIMA_ABSOLUTA = 13`).
  * **Motivação:** Casos de gestação infantil (< 13 anos) exigem acolhimento prioritário, presencial e obrigatório da rede pública de proteção (SUS, Conselho Tutelar, CREAS). O auto-cadastro online desacompanhado é restrito para segurança jurídica e física da criança.

---

## 3. Acolhimento a Mães Menores de Idade (13 a 17 anos)

### 3.1. Conformidade Legal
* **ECA (Estatuto da Criança e do Adolescente):** Proteção integral e preservação do direito à intimidade (Art. 17).
* **LGPD (Lei 13.709/2018, Art. 14):** Tratamento de dados de crianças e adolescentes no seu melhor interesse, com consentimento de ao menos um responsável legal.
* **CFP (Resolução nº 011/2018, Art. 2º):** Atendimento e escuta psicológica online de menores condicionada ao consentimento expresso de responsável legal.

### 3.2. Arquitetura Desacoplada: Tabela `responsaveis_legais`
Para evitar acoplamento no modelo da entidade `maes` e colunas nulas para a maioria das usuárias adultas, os dados do responsável residem em tabela própria:

* **Tabela:** `responsaveis_legais`
  * `id` CHAR(36) PK
  * `mae_id` CHAR(36) FK UNIQUE (relação 1:1 estrita com a mãe menor)
  * `nome` VARCHAR(150) NOT NULL
  * `cpf` VARCHAR(14) NOT NULL
  * `parentesco` VARCHAR(50) NOT NULL (MÃE, PAI, AVÓ, TUTOR_LEGAL)
  * `telefone` VARCHAR(30) NOT NULL
  * `email` VARCHAR(150) NULL
  * `consentimento_aceito` TINYINT(1) NOT NULL DEFAULT 1
  * `data_consentimento` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 3.3. O que o Responsável Autoriza vs. Sigilo da Menor
* **O que o Responsável Autoriza:** Acesso da dependente ao ecossistema Florável, rodas de escuta e sessões com psicólogas.
* **O que o Responsável NÃO Acessa:** O responsável **não tem acesso aos relatos, conversas de rodas ou desabafos da adolescente**. O sigilo e a privacidade do acolhimento são mantidos para que a jovem sinta segurança em compartilhar suas dores e medos sem sofrer represálias familiares.

### 3.4. Fluxo de Validação do Consentimento
* **Validação Ágil:** Envio de código OTP de 6 dígitos via WhatsApp/SMS diretamente ao telefone informado do responsável no momento do cadastro.
* **Acesso Transitório (Modo Acolhimento):** Enquanto o responsável não confirma, a adolescente tem acesso liberado em modo de leitura para guias informativos e conteúdos de saúde do bebê, evitando rejeição imediata no momento em que ela mais precisa de ajuda.
* **Vulnerabilidade Extrema:** Botão de emergência (*"Não tenho apoio familiar / Preciso de ajuda"*) que encaminha contato direto para serviços públicos de apoio (Disque 100, CRAS e Conselho Tutelar).

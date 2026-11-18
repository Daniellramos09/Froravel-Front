# Constituição Técnica & Arquitetural — Florável

> Este documento define os princípios inegociáveis do projeto Florável. Qualquer alteração ou nova funcionalidade deve respeitar estas diretrizes.

---

## 1. Princípios de Produto & Design (Front-End)
* **Público-Alvo & Faixa Etária:** Mães no puerpério, gestantes e tentantes (idade máxima válida de **80 anos**, idade mínima absoluta de **13 anos**).
* **Diretriz Central: ZERO PRONTUÁRIO:**
  * A Florável **NÃO É** um sistema de prontuário eletrônico médico/hospitalar.
  * É uma comunidade de escuta e acolhimento mútuo entre mães, com pontes para psicologia e rodas de conversa. Registros clínicos formais são de guarda e responsabilidade externa e privada do profissional de saúde.
* **Paleta e Tokens Visuais:**
  * Verde Principal (Identidade): `#294D33` (tons complementares: `#516B55`, `#1f3c27`).
  * Fundo Acolhedor / Suave: `#FCF7F9` e brancos respiráveis.
  * Detalhes / Destaques: Tons rosados suaves (`#E8A9BB`, `#F4DDE5`).
* **Mobile-First & Usabilidade:**
  * Alvos de clique mínimos de 44px (otimizado para mães usando o celular com uma mão só).
  * Sem scroll horizontal involuntário.
  * Diários e questionários devem usar cards visuais representativos em vez de formulários clínicos frios.
* **Videochamada In-App:**
  * A experiência de reunião deve ocorrer em tela cheia (`100vw × 100vh`) via `createPortal`, com lobby de entrada, controles de chamada e modal obrigatório de feedback pós-reunião.

---

## 2. Princípios de Engenharia & Arquitetura (Back-End Java)
* **Arquitetura Package by Domain:**
  * O código é estruturado por módulos verticais de negócio (`domain.mae`, `domain.onboarding`, `domain.triagem`, `domain.rodaconversa`, `domain.feedback`, `domain.agendamento`, `domain.denuncia`, etc.).
  * Cada módulo contém suas entidades, repositórios, serviços, DTOs e exceções no mesmo pacote.
* **Desacoplamento de Responsáveis Legais:**
  * Dados de responsáveis legais de adolescentes (13 a 17 anos) residem estritamente na tabela desacoplada `responsaveis_legais` (1:1), mantendo a tabela `maes` limpa para usuárias adultas autônomas.
* **SOLID & Clean Code:**
  * **SRP (Single Responsibility):** Lógica clínica ou de cálculo (ex.: Escala de Edimburgo) separada da persistência em banco.
  * **DIP (Dependency Inversion):** Serviços dependem de interfaces (`CalculadoraRiscoTriagem`, `MotorDeRecomendacao`).
* **Tratamento Global de Erros (RFC 7807):**
  * Todas as respostas de erro devem passar pelo `GlobalExceptionHandler` e retornar a estrutura padronizada `ErrorResponseDTO`.
  * Nunca vazar stacktraces do servidor ou mensagens brutas de SQL.
* **Banco de Dados (MySQL floraveldb):**
  * **Regra de Ouro:** Não utilizar `ENUM` no banco de dados (validação é feita na camada de aplicação/Java).
  * Chaves primárias UUID `char(36)` geradas via `GenerationType.UUID`.
  * Queries de leitura sempre anotadas com `@Transactional(readOnly = true)`.

---

## 3. Segurança, Moderação & LGPD
* **Sigilo & Confidencialidade (ECA e LGPD):**
  * Responsáveis legais de adolescentes autorizam o acesso à plataforma, mas **não têm acesso** às conversas, rodas ou desabafos da menor, preservando o direito à intimidade.
  * Depoimentos no mural público devem sempre ter nomes anonimizados automaticamente pelo back-end (ex.: "Mariana S.").
* **Moderação Ativa & Disjuntor em Salas (*Room Circuit Breaker*):**
  * Múltiplas denúncias simultâneas em uma mesma sala ativam o corte preventivo imediato de microfone/vídeo para proteção das participantes.
* **Matchmaking Seguro:**
  * Denúncias com solicitação de bloqueio impedem automaticamente que as pessoas envolvidas caiam na mesma sala de conversa no futuro.

---

## 4. Documentos Complementares de Decisão
* Consulte [.spec/decisoes-arquiteturais-menores-de-idade.md](file:///c:/Users/danie/PROA/projetoDemoDay/Froravel-Front/.spec/decisoes-arquiteturais-menores-de-idade.md) para detalhes jurídicos e fluxos de consentimento.
* Consulte [.spec/decisoes-arquiteturais-moderacao-e-seguranca.md](file:///c:/Users/danie/PROA/projetoDemoDay/Froravel-Front/.spec/decisoes-arquiteturais-moderacao-e-seguranca.md) para métricas de tempo de denúncias, pesos de risco e telemetria anti-brigading.

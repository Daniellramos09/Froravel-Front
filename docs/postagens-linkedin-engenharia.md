# Guia de Publicações Técnicas para o LinkedIn — Engenharia de Software Florável

> Este documento contém postagens completas, formatadas com ganchos de alto impacto, contexto de negócio, aprofundamento técnico (código, padrões de projeto, arquitetura) e hashtags estratégicas.
> 
> **Objetivo:** Destacar autoridade técnica em Engenharia de Software, System Design, Java/Spring Boot, Banco de Dados, Algoritmos, Segurança/LGPD e sensibilidade social na construção do ecossistema Florável.

---

## 📌 Índice de Publicações

1. [Post 1: System Design & FinTech — Split de Pagamento Nativo sem Bitributação](#post-1-system-design--fintech--split-de-pagamento-nativo-sem-bitributação)
2. [Post 2: Segurança & Algoritmos — Disjuntor de Emergência em Vídeo (Room Circuit Breaker)](#post-2-segurança--algoritmos--disjuntor-de-emergência-em-vídeo-room-circuit-breaker)
3. [Post 3: Modelagem de Banco — Por que eliminamos ENUMs e desacoplamos tabelas (ECA e LGPD)](#post-3-modelagem-de-banco--por-que-eliminamos-enums-e-desacoplamos-tabelas-eca-e-lgpd)
4. [Post 4: POO & SOLID no Spring Boot — Escala de Edimburgo com SRP e DIP](#post-4-poo--solid-no-spring-boot--escala-de-edimburgo-com-srp-e-dip)
5. [Post 5: LGPD & Estatística B2B — K-Anonimato (K ≥ 5) e a Muralha de Fogo no RH](#post-5-lgpd--estatística-b2b--k-anonimato-k--5-e-a-muralha-de-fogo-no-rh)
6. [Post 6: Performance de Banco & Latência — O mito das Stored Functions e o poder dos Índices B-Tree](#post-6-performance-de-banco--latência--o-mito-das-stored-functions-e-o-poder-dos-índices-b-tree)
7. [Post 7: UX Sensorial & Engenharia Empática — Como lidar com crises graves sem alarmismo](#post-7-ux-sensorial--engenharia-empática--como-lidar-com-crises-graves-sem-alarmismo)
8. [Post 8: Persistência Poliglota (SQL vs. NoSQL) — Por que o chat da chamada não vai para o MySQL](#post-8-persistência-poliglota-sql-vs-nosql--por-que-o-chat-da-chamada-não-vai-para-o-mysql)

---

### Post 1: System Design & FinTech — Split de Pagamento Nativo sem Bitributação

**Título/Gancho:**  
Como desenhar uma arquitetura de pagamentos que não quebre financeiramente uma startup de psicologia e comunidade? 💳💡

**Conteúdo:**
Quando uma mãe agenda uma sessão com uma psicóloga na Florável por R$ 100,00, a pior decisão técnica que poderíamos tomar seria receber os R$ 100,00 na conta da empresa e depois fazer um PIX de R$ 80,00 para a profissional.

Por quê? Porque isso cria o pesadelo tributário da **Bitributação**:
1. A plataforma pagaria imposto sobre uma receita bruta de R$ 100,00 (mesmo tendo ficado com apenas R$ 20,00).
2. A psicóloga parceira pagaria imposto novamente sobre os mesmos R$ 80,00.
3. Além de inviável contabilmente, o Conselho Federal de Psicologia (CFP) condena taxas predatórias (30% a 50%) sobre o trabalho do profissional de saúde mental.

**A Solução de Engenharia (Split de Pagamentos Nativo & Idempotência):**

No back-end Spring Boot, integramos o fluxo de split com gateways homologados pelo Banco Central (Asaas / Pagar.me):

* **Na Liquidação:** O gateway recebe o pagamento único da mãe e divide na hora:
  * R$ 80,00 creditados diretamente na subconta/carteira da psicóloga.
  * R$ 20,00 creditados na conta jurídica da Florável (nossa taxa fixa ética para custeio de tecnologia de vídeo e segurança).
* **Do ponto de vista fiscal:** A Florável emite Nota Fiscal de Serviços apenas sobre os R$ 20,00 da intermediação de software, e a psicóloga emite o recibo diretamente para a paciente sobre os R$ 80,00.

**O Desafio dos Webhooks e Idempotência:**
Sistemas de pagamento reenviam webhooks caso haja oscilações de rede. Para impedir que créditos fossem duplicados, aplicamos um controle estrito de idempotência no banco de dados:
* Chave única: `id_transacao_gateway VARCHAR(100) UNIQUE`.
* Se o gateway reenviar a mesma notificação, o serviço captura a colisão de chave ou valida o status prévio e responde `200 OK` de imediato, sem reprocessar regras financeiras.

E você, já teve que redesenhar o fluxo de pagamento do seu produto para evitar armadilhas tributárias? 

#SystemDesign #Fintech #Java #SpringBoot #EngenhariaDeSoftware #ArquiteturaDeSoftware #Backend

---

### Post 2: Segurança & Algoritmos — Disjuntor de Emergência em Vídeo (Room Circuit Breaker)

**Título/Gancho:**  
O que fazer quando uma usuária é ofendida durante uma reunião ao vivo por vídeo com 10 participantes? 🛑🎙️

**Conteúdo:**
Em salas de escuta e desabafo materno, a segurança psicológica não é um luxo: é requisito de vida. Mas moderação reativa (onde alguém denúncia e um moderador humano analisa 24 horas depois) não resolve quando um incidente está acontecendo **ao vivo no microfone**.

Para resolver isso na Florável, implementamos o padrão arquitetural do **Disjuntor de Emergência em Sala (*Room Circuit Breaker*)**.

**Como o Algoritmo Funciona:**

1. **Velocity Checks em Janela Deslizante:** Em vez de olhar apenas números absolutos, o sistema rastreia denúncias em uma janela móvel de tempo:
   * Critério de disparo: $\ge 3$ denúncias simultâneas (ou $\ge 30\%$ dos participantes presentes) no intervalo de até **2 minutos** contra o mesmo alvo.
2. **Hipótese de Incidente Real em Tempo Real:** O sistema não espera para investigar *brigading* (ataque coordenado); ele prioriza a integridade física e emocional do grupo.
3. **Corte Imediato de Mídia:**
   * Se o alvo for uma participante infratora: O back-end aciona a sinalização WebRTC, muta o microfone e desliga a câmera da usuária denunciada instantaneamente, isolando o fluxo de áudio/vídeo sem derrubar a sala para as outras 9 mães.
   * Se o alvo for uma psicóloga facilitadora: O sistema aciona um webhook de alerta crítico no plantão da coordenação clínica e oferece uma saída segura voluntária para as mães.
4. **Matchmaking Seguro (Anti-Reencontro):** Usuárias que sofreram denúncias com solicitação de bloqueio são automaticamente impedidas pelo algoritmo de caírem na mesma sala de conversa no futuro.

Segurança em tempo real exige algoritmos que ajam no segundo em que a dor acontece.

#TrustAndSafety #SystemDesign #WebRTC #Concorrencia #SegurançaDaInformação #Java #CleanCode

---

### Post 3: Modelagem de Banco — Por que eliminamos ENUMs e desacoplamos tabelas (ECA e LGPD)

**Título/Gancho:**  
Por que banimos o uso de `ENUM` nos nossos scripts SQL e como isso salvou o acolhimento a mães adolescentes? 🗄️⚡

**Conteúdo:**
Quem nunca viu uma tabela MySQL cheia de colunas `ENUM('OPCAO_A', 'OPCAO_B')`? Parece prático no início, mas em produção traz sérios problemas:
1. Adicionar um novo valor exige um `ALTER TABLE`, que em tabelas grandes com milhões de linhas pode travar a tabela (*table lock*) e derrubar a aplicação.
2. Dificulta migrações entre diferentes SGBDs (MySQL, PostgreSQL, H2 nos testes unitários).

Na Florável, definimos uma regra clara na nossa Constituição Arquitetural: **Zero ENUM no banco de dados**. O banco armazena `VARCHAR(50)` e a validação de domínio fica sob responsabilidade estrita da camada de aplicação Java (Spring Boot) e React.

**O Desafio do Acolhimento a Mães Adolescentes (13 a 17 anos):**

Outro desafio clássico de modelagem: como permitir que jovens mães de 14 a 17 anos usem a plataforma em conformidade com o ECA (Estatuto da Criança e do Adolescente) e a LGPD (Art. 14)?

* **A Solução Ruim:** Colocar colunas como `nome_responsavel`, `cpf_responsavel`, `parentesco_responsavel` diretamente na tabela `maes`. Isso criaria dezenas de colunas nulas para 95% das usuárias que já são adultas autônomas.
* **A Solução Desacoplada:** Criamos a tabela independente `responsaveis_legais` (relação 1:1 estrita apenas quando `idade < 18`).
* **Preservação do Sigilo (ECA Art. 17):** O responsável legal autoriza a entrada da jovem na plataforma via OTP WhatsApp, mas **não tem acesso aos relatos, rodas ou conversas da menor**. Isso garante segurança jurídica aos pais sem violar a intimidade e o acolhimento seguro da adolescente.

Modelagem de dados é muito mais do que normalização: é arquitetura de conformidade legal e respeito humano.

#Database #MySQL #SQL #LGPD #ECA #SpringBoot #DataModeling #CleanArchitecture

---

### Post 4: POO & SOLID no Spring Boot — Escala de Edimburgo com SRP e DIP

**Título/Gancho:**  
Como aplicar SOLID de verdade em um sistema de saúde perinatal sem criar código espaguete? ☕📐

**Conteúdo:**
Na Florável, as mães preenchem a Escala de Depressão Pós-Parto de Edimburgo (EPDS), um questionário de 10 perguntas validado clinicamente pela OMS.

Uma abordagem comum (e perigosa) seria jogar toda a regra de cálculo, validações e persistência dentro de um único `Service` de 800 linhas.

Para manter o código manutenível e extensível, aplicamos dois princípios fundamentais do SOLID:

1. **SRP (Single Responsibility Principle):**
   * Separamos o cálculo clínico da persistência.
   * Criamos o componente especializado `CalculadoraRiscoEdimburgo`, cujo único propósito é validar duplicidades de perguntas, somar os escores de risco e acionar o gatilho da **Questão #10** (que avalia ideação de autoagressão).
2. **DIP (Dependency Inversion Principle):**
   * O serviço `TriagemService` não depende de uma classe concreta de cálculo; ele depende da interface `CalculadoraRiscoTriagem`.
   * Se no futuro quisermos integrar a escala PHQ-9 ou GAD-7, basta plugar uma nova implementação sem tocar em uma linha de código da camada de persistência.

**Resultado Prático:**
Uma suíte de **32 testes automatizados** com Mockito e JUnit 5 que roda em menos de 30 segundos, testando cenários de estresse, gatilhos de urgência e validações de borda com 100% de sucesso.

Design patterns e princípios SOLID não são teoria acadêmica: são o que mantém o sistema resiliente quando a complexidade de negócio cresce.

#Java #SpringBoot #SOLID #DesignPatterns #CleanCode #OOP #BackendDevelopment

---

### Post 5: LGPD & Estatística B2B — K-Anonimato (K ≥ 5) e a Muralha de Fogo no RH

**Título/Gancho:**  
Como vender uma plataforma de bem-estar emocional para empresas sem expor a intimidade das funcionárias? 🏢🔒

**Conteúdo:**
No Brasil, quase 50% das mulheres são demitidas ou pedem desligamento nos primeiros 24 meses após a licença-maternidade. A Florável Empresas oferece licenças corporativas para gestantes e puérperas como benefício de retenção de talentos e apoio à maternidade.

Mas aqui existe um dilema ético e legal gravíssimo:
* A empresa paga a conta do benefício.
* Mas o RH **NÃO PODE** ter acesso a diagnósticos, pontuações de depressão pós-parto ou saber quem procurou terapia individual. Isso configuraria discriminação velada no ambiente de trabalho e infração gravíssima da LGPD.

**A Engenharia da Muralha de Fogo:**
1. **Desacoplamento de Domínio:** As tabelas corporativas (`empresas`, `licencas_colaboradoras`) são totalmente isoladas das tabelas clínicas (`triagem_edimburgo`, `denuncias`). O gestor de RH nunca recebe chaves estrangeiras ou identificadores de saúde.
2. **K-Anonimato Estatístico ($K \ge 5$):**
   * Imagine uma empresa onde o setor "Design" tem apenas 2 colaboradoras. Se o gráfico do RH mostrar "50% do Design está com alto risco de esgotamento", o gestor adivinha na hora quem é a colaboradora.
   * **O Algoritmo:** Nosso back-end avalia o tamanho da amostra por departamento. Se o setor tiver **menos de 5 colaboradoras ativas**, ele é ocultado individualmente e somado no **"Índice Geral da Empresa"**.

Dessa forma, o RH obtém métricas macro para criar políticas de creche e horários flexíveis, e a colaboradora mantém seu sigilo 100% resguardado.

#LGPD #Privacidade #DataPrivacy #KAnonymity #B2B #HRTech #SoftwareEngineering

---

### Post 6: Performance de Banco & Latência — O mito das Stored Functions e o poder dos Índices B-Tree

**Título/Gancho:**  
"Vamos colocar regras de busca em Stored Functions no banco para ficar mais rápido?" Cuidado com essa armadilha. ⚠️⚡

**Conteúdo:**
Ao discutir otimização de banco de dados, é comum ouvir: *"Se colocarmos a lógica dentro do banco de dados via Stored Procedure ou Function, fica mais rápido porque roda direto no motor do MySQL"*.

Na prática, isso costuma ser um tiro no pé por três razões fundamentais:
1. **Invalidação de Índices:** Quando você passa um campo por uma função customizada dentro de uma cláusula `WHERE`, o otimizador de queries do banco quase sempre descarta os índices em árvore B-Tree e faz um *Full Table Scan* (lê todas as linhas do disco).
2. **Gargalo de CPU:** Escalar o banco de dados verticalmente (mais RAM e CPU na máquina do banco) custa até 10x mais caro do que escalar servidores de aplicação Java horizontalmente.
3. **Observabilidade:** Stored procedures são difíceis de testar em suítes de CI/CD e não geram traces de telemetria transparentes como o Spring Boot.

**O que realmente reduz o TTFB (Time to First Byte) para menos de 15ms:**
* **Co-locação de Serviços:** Manter o Spring Boot e o MySQL na mesma região/VPC reduz a latência de tráfego de rede de 120ms para menos de 2ms.
* **Índices Compostos:** Indexar colunas que são filtradas e ordenadas em conjunto (ex: `(status, data_hora_inicio)`).
* **Collation Certa:** Usar `utf8mb4_0900_ai_ci` dispensa funções como `LOWER()` ou `UPPER()` nas queries, pois a busca já é nativamente insensível a maiúsculas e acentos.
* **Cache em Memória:** Usar `@Cacheable` no Spring para que consultas estáticas respondam direto da memória RAM sem sequer tocar no disco do MySQL.

Menos mágica no banco, mais arquitetura sólida na engenharia.

#Database #Performance #MySQL #Optimization #SpringBoot #HighPerformance #Backend

---

### Post 7: UX Sensorial & Engenharia Empática — Como lidar com crises graves sem alarmismo

**Título/Gancho:**  
Como o código do seu aplicativo lida com uma mãe em sofrimento emocional agudo? 🌸💚

**Conteúdo:**
No ecossistema da Florável, a **Questão #10** da Escala de Edimburgo pergunta se a mãe teve pensamentos de autoagressão nos últimos dias.

Se a pontuação for maior que zero, o back-end aciona imediatamente o **Protocolo de Crise Aguda**. Mas aqui a Engenharia de Software precisa andar de mãos dadas com a Psicologia e o Design de Interação.

**O que NÃO fazer em uma interface de acolhimento:**
* ❌ Sirenes animadas piscando na tela.
* ❌ Cores vermelhas berrantes ou mensagens punitivas do tipo *"ALERTA DE RISCO DE SUICÍDIO"*.
* ❌ Formulários longos exigindo digitação de quem está chorando ou exausta.

Isso só gera pânico, culpa puerperal e o medo terrível de perder a guarda do filho.

**A Engenharia Empática da Florável:**
* **UX Sem Julgamento:** A paleta muda suavemente para um verde-oliva profundo e acolhedor (`#18221B`), com mensagens de validação e alívio em primeira pessoa.
* **Atalhos de 1 Toque (Zero Fricção):**
  * Discagem direta para o **CVV (188)**.
  * Link direto para o **Chat Online Silencioso do CVV** (essencial para mães que estão amamentando no quarto escuro com o parceiro ou família por perto e não podem falar em voz alta).
  * **"Anjo da Guarda" (Rede de Afeto):** Disparo de mensagem carinhosa para o contato de confiança cadastrado (*"A Mariana está precisando de um abraço agora"*) **sem expor nenhum diagnóstico ou nota do teste (garantia LGPD)**.

Engenharia de software não é só entregar features; é sobre o impacto humano e a responsabilidade social do código que colocamos no ar.

#UX #HumanCenteredDesign #MentalHealth #SaudeMaterna #Frontend #React #ImpactoSocial #TechForGood

---

### Post 8: Persistência Poliglota (SQL vs. NoSQL) — Por que o chat da chamada não vai para o MySQL

**Título/Gancho:**  
Por que gravar as mensagens do chat de uma chamada de vídeo em um banco relacional (MySQL) pode ser um erro duplo de performance e de privacidade? 💬🗄️

**Conteúdo:**
Ao projetar o chat ao vivo das Rodas de Conversa da Florável, surgiu uma decisão clássica de *System Design*: devemos criar uma tabela `mensagens_chat` no MySQL ou tratar o chat em uma camada NoSQL / In-Memory?

A resposta está no conceito de **Persistência Poliglota (*Polyglot Persistence*)**: usar a ferramenta certa para a natureza de cada dado.

**1. Onde o Relacional (MySQL 8.0) é imbatível na Florável:**
* Dados financeiros de Split de Pagamento (`transacoes_pagamento`), vínculos de `responsaveis_legais` (ECA/LGPD), licenças corporativas de RH e triagens da Escala de Edimburgo exigem **consistência transacional estrita (ACID)** e integridade referencial.

**2. Por que o Chat da Roda Ao Vivo pede uma abordagem In-Memory / NoSQL:**
* **Padrão *Write-Heavy* e Latência Sub-Milissegundo:** Em uma sala ao vivo com mães enviando mensagens, reações e eventos de presença simultaneamente, fazer `INSERT` transacional em disco no banco relacional cria contenção desnecessária.
* **Privacy by Design & Efemeridade (TTL Nativo):** Uma mãe que desabafa no chat durante uma roda de vídeo precisa ter a segurança psicológica de que aquela conversa é **efêmera** (como no Google Meet) e não ficará eternamente arquivada em um prontuário.
* **Autodestruição Pós-Sessão:** Operando o chat em estrutura concorrente em memória (evoluindo para Redis / NoSQL com *Time-To-Live* nativo em escala), as mensagens existem apenas durante o ciclo de vida da reunião e são destruídas ao encerrar a sala, sem custo de comandos `DELETE` em disco e com 100% de respeito ao sigilo materno.

Escolher entre SQL e NoSQL não é sobre "qual banco está na moda", mas sobre entender o ciclo de vida, a garantia ACID e a privacidade de cada dado do seu domínio.

#SystemDesign #NoSQL #MySQL #Redis #ArquiteturaDeSoftware #PrivacyByDesign #LGPD #BackendEngineering


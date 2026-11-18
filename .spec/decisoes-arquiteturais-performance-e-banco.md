# Decisões Arquiteturais: Performance de Banco, Otimização de Consultas e Latência

> **Data de Registro:** 18 de Novembro de 2026  
> **Status:** Aprovado e Vigente  
> **Área:** Engenharia de Dados / Performance de Banco / Otimização de Consultas / Infraestrutura

---

## 1. Diretriz de Infraestrutura: Co-locação de Serviços (Zero Latência de Rede)
* **O Problema do RTT (Round Trip Time):** Se o back-end Spring Boot estiver hospedado em uma região diferente do banco MySQL (ex: US-East vs. SA-East), cada requisição acumula de 100ms a 150ms de latência pura de rede no transporte de pacotes TCP.
* **Solução Homologada:**
  * O back-end Java e o banco MySQL devem ser hospedados no **mesmo datacenter e mesma região de nuvem** (ou na mesma VPC / rede interna privada).
  * **Meta de Latência:** RTT interno inferior a **2 milissegundos**.

---

## 2. Abordagem para Regras de Negócio e Funções no Banco
* **Decisão:** Não utilizar *Stored Functions* ou *Stored Procedures* dentro do MySQL para processar filtros de busca.
* **Motivação Arquitetural:**
  1. **Invalidação de Índices:** O uso de funções escalares personalizadas em cláusulas `WHERE` impede o otimizador do MySQL de utilizar os índices em árvore B-Tree, forçando *Full Table Scans*.
  2. **Escalabilidade e Custos:** A CPU do banco de dados é um recurso caro e de escala vertical restrita. O poder computacional deve residir nos nós de aplicação (Spring Boot), que escalam horizontalmente e sem estado (*stateless*).
  3. **Manutenibilidade:** Lógica em Java permite testes unitários rigorosos (JUnit 5/Mockito) e versionamento contínuo em Git.

---

## 3. Estratégias Ativas de Otimização no MySQL

### 3.1. Índices Compostos Estratégicos (B-Tree $O(\log N)$)
* Para filtros frequentes que combinam status e ordenação temporal, aplicar índices compostos cobrindo a ordenação:
  * `rodas_de_conversa (status, data_hora_inicio)`
  * `denuncias (denunciado_usuario_id, data_denuncia)`
  * `licencas_colaboradoras (empresa_id, status)`

### 3.2. Busca Textual Otimizada via `FULLTEXT`
* Proibição de consultas do tipo `LIKE '%termo%'` em campos de texto livre com grande volume de dados.
* Para busca de temas em rodas e bibliotecas, aplicar índice `FULLTEXT` com operador nativo `MATCH(...) AGAINST(...)`, garantindo respostas em sub-milissegundos.

### 3.3. Collation Nativa Case & Accent Insensitive
* O banco utiliza `utf8mb4_0900_ai_ci`.
* Por ser nativamente insensível a maiúsculas/minúsculas e acentos (`ai` = accent insensitive, `ci` = case insensitive), não há necessidade de chamar funções de transformação como `LOWER()` ou `UPPER()` nas queries, preservando o uso pleno dos índices.

---

## 4. Otimizações na Camada de Aplicação (Spring Boot)

### 4.1. Paginação Mandatória no Banco (`Pageable`)
* Todas as rotas de listagem para o cliente móvel devem usar paginação nativa do Spring Data JPA (`Pageable`), delegando o particionamento `LIMIT` e `OFFSET` ao MySQL.

### 4.2. Cache em Memória para Leituras Frequentes (`@Cacheable`)
* Informações de alta leitura e baixa mutabilidade (catálogo de planos, lista de temas recomendados e especialidades de psicólogas) são cacheadas em memória RAM na JVM, evitando viagens repetitivas ao banco de dados e respondendo em tempo $< 1\text{ms}$.

### 4.3. Connection Pooling com HikariCP
* Uso do HikariCP com conexões pré-aquecidas, eliminando o *overhead* de abertura e fechamento de conexões TCP a cada requisição HTTP.

---

## 5. Métricas de Observabilidade (SLAs de Performance)
1. **TTFB (Time to First Byte):** Meta $< 150\text{ms}$ para requisições B2C no aplicativo móvel.
2. **Tempo Máximo de Query:** Nenhuma consulta em produção deve exceder **50ms** no *Slow Query Log*.
3. **Eficiência de Varredura:** Proporção *Rows Examined* / *Rows Sent* próxima de $1:1$ nas consultas indexadas.

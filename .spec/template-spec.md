# [Nome da Feature / Módulo] — Especificação Técnica

## 1. O Quê e Por Quê (Visão de Produto)
* **Objetivo:** [Descreva o problema que a funcionalidade resolve]
* **Usuário Impactado:** [Mãe / Psicóloga / RH Empresa]
* **Critério de Sucesso:** [O que define que essa feature está concluída com sucesso]

---

## 2. Contratos & Modelo de Dados
* **Tabelas Envolvidas:** [Nome das tabelas no MySQL sem ENUMs]
* **Endpoints REST:**
  * `POST /api/...` -> [Descrição, Payload Request, Response]
  * `GET /api/...` -> [Descrição, Query Params, Response]

---

## 3. Regras de Negócio Críticas & Casos de Borda
1. [Regra 1 - Ex: Validação de antecedência mínima ou limites]
2. [Regra 2 - Ex: Tratamento quando o recurso estiver lotado ou indisponível]
3. [Regra 3 - Ex: Política de privacidade e anonimização]

---

## 4. Plano de Tarefas (tasks.md)
- [ ] 1. Criar entidade JPA e Repository no domínio correspondente
- [ ] 2. Implementar DTOs de Request e Response com Bean Validation (`@Valid`)
- [ ] 3. Criar Service com as regras de negócio e testes unitários
- [ ] 4. Criar Controller REST com semântica HTTP padronizada
- [ ] 5. Conectar no Front-end (React/Tailwind) respeitando o Design System

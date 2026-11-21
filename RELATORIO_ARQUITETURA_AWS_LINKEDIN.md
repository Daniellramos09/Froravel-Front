# 🌸 Florável: Arquitetura em Nuvem AWS & Engenharia de Software no Proa Demo Day

> **Como construímos e colocamos em produção um ecossistema completo de saúde mental materna conectando Vercel, AWS EC2, S3 e Serverless Lambda com alta performance e custo estritamente controlado.**

---

## 🎯 O Desafio
O **Florável** nasceu com a missão de oferecer acolhimento e suporte à saúde mental materna (triagem EPDS, rodas de conversa, prontuário seguro e agendamento psicológico). 

Para o nosso **Demo Day no Instituto PROA**, o objetivo foi levar o projeto para além do ambiente local (`localhost`) e conceber uma **arquitetura de microsserviços em nuvem resiliente, desacoplada, segura e pronta para produção**, respeitando um teto orçamentário rígido de **$50** em ambiente educacional de laboratório (**AWS Academy / Learner Lab**).

---

## 🏗️ Arquitetura da Solução

O ecossistema Florável opera sob um modelo híbrido e desacoplado:

```
[ Usuárias / Mães / Psicólogos ]
               │
               ▼
   [ Vercel Edge Global CDN ]
   ├─ App Mãe (floravel-mae.vercel.app)
   ├─ App Psicólogo (floravel-psi.vercel.app)
   ├─ App Admin (floravel-admin.vercel.app)
   └─ Landing Page Institucional
               │
               ▼ (HTTPS / REST API)
   [ AWS EC2 - Ubuntu 24.04 LTS (t3.small) ]
   ├─ Spring Boot 3.4.3 (Java 21) executando via systemd
   ├─ Banco de Dados MySQL 8.0 local otimizado (zero latência de rede)
   └─ Segurança: Spring Security + JWT Stateless + CORS dinâmico
               │
               ├─────────────────────────┐
               ▼ (Upload assíncrono)     ▼ (Disparo de eventos não-bloqueantes)
   [ AWS S3 - floravel-media ]   [ AWS Lambda - Python 3.12 ]
   └─ Armazenamento de avatares    ├─ Worker Serverless desacoplado
      e comprovantes clínicos      ├─ Disparo assíncrono de e-mails (SMTP)
                                   └─ Observabilidade via AWS CloudWatch
```

---

## 💡 Principais Decisões de Engenharia & Desafios Superados

### 1. Arquitetura Serverless Orientada a Eventos (AWS Lambda + Java SDK)
* **O Problema:** Enviar e-mails de confirmação e códigos de segurança de forma síncrona dentro da API principal bloqueava as threads do Spring Boot por 1 a 3 segundos por requisição, tornando o sistema vulnerável a travamentos e picos de acesso.
* **A Solução:** Implementamos um **Serverless Worker** em Python na AWS Lambda (`floravel-enviar-email-notificacao`). A API Spring Boot despacha uma chamada assíncrona (`InvocationType.EVENT`) em menos de 5ms. A Lambda cuida da conexão SMTP com o Google, do layout HTML e da entrega dos códigos de 6 dígitos, permitindo que a API principal continue atendendo requisições com latência mínima.

### 2. Otimização de Custos e Contorno de Limitações de Laboratório (FinOps)
* **Ambiente AWS Academy:** Restrições rígidas impediam criação de roles IAM personalizadas (`iam:CreateRole`), instâncias de RDS com alta retenção de crédito e limitavam a operação exclusivamente à região de **Norte da Virgínia (`us-east-1`)**.
* **Engenharia de Custo:**
  - Adotamos a `LabRole` pré-configurada para os serviços Serverless.
  - Co-localizamos o MySQL 8.0 diretamente dentro da instância EC2 `t3.small` com `systemd`, reduzindo a zero a latência de tráfego inter-zonas e mantendo o custo total projetado em menos de **$6 dos $50 disponíveis para 11 dias contínuos**.
  - Configuração do bucket S3 com CORS refinado e políticas de leitura pública para mídias institucionais.

### 3. Integração Contínua e Monorepo Frontend na Vercel
* Monorepo com 4 aplicações independentes (Mãe, Psicólogo, Admin e Institucional) compartilhando design tokens, tipografia fluida e utilitários de roteamento (`packages/shared`).
* Pipeline de build com validação de tipagem, linting e integração automática com a API em nuvem na AWS via variáveis de ambiente centralizadas.

### 4. Segurança e LGPD
* Autenticação Stateless baseada em **Tokens JWT** com controle de autorização baseado em papéis (`ROLE_MAE`, `ROLE_PSICOLOGO`, `ROLE_ADMIN`).
* Criptografia em trânsito (HTTPS/TLS) e proteção de senhas via **BCrypt**.
* Sanitização de logs no CloudWatch e separação rígida de credenciais sensíveis via variáveis de ambiente.

---

## 📊 Resultados Alcançados
- ✅ **100% dos testes unitários e de integração aprovados** (87/87 testes em JUnit 5 e Mockito).
- ✅ **Zero downtime**: Serviço Spring Boot gerenciado via daemon Linux (`systemd`) com auto-restart em caso de falha.
- ✅ **Comunicação em tempo real**: Confirmações de verificação entregues com sucesso na caixa de entrada do Gmail em menos de 2 segundos.
- ✅ **Experiência do Usuário (UX)**: 4 frentes web publicadas globalmente e integradas ao backend na nuvem.

---

## 📝 Modelo de Publicação para o LinkedIn (Pronto para Copiar e Colar)

```markdown
🚀 Do localhost para a Nuvem AWS: Como arquitetei a infraestrutura em produção do Florável para o Demo Day do Instituto PROA!

Construir uma aplicação web é desafiador, mas colocá-la em produção com boas práticas de engenharia de software e observabilidade é onde a verdadeira jornada começa.

No desenvolvimento do Florável — plataforma de apoio e acolhimento à saúde mental materna —, desenhei e implementei uma arquitetura em nuvem híbrida e desacoplada:

🔹 Frontend na Vercel: 4 aplicações web (App Mãe, App Psicólogo, Painel Admin e Landing Page) alimentadas por um monorepo com Edge CDN global.
🔹 Backend na AWS EC2: API robusta em Java 21 / Spring Boot 3 gerenciada via serviço Linux persistente (systemd) e banco de dados MySQL otimizado.
🔹 Armazenamento na AWS S3: Gestão de mídias e documentos clínicos em bucket na nuvem com políticas de CORS seguras.
🔹 Arquitetura Serverless com AWS Lambda: Worker assíncrono em Python para disparo de e-mails de verificação de conta. Com isso, a API principal despacha eventos sem travar threads, garantindo latência ultrabaixa para os usuários.
🔹 FinOps & Segurança: Infraestrutura 100% dentro dos limites do AWS Academy ($50 de teto), com autenticação JWT stateless, segurança em trânsito e conformidade com a LGPD.

O resultado? 87 testes unitários/integrados aprovados, e-mails de verificação chegando em segundos na caixa de entrada e um ecossistema pronto para escalar!

Gostaria de agradecer ao Instituto PROA, aos mentores e aos meus colegas de time por todo o apoio nessa jornada. O Demo Day está chegando! 🌸✨

#Java #SpringBoot #AWS #CloudComputing #Serverless #Lambda #DevOps #Vercel #SoftwareEngineering #TechForGood #Proa #DemoDay
```

---

*Documento gerado e catalogado no projeto Florável. Parabéns pelo empenho e sucesso no Demo Day!* 🚀

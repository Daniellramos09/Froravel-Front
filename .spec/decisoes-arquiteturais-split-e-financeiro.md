# Decisões Arquiteturais: Engenharia Financeira, Split de Pagamentos e Sustentabilidade Ética

> **Data de Registro:** 18 de Novembro de 2026  
> **Status:** Aprovado e Vigente  
> **Área:** Financeiro / Compliance Tributário / Ética Profissional (CFP) / Arquitetura Back-End

---

## 1. O Modelo de Negócio da Florável

A sustentabilidade da plataforma repousa sobre dois pilares:
1. **Plano Florável Plus (R$ 80,00/mês):**
   * Acesso ilimitado às rodas de conversa temáticas.
   * 1 sessão individual com psicóloga inclusa no ciclo mensal.
   * Acesso prioritário a conteúdos educativos e mural da comunidade.
2. **Consultas Individuais Avulsas / Sociais:**
   * Modelo com valor social acessível pago pela mãe por encontro individual.
   * **Taxa de Retenção da Plataforma (Take Rate Ético):** Retenção de apenas **R$ 15 a R$ 20 por consulta** (ou ~5% de taxa operacional), destinada 100% aos custos de infraestrutura de vídeo in-app, segurança, moderação e impostos.

---

## 2. A Blindagem Fiscal: O Fim da Bitributação via Split Nativo

### 2.1. O Problema da Bitributação
* **Modelo Proibido (Centralizado):** A mãe paga R$ 100 para a Florável; a Florável paga imposto sobre R$ 100 (mesmo faturando apenas R$ 20) e depois transfere R$ 80 para a psicóloga (que é tributada novamente). Esse modelo gera margem negativa e risco contábil grave.

### 2.2. A Solução Técnica: Split de Pagamento Automatizado
* O sistema utiliza gateways brasileiros homologados pelo Banco Central com funcionalidade de **Split de Pagamento** (ex.: Asaas, Pagar.me/Stone ou Stripe Connect).
* No momento da cobrança (PIX ou Cartão em pagamento único pela mãe):
  * **R$ 80,00** são creditados diretamente na subconta/carteira da Psicóloga parceira.
  * **R$ 20,00** são creditados na conta jurídica da Florável.
* **Impacto Tributário:**
  * A Florável emite Nota Fiscal de Serviços apenas sobre o valor da intermediação de software (**R$ 20,00**).
  * A psicóloga emite recibo/nota de serviços profissionais de psicologia diretamente para a paciente sobre o valor de seus honorários (**R$ 80,00**).

---

## 3. Conformidade com o Conselho Federal de Psicologia (CFP)
* O CFP condena práticas de plataformas de telepsicologia que cobram percentuais escorchantes (30% a 50%) sobre o trabalho do psicólogo.
* A Florável adota transparência ativa: a taxa da plataforma é fixa e simbólica para custeio de tecnologia e link seguro de vídeo, garantindo a dignidade financeira da profissional parceira.

---

## 4. Engenharia de Back-End: Webhooks, Idempotência e Estornos

### 4.1. Processamento Assíncrono via Webhooks
* Rota dedicada: `/api/pagamentos/webhook`.
* Validação obrigatória da assinatura criptográfica (`X-Webhook-Signature`) do gateway antes de processar qualquer payload.

### 4.2. Idempotência Rigorosa
* Toda notificação de pagamento armazena o `id_transacao_gateway`.
* Se o gateway reenviar a mesma mensagem por instabilidade de rede, o banco identifica a duplicidade e responde `200 OK` sem duplicar agendamentos ou créditos.

### 4.3. Política de Cancelamento e Estornos
* **Cancelamento com Antecedência (> 2 horas):** O back-end aciona o endpoint de estorno (*refund*) do gateway, devolvendo 100% do valor para a mãe e cancelando o split sem prejuízo para nenhuma das partes.
* **Cancelamento Tardio (< 2 horas):** O sistema impede o estorno automático para remunerar a psicóloga pela reserva daquele horário em sua agenda.

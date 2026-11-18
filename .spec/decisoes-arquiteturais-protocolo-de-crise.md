# Decisões Arquiteturais: Protocolo de Crise Aguda, Suporte Imediato e Questão #10 (EPDS)

> **Data de Registro:** 18 de Novembro de 2026  
> **Status:** Aprovado e Vigente  
> **Área:** Saúde Clínica / Segurança de Vida / UX Sensorial / Compliance Legal

---

## 1. Escopo de Responsabilidade da Plataforma
* **Natureza do Serviço:** A Florável é uma comunidade de apoio mútuo entre mães e plataforma de conexão psicológica. **NÃO É** um pronto-socorro psiquiátrico nem serviço de resgate emergencial 24h.
* **Salvaguarda Legal nos Termos de Uso:** Deve constar de forma clara e visível que situações de emergência médica e risco de vida iminente devem ser encaminhadas aos canais oficiais de saúde e resgate públicos (**CVV 188**, **SAMU 192** e UPAs locais).

---

## 2. O Gatilho da Questão #10 da Escala de Edimburgo (EPDS)

A Questão #10 avalia ideação de autoagressão:  
> *"A ideia de fazer mal a mim mesma me ocorreu nos últimos 7 dias."*

* **Regra de Negócio no Back-End:**
  * Se `numero_questao == 10` e `valor_resposta > 0` (qualquer resposta diferente de "Não, nunca"):
    * O cálculo automático define obrigatoriamente: `nivel_risco = 'ALTO'`.
    * O flag booleano `alerta_urgente = true` é ativado.
    * A resposta da API aciona no Front-end a substituição imediata da tela padrão pelo **Fluxo de Acolhimento Emergencial**.

---

## 3. Diretrizes de UX/UI para a Tela de Crise (Design sem Julgamento)

1. **Proibição de Sirenes e Alarmismo Visual:**
   * É estritamente proibido o uso de vermelhos estridentes, sirenes animadas ou textos punitivos (ex: *"ALERTA DE RISCO DE SUICÍDIO"*), pois isso intensifica o sentimento de culpa puerperal e o pânico de perder a guarda do filho.
2. **Linguagem Calorosa e Empática:**
   * Textos em primeira pessoa focados em alívio e validação: *"Mariana, respire fundo. Essa dor e esse peso têm acolhimento. Você não é uma mãe ruim e você não está sozinha."*
3. **Cores Suaves:**
   * Utilização de paletas relaxantes (verde oliva profundo `#18221B`, tons de lavanda e creme acolhedor).

---

## 4. Atalhos de Ação de 1 Clique (Zero Fricção)

A tela de crise deve conter botões diretos sem exigir digitação da usuária:

* **Discagem Direta CVV 188 (`tel:188`):** Ligação gratuita e anônima 24h para o Centro de Valorização da Vida.
* **Chat Online Silencioso do CVV (`https://www.cvv.org.br/chat/`):** Essencial para mães que estão no quarto amamentando ou com familiares próximos e não podem falar em voz alta ao telefone.
* **Discagem de Emergência SAMU 192 (`tel:192`):** Para situações de crise física aguda.

---

## 5. O Recurso do "Contato de Confiança" (Anjo da Guarda)
* Cadastro voluntário nas configurações de perfil de 1 contato próximo da mãe (mãe, irmã, amiga, companheiro).
* Em momentos de crise grave, o sistema oferece a opção de enviar uma mensagem carinhosa automática para a pessoa:
  > *"Olá [Nome do Contato], a [Nome da Mãe] está precisando de um abraço carinhoso agora. Você pode mandar uma mensagem para ela?"*
* **Privacidade Absoluta (LGPD):** O sistema **não revela diagnósticos, notas ou que a mãe fez um teste de depressão**, mobilizando apenas a rede de afeto real no mundo físico.

---

## 6. Interceptação Prévia no Mural da Comunidade (Anti-Contágio)
* O motor de moderação assíncrona rastreia palavras-chave e intenções de despedida ou ideação explícita em postagens do mural.
* **Ação do Sistema:**
  1. A postagem não se torna pública (evita o efeito contágio e comentários desastrados de terceiros).
  2. A interface da autora é imediatamente direcionada para a tela de Acolhimento Emergencial e suporte do CVV.

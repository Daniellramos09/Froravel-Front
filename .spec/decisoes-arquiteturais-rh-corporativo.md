# Decisões Arquiteturais: RH Corporativo (B2B), Sigilo da Colaboradora e K-Anonimato

> **Data de Registro:** 18 de Novembro de 2026  
> **Status:** Aprovado e Vigente  
> **Área:** Modelo de Negócio B2B / Compliance Trabalhista / LGPD / Estatística Segura

---

## 1. A Proposta de Valor Corporativa (B2B)
* **O Problema de Negócio:** No Brasil, quase 50% das mulheres são desligadas ou pedem demissão em até 24 meses após a licença-maternidade. A substituição de uma profissional qualificada custa de 1,5x a 3x seu salário anual.
* **A Solução Florável Empresas:** As empresas contratam licenças corporativas do Plano Plus para colaboradoras gestantes e puérperas como benefício de saúde emocional, combatendo o turnover, o burnout e melhorando métricas de ESG.

---

## 2. A Diretriz Sagrada: O Sigilo Absoluto da Colaboradora

### 2.1. O Conflito de Interesses B2B
* **Princípio:** A empresa paga a conta do benefício, mas a trabalhadora possui **direito inegociável à privacidade de seus dados de saúde mental**.
* **Impacto:** O RH **NUNCA** pode ter acesso a diagnósticos, pontuações na Escala de Edimburgo, temas individuais de desabafo ou nomes de quem marcou consulta psicológica. Qualquer vazamento configuraria discriminação trabalhista velada e violação gravíssima da LGPD.

### 2.2. A "Muralha de Fogo" de Dados no Back-End
* As tabelas corporativas (`empresas`, `gestores_rh`, `licencas_colaboradoras`, `faturas_empresa`) são completamente desacopladas das tabelas de acolhimento clínico (`triagem_edimburgo`, `feedbacks_reuniao`, `denuncias`).
* O Gestor de RH possui acesso restrito ao endpoint `/api/rh/...`, que nunca expõe chaves estrangeiras ou identificadores de triagem das colaboradoras.

---

## 3. Anonimização Estatística e K-Anonimato ($K \ge 5$)

Para impedir que colaboradoras de departamentos pequenos sejam identificadas por eliminação lógica:

* **Regra de Amostra Mínima:** Relatórios segmentados por departamento só são renderizados se o setor contar com no mínimo **5 colaboradoras ativas** cadastradas.
* **Agrupamento Automático:** Departamentos com menos de 5 colaboradoras têm seus dados agregados compulsoriamente no **"Índice Geral da Empresa"**, protegendo o anonimato de minorias em equipes reduzidas.

---

## 4. Métricas Permitidas no Dashboard do RH

| Métrica | Finalidade para o RH |
| :--- | :--- |
| **Taxa de Adesão (%)** | Medir a eficácia do investimento e quantas licenças corporativas estão sendo utilizadas. |
| **Distribuição de Temas Agregados** | Identificar necessidades coletivas macroeconômicas (ex: 40% das colaboradoras buscam rodas sobre *"Retorno ao Trabalho"*, incentivando a criação de creches corporativas ou jornadas flexíveis). |
| **NPS / Satisfação do Benefício** | Avaliar a qualidade das rodas de conversa e dos encontros na percepção coletiva das mães. |
| **Gestão de Licenças e Faturas** | Enviar convites, acompanhar licenças pendentes/ativadas e efetuar o pagamento das mensalidades B2B. |

---

## 5. Fluxo de Convite e Ativação com Token Seguro

1. O gestor cadastra na plataforma: `Nome`, `E-mail Corporativo` e `Departamento`.
2. O sistema gera um `token_convite` criptografado único com expiração em 30 dias.
3. A funcionária recebe o convite no e-mail corporativo com um link de ativação.
4. **Independência de Conta:** Ao se cadastrar, a colaboradora pode vincular a conta ao seu **e-mail pessoal**, garantindo que, caso venha a se desligar da empresa no futuro, mantenha a titularidade e o acesso comunitário à Florável.
5. A licença é marcada como `status = 'ATIVADA'` e o RH apenas visualiza o número de licenças em uso aumentarem, sem rastrear horários de consultas individuais.

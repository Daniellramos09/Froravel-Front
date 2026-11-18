# Decisões Arquiteturais: Moderação da Comunidade, Canal de Denúncias e Proteção em Tempo Real

> **Data de Registro:** 18 de Novembro de 2026  
> **Status:** Aprovado e Vigente  
> **Área:** Confiança & Segurança (Trust & Safety) / Moderação / Tempo Real

---

## 1. Dois Ambientes com Estratégias Distintas de Moderação

| Ambiente | Característica | Mecanismo de Proteção |
| :--- | :--- | :--- |
| **Comunidade & Mural** | Assíncrono (textos, relatos e depoimentos) | **Filtro Prévio Inteligente:** Bloqueio de ofensas antes de publicar. Detecção de gatilhos de autoagressão com acolhimento automático (CVV 188). Anonimização visual obrigatória de nomes ("Mariana S."). |
| **Rodas de Conversa** | Síncrono (Vídeo e áudio ao vivo) | **Controle da Facilitadora + Disjuntor Automatizado:** Mutar/expulsar pela psicóloga e denúncia silenciosa in-call pelas participantes. |

---

## 2. Análise de Velocidade e Taxa de Incidência (Velocity Checks)
* **Regra de Cálculo:** O sistema não analisa números absolutos soltos, mas sim **taxa de frequência dentro de janelas de tempo deslizantes**:
  * **Janela Curta (7 dias):** Detecta crises agudas ou comportamento abusivo repentino.
  * **Janela Média (30 dias):** Detecta desvio padrão e reincidência.
  * **Proporção:** Denúncias ponderadas pelo número de encontros/atendimentos realizados no período.
* **Pesos de Severidade:**
  * *Peso 1 (Leve):* Comentário ríspido ou atrito pontual.
  * *Peso 3 (Moderado):* Julgamento moral depreciativo sobre maternidade ou invasão de privacidade.
  * *Peso 5 (Crítico):* Agressão verbal, assédio, quebra de sigilo ou conduta antiética.

---

## 3. Disjuntor de Emergência em Sala Ao Vivo (*Room Circuit Breaker*)

Quando múltiplos participantes acionam o botão de denúncia simultaneamente na mesma sala:

* **Critério de Acionamento:** $\ge 3$ denúncias (ou $\ge 30\%$ dos participantes presentes) no intervalo de até **2 minutos** contra o mesmo alvo.
* **Interpretação Sistêmica:** O sistema **NÃO** assume a priori que se trata de ataque coordenado (*brigading*). Assume como hipótese primária que um **incidente ao vivo está ocorrendo em tempo real** e age para proteger o grupo.

### 3.1. Ação Quando o Alvo é uma Mãe Participante
1. **Corte Imediato de Mídia:** O sistema muta o microfone e corta a câmera da usuária denunciada na chamada imediatamente, sem desconectar as outras participantes.
2. **Isolamento Neutro:** Exibição de aviso neutro para a denunciada de que sua transmissão foi pausada preventivamente pelo sistema para checagem, sem constrangimento público.
3. **Continuidade da Roda:** As demais mães e a facilitadora continuam o encontro em segurança.

### 3.2. Ação Quando o Alvo é a Psicóloga Facilitadora
1. **Alerta Crítico de Plantão:** Disparo de notificação imediata via Webhook para a coordenação clínica da Florável.
2. **Pausa Segura:** Notificação amigável para as participantes de que a sala apresentou instabilidade, oferecendo saída voluntária imediata com suporte de acolhimento prioritário.
3. **Bloqueio de Agenda Futura:** Suspensão preventiva automática da abertura de novas salas pela profissional até parecer conclusivo da coordenação.

---

## 4. Auditoria via Telemetria (Distinção entre Incidente Real e Brigading)

Para auditar o ocorrido sem violar a privacidade gravando áudio/vídeo integral da reunião, o sistema registra telemetria de contexto:

* **Indicadores de Incidente Real:**
  * O microfone do denunciado estava com status `isSpeaking = true` nos 60 segundos anteriores às denúncias.
  * As denunciantes possuem contas ativas de localidades diferentes e sem histórico de contato prévio entre si.
  * Registro de saída abrupta de participantes da sala no mesmo minuto (`user_left_abruptly`).
* **Indicadores de Ataque Coordenado / Denúncia Falsa:**
  * O denunciado estava com microfone e câmera desligados durante todo o período.
  * Denunciantes criadas na mesma data, mesmo IP ou rede compartilhada.
* **Penalidade por Falsa Denúncia:** Se comprovado ataque malicioso de má-fé contra uma usuária ou profissional inocente, as contas das acusadoras sofrem **banimento permanente imediato** por assédio moral contra a comunidade.

---

## 5. Matchmaking Seguro (Bloqueio Cruzado no Banco)
* Sempre que uma denúncia for registrada com o flag `bloquear_usuario = true`, o back-end insere um registro na tabela `bloqueios_usuarios`.
* **Efeito no Sistema:**
  * **Comunidade:** Posts e relatos do usuário bloqueado desaparecem do mural da vítima.
  * **Rodas de Conversa:** O algoritmo de agendamento impede que ambos se inscrevam ou entrem na mesma sala de vídeo, encaminhando quem tentar entrar por último para outro horário/sala equivalente.

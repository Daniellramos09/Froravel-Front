# 🌸 Florável — Frontend Monorepo

> Ecossistema frontend de saúde perinatal e suporte emocional materno, estruturado em arquitetura Monorepo corporativa (Workspaces) conectada ao backend Spring Boot em Domain-Driven Design (DDD).

---

## 🏛️ Arquitetura do Ecossistema

O repositório é organizado no padrão corporativo **Workspaces (`apps/` + `packages/`)**, separando claramente as 4 aplicações do negócio e compartilhando contratos e tokens de design:

```text
floravel-front/
├── apps/
│   ├── landing/                   # Portal Institucional & Conversão (B2C / B2B / ESG)
│   ├── mae/                       # PWA da Mãe: Diário, Humor, Rodas e Consultas
│   ├── psicologo/                 # PWA do Terapeuta: Agenda, Sala de Acolhimento e Gestão
│   └── rh/                        # Dashboard Corporativo B2B: Métricas de Clima e LGPD
│
├── packages/
│   └── shared/                    # Contratos de rotas (appLinks), tokens e utilitários
│
├── package.json                   # Gerenciador raiz do Monorepo (npm workspaces)
└── README.md
```

---

## 🚀 Como Executar o Projeto

### 1. Instalação de Dependências
Na raiz do repositório, instale todas as dependências de todos os apps e pacotes com um único comando:

```bash
npm install
```

### 2. Rodar Aplicações em Desenvolvimento

Você pode iniciar cada aplicação individualmente a partir da raiz:

```bash
# Iniciar a Landing Page (porta padrão 5173)
npm run dev:landing

# Iniciar o App da Mãe (porta padrão 5174)
npm run dev:mae

# Iniciar o Portal do Psicólogo (porta padrão 5175)
npm run dev:psicologo

# Iniciar o Dashboard Corporativo RH (porta padrão 5176)
npm run dev:rh
```

### 3. Build de Produção

```bash
# Compilar todas as 4 aplicações simultaneamente
npm run build:all

# Ou compilar apenas uma aplicação específica
npm run build:landing
npm run build:mae
npm run build:psicologo
npm run build:rh
```

---

## 🌐 Mapeamento com os Domínios do Backend (Spring Boot)

| Domínio Backend Java | Aplicação Frontend Responsável | Funcionalidade Principal |
| :--- | :--- | :--- |
| `domain/triagem` | `apps/mae` & `apps/rh` | Escala de Edimburgo (EPDS) e relatórios de risco anônimos |
| `domain/rodaconversa` | `apps/mae` & `apps/psicologo` | Rodas de escuta abertas e mediação clínica |
| `domain/agendamento` | `apps/mae` & `apps/psicologo` | Escolha de especialista e gestão de horários |
| `domain/reuniao` | `apps/psicologo` | Sala virtual de acolhimento e prontuário ético |
| `domain/rh` | `apps/rh` & `apps/landing` | Gestão de licenças corporativas, planos PME e métricas |
| `domain/pagamento` | `apps/psicologo` & `apps/rh` | Repasse integral (R$ 29,90) e faturamento corporativo |
| `domain/validacaogoverno` | `apps/psicologo` | Validação de CRP e conformidade com CFP |

---

## 🎨 Paleta e Tokens de Design (`@floravel/shared`)

* **Canvas Linho Suave:** `#FAF7F2`
* **Verde Botânico Profundo:** `#1D382B`
* **Verde Sálvia Clínico:** `#73937E` / `#EBF1ED`
* **Rosa Acolhimento:** `#F4C4D4` / `#FDF2F5` / `#C96E82`
* **Grafite Suave:** `#27272A` / `#52525B`

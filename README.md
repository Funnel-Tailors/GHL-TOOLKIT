# GHL-TOOLKIT

Toolkit de Claude Code para GoHighLevel. MCP Server con 34 API tools + 11 skills + 23 agents organizados en sub-swarms con memoria compartida. Despliega funnels de cualificación completos y crea/configura sub-cuentas en batch via automatización de navegador.

**v3 (API)**: Un solo comando (`/ghl-deploy ./mi-proyecto`) analiza tu landing, diseña el scoring, construye la infraestructura en GHL, escribe las secuencias de nurturing con copy real, conecta el formulario, y configura Meta CAPI. Todo coordinado via memoria compartida en `.ghl/`.

**v4 (Browser)**: Nuevo browser sub-swarm con Playwright MCP. Crea sub-cuentas desde el dashboard de agencia, monta pipelines, calendarios, workflows, e integraciones — todo lo que la API no puede hacer. `/ghl-batch-create` para crear muchas cuentas de golpe con templates reutilizables.

---

## Swarm Architecture v3

```
                         /ghl-deploy ./mi-proyecto
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    ghl-deploy-director         │
                    │    (Super-orquestador — Opus)   │
                    │                                │
                    │  State machine + validación     │
                    │  cruzada + memoria compartida   │
                    └──────────┬───────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │         FASE 1: ANÁLISIS         │
              │                                  │
              ▼                                  │
     ┌────────────────┐                          │
     │ ghl-project-    │                          │
     │ auditor (Sonnet)│                          │
     │                 │                          │
     │ → analysis.md   │                          │
     │ → audit.md      │                          │
     └────────┬───────┘                          │
              │                                  │
              ├──────── FASE 2: DISEÑO ──────────┤
              │      (sub-swarms paralelos)       │
              ▼                ▼                  │
     ┌────────────────┐ ┌───────────────┐        │
     │ SCORING         │ │ FUNNEL         │        │
     │ sub-swarm       │ │ sub-swarm      │        │
     │                 │ │                │        │
     │ scoring-engineer│ │ funnel-        │        │
     │ (mini-director) │ │ strategist     │        │
     │   ├─ scoring-   │ │ (mini-director)│        │
     │   │  modeler    │ │   ├─ funnel-   │        │
     │   └─ scoring-   │ │   │  architect │        │
     │      question-  │ │   └─ form-     │        │
     │      designer   │ │      copywriter│        │
     └────────┬───────┘ └───────┬───────┘        │
              │                 │                  │
              └────────┬────────┘                  │
                       ▼                           │
              ┌────────────────┐                   │
              │ ghl-infra-      │                   │
              │ engineer        │                   │
              │ (lee specs →    │                   │
              │  crea en GHL)   │                   │
              └────────┬───────┘                   │
                       │ VALIDACIÓN CRUZADA        │
              ┌────────┴──────────┬────────────────┘
              │         FASE 3: BUILD               │
              │      (sub-swarms paralelos)          │
              ▼                ▼                   ▼
     ┌────────────────┐ ┌───────────────┐ ┌──────────────┐
     │ NURTURE         │ │ integration-   │ │ CAPI          │
     │ sub-swarm       │ │ engineer       │ │ sub-swarm     │
     │                 │ │ (Sonnet)       │ │               │
     │ nurture-        │ │                │ │ capi-engineer  │
     │ strategist      │ │ Form handler   │ │ (mini-director)│
     │ (mini-director) │ │ API routes     │ │   ├─ capi-    │
     │   ├─ nurture-   │ │ Tracking       │ │   │  strategist│
     │   │  architect  │ │                │ │   └─ capi-    │
     │   └─ nurture-   │ │                │ │      implementer│
     │      copywriter │ │                │ │               │
     └────────────────┘ └───────────────┘ └──────────────┘
              │                 │                  │
              └────────────────┼──────────────────┘
                               ▼
                    ┌──────────────────────────────┐
                    │      FASE 4: VALIDACIÓN       │
                    │                                │
                    │  Coherencia total + reporte     │
                    │  Todo en .ghl/ del proyecto     │
                    └──────────────────────────────┘
```

---

## Memoria Compartida: `.ghl/`

Cada agente escribe UN archivo en el directorio `.ghl/` del proyecto. Múltiples agentes leen. Sin conflictos por diseño.

```
mi-proyecto/.ghl/
├── state.json                    # State machine (solo deploy-director)
├── config.json                   # Metadata del proyecto
├── analysis.md                   # ← project-auditor
├── audit.md                      # ← project-auditor
├── scoring-model.md              # ← scoring-modeler
├── scoring-questions.md          # ← scoring-question-designer
├── funnel-architecture.md        # ← funnel-architect
├── form-copy.md                  # ← form-copywriter
├── infrastructure.md             # ← infra-engineer
├── nurture-strategy.md           # ← nurture-architect
├── nurture-sequences.md          # ← nurture-copywriter
├── integration-code.md           # ← integration-engineer
├── capi-strategy.md              # ← capi-strategist
├── capi-config.md                # ← capi-implementer
├── validation-final.md           # ← deploy-director
└── report.md                     # ← deploy-director
```

---

## Quick Start

```bash
# 1. Clonar el repo
git clone https://github.com/Funnel-Tailors/GHL-TOOLKIT.git
cd GHL-TOOLKIT

# 2. Instalar dependencias del MCP Server
cd mcp-server && npm install && npm run build && cd ..

# 3. Configurar credenciales
cp .env.example .env.local
# Editar .env.local con tus keys de GHL (y opcionalmente Meta)

# 4. Sincronizar skills y agents en Claude Code
./sync.sh

# 5. Listo — lanzar un deploy completo
# (dentro de Claude Code)
/ghl-deploy ./mi-proyecto
```

---

## Skills (11)

Comandos que se invocan directamente en Claude Code con `/nombre`. Cada uno lanza su propio sub-swarm si `.ghl/` existe.

### API Skills (v3)

| Skill | Qué hace | Sub-swarm |
|---|---|---|
| `/ghl-deploy` | Deploy completo end-to-end. Orquesta 16 agentes en 4 fases con sub-swarms paralelos. | Todos |
| `/ghl-setup` | Infraestructura base: custom fields, pipeline, webhooks, tags. | infra-engineer |
| `/ghl-qualify` | Diseñar modelo de scoring + preguntas de cualificación. | scoring-modeler + question-designer |
| `/ghl-funnel` | Arquitectura del funnel + copy del formulario multi-step. | funnel-architect + form-copywriter |
| `/ghl-nurture` | Secuencias de nurturing personalizadas (SMS + Email) con copy real. | nurture-architect + nurture-copywriter |
| `/ghl-connect` | Conectar landing page con GHL: form handler, tracking, UTMs, webhook. | integration-engineer |
| `/ghl-capi` | Configurar Meta CAPI con eventos server-side enriquecidos. | capi-strategist + capi-implementer |
| `/ghl-audit` | Auditoría completa de una location GHL: gaps, problemas, oportunidades. | project-auditor |

### Browser Skills (v4)

| Skill | Qué hace | Sub-swarm |
|---|---|---|
| `/ghl-browser-setup` | Crear y configurar UNA sub-cuenta completa via navegador + API híbrido. | browser sub-swarm |
| `/ghl-batch-create` | Crear MUCHAS sub-cuentas en batch desde un YAML. Resume si se interrumpe. | browser sub-swarm |
| `/ghl-browser-audit` | Auditar cuentas creadas via browser, verificando que coinciden con el template. | browser sub-swarm |

---

## Agents (23)

### API Agents (16 — v3)

#### Nivel 1: Super-Orquestador

| Agent | Modelo | Rol |
|---|---|---|
| `ghl-deploy-director` | Opus | Super-orquestador. State machine, validaciones cruzadas entre fases, reporte final. Resume de interrupciones. |

#### Nivel 2: Mini-Directors + Agentes Solo

| Agent | Modelo | Rol |
|---|---|---|
| `ghl-scoring-engineer` | Opus | Mini-director del scoring sub-swarm. Lanza modeler → question-designer → valida. |
| `ghl-funnel-strategist` | Opus | Mini-director del funnel sub-swarm. Lanza architect → copywriter → valida. Espera a scoring-questions.md. |
| `ghl-nurture-strategist` | Opus | Mini-director del nurture sub-swarm. Lanza architect → copywriter → valida. |
| `ghl-capi-engineer` | Sonnet | Mini-director del CAPI sub-swarm. Lanza strategist → implementer → valida. |
| `ghl-infra-engineer` | Sonnet | Lee specs de scoring + funnel de .ghl/ antes de crear. Ya no adivina. |
| `ghl-integration-engineer` | Sonnet | Lee IDs reales de .ghl/infrastructure.md. Field mapping exacto. |
| `ghl-project-auditor` | Sonnet | Análisis de landing + auditoría GHL. Solo recolección de datos en Phase 1. |

#### Nivel 3: Sub-Agentes Especializados

| Agent | Modelo | Sub-swarm | Rol |
|---|---|---|---|
| `ghl-scoring-modeler` | Opus | Scoring | Modelo matemático: dimensiones, pesos, umbrales, decay, señales negativas. |
| `ghl-scoring-question-designer` | Opus | Scoring | Preguntas naturales con mapeo de puntos. Voz coherente con la landing. |
| `ghl-funnel-architect` | Opus | Funnel | Tipo de funnel, flujo, steps, branching, thank-you pages diferenciadas. |
| `ghl-form-copywriter` | Opus | Funnel | Micro-copy: botones, progreso, social proof, errores, CTAs de thank-you. |
| `ghl-nurture-architect` | Opus | Nurture | Cadencias por score, timing, triggers, canales, estructura de secuencias. |
| `ghl-nurture-copywriter` | Opus | Nurture | Copy REAL de todos los mensajes SMS+Email. Personalizado al avatar. |
| `ghl-capi-strategist` | Sonnet | CAPI | Estrategia de attribution: eventos, EMQ, deduplicación, optimization event. |
| `ghl-capi-implementer` | Sonnet | CAPI | Código CAPI: endpoints, SHA-256 hashing, workflows, testing. |

### Browser Agents (7 — v4)

| Agent | Modelo | Rol |
|---|---|---|
| `ghl-browser-director` | Opus | Mini-director del browser sub-swarm. Orquesta auth → account creation → setup. Gestiona batch. |
| `ghl-browser-auth` | Sonnet | Login en GHL agency dashboard. Maneja 2FA. Detecta sesiones existentes. |
| `ghl-account-creator` | Opus | Crea sub-cuentas desde el wizard de agencia. Captura Location ID + API Key. |
| `ghl-pipeline-builder` | Sonnet | Crea pipelines + stages via browser (API no puede). |
| `ghl-workflow-builder` | Sonnet | Crea workflows con triggers y acciones via browser (API no puede). |
| `ghl-calendar-builder` | Sonnet | Crea calendarios con disponibilidad via browser (API no puede). |
| `ghl-integration-configurator` | Sonnet | Configura integraciones (Meta, Stripe) via browser UI. |

---

## MCP Tools (34)

El MCP Server expone 34 tools organizadas por módulo. Claude Code las usa automáticamente cuando los agents/skills las necesitan.

### Contacts (8)

| Tool | Descripción |
|---|---|
| `contacts_search` | Buscar contactos por nombre, email o teléfono |
| `contacts_create` | Crear contacto con nombre, email, teléfono, tags, custom fields |
| `contacts_get` | Obtener un contacto por ID con todos sus datos |
| `contacts_update` | Actualizar campos de un contacto |
| `contacts_delete` | Eliminar un contacto (irreversible) |
| `contacts_add_tags` | Añadir tags a un contacto sin borrar los existentes |
| `contacts_remove_tags` | Quitar tags específicos de un contacto |
| `contacts_add_note` | Añadir una nota al historial del contacto |

### Opportunities (5)

| Tool | Descripción |
|---|---|
| `pipeline_list` | Listar todos los pipelines y sus stages |
| `opportunity_create` | Crear oportunidad/deal en un pipeline para un contacto |
| `opportunity_update` | Actualizar campos de una oportunidad |
| `opportunity_move_stage` | Mover oportunidad a otro stage del pipeline |
| `opportunity_search` | Buscar oportunidades por pipeline, stage, contacto o query |

### Custom Fields (4)

| Tool | Descripción |
|---|---|
| `fields_list` | Listar todos los custom fields de la location |
| `fields_create` | Crear un custom field (TEXT, NUMERICAL, SINGLE_OPTIONS, etc.) |
| `fields_update` | Actualizar nombre, placeholder u opciones de un field |
| `fields_delete` | Eliminar un custom field (irreversible) |

### Calendars (4)

| Tool | Descripción |
|---|---|
| `calendar_list_slots` | Obtener slots disponibles en un rango de fechas |
| `calendar_book` | Reservar una cita para un contacto |
| `calendar_cancel` | Cancelar una cita existente |
| `calendar_get_appointment` | Obtener detalles de una cita |

### Custom Values (3)

| Tool | Descripción |
|---|---|
| `values_list` | Listar todos los custom values de la location |
| `values_create` | Crear un custom value |
| `values_update` | Actualizar un custom value existente |

### Conversations (3)

| Tool | Descripción |
|---|---|
| `conversation_send_sms` | Enviar SMS a un contacto |
| `conversation_send_email` | Enviar email a un contacto (soporta HTML) |
| `conversation_list` | Listar conversaciones de un contacto o la location |

### Webhooks (3)

| Tool | Descripción |
|---|---|
| `webhook_create` | Registrar webhook para recibir eventos de GHL |
| `webhook_list` | Listar todos los webhooks registrados |
| `webhook_delete` | Eliminar un webhook |

### Locations (2)

| Tool | Descripción |
|---|---|
| `location_get` | Info de la location actual (nombre, timezone, dirección) |
| `location_tags` | Listar todos los tags disponibles |

### Workflows (2)

| Tool | Descripción |
|---|---|
| `workflow_list` | Listar workflows y su estado (active/draft/inactive) |
| `workflow_trigger` | Disparar un workflow vía su webhook URL |

---

## Estructura del Repositorio

```
GHL-TOOLKIT/
├── README.md
├── .env.example              # Template de variables de entorno
├── .gitignore
├── sync.sh                   # Sincroniza skills/agents/templates a ~/.claude/
│
├── agents/                   # 23 agentes (16 API + 7 browser)
│   ├── ghl-deploy-director.md         # Super-orquestador
│   ├── ghl-project-auditor.md         # Análisis + auditoría
│   ├── ghl-scoring-engineer.md        # Mini-director scoring
│   ├── ghl-scoring-modeler.md         # Sub-agente: modelo matemático
│   ├── ghl-scoring-question-designer.md # Sub-agente: preguntas
│   ├── ghl-funnel-strategist.md       # Mini-director funnel
│   ├── ghl-funnel-architect.md        # Sub-agente: arquitectura
│   ├── ghl-form-copywriter.md         # Sub-agente: copy del form
│   ├── ghl-infra-engineer.md          # Infraestructura GHL
│   ├── ghl-nurture-strategist.md      # Mini-director nurture
│   ├── ghl-nurture-architect.md       # Sub-agente: cadencias
│   ├── ghl-nurture-copywriter.md      # Sub-agente: copy mensajes
│   ├── ghl-integration-engineer.md    # Integración landing↔GHL
│   ├── ghl-capi-engineer.md           # Mini-director CAPI
│   ├── ghl-capi-strategist.md         # Sub-agente: estrategia
│   ├── ghl-capi-implementer.md        # Sub-agente: implementación
│   ├── ghl-browser-director.md        # [v4] Director browser sub-swarm
│   ├── ghl-browser-auth.md            # [v4] Login via navegador
│   ├── ghl-account-creator.md         # [v4] Crear sub-cuentas
│   ├── ghl-pipeline-builder.md        # [v4] Crear pipelines via browser
│   ├── ghl-workflow-builder.md        # [v4] Crear workflows via browser
│   ├── ghl-calendar-builder.md        # [v4] Crear calendarios via browser
│   └── ghl-integration-configurator.md # [v4] Configurar Meta/Stripe via browser
│
├── skills/                   # 11 skills invocables (8 API + 3 browser)
│   ├── ghl-deploy/
│   │   ├── SKILL.md
│   │   └── MEMORY-PROTOCOL.md       # Protocolo de memoria compartida
│   ├── ghl-setup/
│   │   ├── SKILL.md
│   │   └── INFRASTRUCTURE.md
│   ├── ghl-qualify/
│   │   ├── SKILL.md
│   │   ├── SCORING-RULES.md
│   │   └── FORM-MAPPING.md
│   ├── ghl-funnel/
│   │   ├── SKILL.md
│   │   ├── FUNNEL-FRAMEWORKS.md
│   │   └── QUALIFICATION-FLOWS.md
│   ├── ghl-nurture/
│   │   ├── SKILL.md
│   │   ├── SEQUENCES.md
│   │   └── COPY-FRAMEWORKS.md
│   ├── ghl-connect/
│   │   ├── SKILL.md
│   │   └── WEBHOOK-PATTERNS.md
│   ├── ghl-capi/
│   │   ├── SKILL.md
│   │   └── EVENT-MAPPING.md
│   ├── ghl-audit/
│   │   ├── SKILL.md
│   │   └── CHECKLIST.md
│   ├── ghl-browser-setup/            # [v4] Setup individual via browser
│   │   ├── SKILL.md
│   │   └── UI-SELECTORS.md
│   ├── ghl-batch-create/             # [v4] Creación masiva
│   │   ├── SKILL.md
│   │   ├── BATCH-PROTOCOL.md
│   │   └── TEMPLATES.md
│   └── ghl-browser-audit/            # [v4] Auditoría via browser
│       └── SKILL.md
│
├── templates/                # [v4] Templates de configuración
│   ├── _base.yaml                    # Defaults compartidos
│   └── dental-clinic.yaml            # Ejemplo: clínica dental
│
├── .ghl-browser/             # [v4] Browser automation (gitignored)
│   ├── secrets.env                   # Credenciales de agencia
│   └── traces/                       # Screenshots, videos, traces
│
├── mcp-server/               # MCP Server (34 API tools)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          # Entry point — registra todas las tools
│       ├── client.ts         # HTTP client para GHL API v2
│       ├── auth.ts           # Manejo de autenticación
│       ├── types.ts          # Tipos compartidos
│       └── tools/
│           ├── contacts.ts       # 8 tools
│           ├── opportunities.ts  # 5 tools
│           ├── custom-fields.ts  # 4 tools
│           ├── calendars.ts      # 4 tools
│           ├── custom-values.ts  # 3 tools
│           ├── conversations.ts  # 3 tools
│           ├── webhooks.ts       # 3 tools
│           ├── locations.ts      # 2 tools
│           └── workflows.ts      # 2 tools
│
└── edge-functions/           # Supabase edge functions (opcional)
```

---

## Variables de Entorno

Copiar `.env.example` a `.env.local` y rellenar:

| Variable | Required | Descripción |
|---|---|---|
| `GHL_API_KEY` | **Si** | Private Integration Token de GHL (Settings > Integrations) |
| `GHL_LOCATION_ID` | **Si** | ID de la location/sub-account (Settings > Business Profile) |
| `META_PIXEL_ID` | No | ID del pixel de Meta (solo para `/ghl-capi`) |
| `META_ACCESS_TOKEN` | No | Token de acceso de Meta Conversions API (solo para `/ghl-capi`) |
| `SUPABASE_URL` | No | URL del proyecto Supabase (solo para edge functions) |
| `SUPABASE_ANON_KEY` | No | Anon key de Supabase (solo para edge functions) |
| `GHL_AGENCY_EMAIL` | No* | Email de la agencia GHL (*requerido para browser skills) |
| `GHL_AGENCY_PASSWORD` | No* | Password de la agencia GHL (*requerido para browser skills) |

---

## Flujo End-to-End

Cuando ejecutas `/ghl-deploy`, el swarm trabaja en 4 fases con sub-swarms especializados:

### Fase 1 — Análisis
El `project-auditor` lee el código real de la landing page y extrae: propuesta de valor, avatar, ticket, objeciones, nivel de awareness, mecanismo de conversión, voz de marca, y framework técnico. Luego audita el estado actual de GHL. Todo se escribe en `.ghl/analysis.md` y `.ghl/audit.md`.

### Fase 2 — Diseño (sub-swarms paralelos)
- **Scoring sub-swarm**: El `scoring-modeler` diseña el modelo matemático (dimensiones, pesos, umbrales, decay). Luego el `scoring-question-designer` traduce las señales en preguntas naturales con mapeo de puntos.
- **Funnel sub-swarm**: El `funnel-architect` diseña la arquitectura (tipo, flujo, branching, thank-you pages). Luego el `form-copywriter` escribe todo el micro-copy del form (espera a que las scoring-questions estén listas).
- **Infra** (después de scoring + funnel): El `infra-engineer` LEE las specs de los sub-swarms anteriores y crea exactamente lo que necesitan en GHL vía API.

El `deploy-director` valida coherencia entre los 3 outputs antes de continuar.

### Fase 3 — Build (sub-swarms paralelos)
- **Nurture sub-swarm**: El `nurture-architect` diseña cadencias y estructura. El `nurture-copywriter` escribe TODOS los mensajes SMS+Email con copy real personalizado.
- **Integration**: El `integration-engineer` genera código exacto para el framework de la landing, usando IDs reales de `.ghl/infrastructure.md`.
- **CAPI sub-swarm**: El `capi-strategist` diseña la estrategia de attribution y EMQ. El `capi-implementer` produce el código de endpoints, hashing, y workflows.

### Fase 4 — Validación
El `deploy-director` cruza TODOS los outputs y verifica coherencia total: umbrales de scoring en todas las piezas, custom fields creados vs enviados, workflows correctamente enlazados, eventos CAPI en los momentos adecuados. Entrega `report.md` con todo lo implementado.

### Resume
Si un deploy se interrumpe, al relanzar detecta `.ghl/state.json` y resume desde el punto exacto sin re-ejecutar agentes completados.

---

## Browser Automation (v4)

### Por qué browser

La API de GHL v2 no puede crear pipelines, workflows, calendarios, sub-cuentas, ni configurar integraciones. El browser sub-swarm usa Playwright MCP para automatizar estas operaciones directamente en la UI de GHL.

### Approach híbrido

| Operación | Método | Razón |
|---|---|---|
| Crear sub-cuenta | BROWSER | No hay API |
| Custom fields | API | Más rápido y fiable |
| Pipeline + stages | BROWSER | No hay API |
| Calendario | BROWSER | No hay API |
| Workflows | BROWSER | No hay API |
| Webhooks | API | Más rápido |
| Integraciones (Meta, Stripe) | BROWSER | Requiere UI |

### Crear una cuenta

```
/ghl-browser-setup --template dental-clinic
```

### Crear muchas cuentas

```
/ghl-batch-create ./accounts.yaml --template dental-clinic
```

Formato del YAML:
```yaml
template: dental-clinic
accounts:
  - name: "Clínica Madrid Centro"
    email: "madrid@clinica.es"
    phone: "+34911234567"
    address: {street: "Gran Vía 42", city: "Madrid", zip: "28013"}
  - name: "Clínica Barcelona"
    email: "bcn@clinica.es"
```

### Templates

Los templates definen la configuración completa de una sub-cuenta: pipeline, custom fields, calendario, workflows, integraciones, y tags. Se guardan en `templates/` y se reutilizan para crear cuentas idénticas.

Templates incluidos:
- `_base.yaml` — Defaults compartidos
- `dental-clinic.yaml` — Clínica dental completa

### Resiliencia

- Usa **accessibility tree** en vez de CSS selectors (resistente a cambios de UI)
- **Resume automático** si se interrumpe (via `batch-queue.json`)
- **Error aislado**: si una cuenta falla, las demás continúan
- **Re-autenticación** automática si la sesión expira

---

## Licencia

MIT

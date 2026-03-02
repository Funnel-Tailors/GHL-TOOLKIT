# GHL-TOOLKIT

Toolkit de Claude Code para GoHighLevel. MCP Server con 34 tools + 8 skills + 7 agents que trabajan como un swarm para desplegar funnels de cualificación completos desde una landing page existente.

Un solo comando (`/ghl-deploy ./mi-proyecto`) analiza tu landing, diseña el scoring, construye la infraestructura en GHL, escribe las secuencias de nurturing, conecta el formulario, y configura Meta CAPI. Todo coordinado, todo coherente.

---

## Swarm Architecture

```
                         /ghl-deploy ./mi-proyecto
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    ghl-project-architect      │
                    │    (Director — Opus)           │
                    │                                │
                    │  1. Lee la landing real         │
                    │  2. Extrae oferta/avatar/ticket │
                    │  3. Audita GHL actual           │
                    │  4. Coordina las 4 fases        │
                    └──────────┬───────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │           FASE 2: DISEÑO         │
              │          (3 en paralelo)          │
              ▼                ▼                  ▼
     ┌────────────────┐ ┌───────────────┐ ┌──────────────┐
     │ scoring-        │ │ funnel-        │ │ infra-        │
     │ engineer        │ │ strategist     │ │ engineer      │
     │ (Opus)          │ │ (Opus)         │ │ (Sonnet)      │
     │                 │ │                │ │               │
     │ Modelo de       │ │ Arquitectura   │ │ Custom fields │
     │ scoring         │ │ del funnel     │ │ Pipeline      │
     │ predictivo      │ │ + branching    │ │ Tags/Webhooks │
     └────────┬───────┘ └───────┬───────┘ └──────┬───────┘
              │                 │                  │
              └────────┬────────┴─────────┬───────┘
                       │   VALIDACIÓN     │
                       │   CRUZADA        │
              ┌────────┴─────────┬────────┴───────┐
              │          FASE 3: BUILD            │
              │         (3 en paralelo)            │
              ▼                ▼                   ▼
     ┌────────────────┐ ┌───────────────┐ ┌──────────────┐
     │ nurture-        │ │ integration-   │ │ capi-         │
     │ strategist      │ │ engineer       │ │ engineer      │
     │ (Opus)          │ │ (Sonnet)       │ │ (Sonnet)      │
     │                 │ │                │ │               │
     │ Secuencias SMS  │ │ Form handler   │ │ Server-side   │
     │ + Email con     │ │ API routes     │ │ event tracking│
     │ copy real       │ │ Tracking       │ │ para Meta     │
     └────────────────┘ └───────────────┘ └──────────────┘
              │                 │                  │
              └────────────────┼──────────────────┘
                               ▼
                    ┌──────────────────────────────┐
                    │      FASE 4: VALIDACIÓN       │
                    │                                │
                    │  Coherencia entre todas las     │
                    │  piezas + reporte final         │
                    └──────────────────────────────┘
                               │
                               ▼
                          GHL API v2
                      (via MCP Server)
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

## Skills (8)

Comandos que se invocan directamente en Claude Code con `/nombre`.

| Skill | Qué hace | Argumento |
|---|---|---|
| `/ghl-deploy` | Deploy completo end-to-end. Orquesta los 6 especialistas en 4 fases para montar todo el funnel. | `[project-path]` |
| `/ghl-setup` | Infraestructura base: custom fields, pipeline, webhooks, tags. | `[project-name]` |
| `/ghl-qualify` | Diseñar criterios de scoring o cualificar un lead específico. | `[project-name \| contact-id]` |
| `/ghl-funnel` | Arquitectura del funnel: formulario multi-step, branching, experiencias por score. | `[project-name \| landing-url]` |
| `/ghl-nurture` | Secuencias de nurturing personalizadas (SMS + Email) adaptadas al score. | `[project-name \| sequence-type]` |
| `/ghl-connect` | Conectar landing page con GHL: form handler, tracking, UTMs, webhook. | `[project-path \| landing-url]` |
| `/ghl-capi` | Configurar Meta Conversions API con eventos server-side enriquecidos. | `[project-name]` |
| `/ghl-audit` | Auditoría completa de una location GHL: gaps, problemas, oportunidades. | — |

---

## Agents (7)

Agentes especializados que trabajan como swarm coordinado por el `project-architect`.

| Agent | Modelo | Rol |
|---|---|---|
| `ghl-project-architect` | Opus | Director del swarm. Analiza el proyecto, diseña la estrategia macro, coordina las 4 fases, valida coherencia. |
| `ghl-scoring-engineer` | Opus | Diseña modelos de scoring predictivo: criterios, pesos, umbrales, decay rules. |
| `ghl-funnel-strategist` | Opus | Diseña la arquitectura del funnel: formularios como micro-compromisos, branching por score, experiencias diferenciadas. |
| `ghl-infra-engineer` | Sonnet | Construye la infraestructura en GHL vía API: custom fields, pipeline, tags, webhooks. Audita antes de crear. |
| `ghl-nurture-strategist` | Opus | Escribe secuencias de nurturing con copy real personalizado. Cada mensaje como conversación 1-on-1, no newsletter. |
| `ghl-integration-engineer` | Sonnet | Conecta la landing real con GHL: lee el código, identifica el framework, genera form handlers y API routes exactos. |
| `ghl-capi-engineer` | Sonnet | Configura Meta CAPI para que el algoritmo optimice hacia leads de calidad, no volumen. |

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
├── sync.sh                   # Sincroniza skills/agents a ~/.claude/
│
├── agents/                   # 7 agentes del swarm
│   ├── ghl-project-architect.md
│   ├── ghl-scoring-engineer.md
│   ├── ghl-funnel-strategist.md
│   ├── ghl-infra-engineer.md
│   ├── ghl-nurture-strategist.md
│   ├── ghl-integration-engineer.md
│   └── ghl-capi-engineer.md
│
├── skills/                   # 8 skills invocables
│   ├── ghl-deploy/
│   │   └── SKILL.md
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
│   └── ghl-audit/
│       ├── SKILL.md
│       └── CHECKLIST.md
│
├── mcp-server/               # MCP Server (34 tools)
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

---

## Uso Individual de Skills

### `/ghl-deploy` — Deploy completo
```
/ghl-deploy ./webinardos
```
Analiza la landing, lanza el swarm de 6 agentes en 4 fases, y entrega el funnel completo con reporte.

### `/ghl-setup` — Infraestructura base
```
/ghl-setup mi-proyecto
```
Verifica credenciales, audita el estado actual, y crea custom fields + pipeline + tags + webhooks.

### `/ghl-qualify` — Scoring
```
/ghl-qualify mi-proyecto           # Diseñar criterios de scoring
/ghl-qualify abc123-contact-id     # Cualificar un lead específico
```
Diseña modelos de scoring predictivo o aplica scoring a un contacto real.

### `/ghl-funnel` — Arquitectura del funnel
```
/ghl-funnel mi-landing
```
Diseña el formulario multi-step, branching logic, y experiencias diferenciadas por score.

### `/ghl-nurture` — Secuencias de nurturing
```
/ghl-nurture mi-proyecto
```
Crea secuencias completas de SMS + Email con copy real personalizado al avatar y scoring model.

### `/ghl-connect` — Conectar landing
```
/ghl-connect ./mi-landing
```
Lee el código de la landing, genera form handlers, API routes, behavior tracking, y hidden fields para UTMs.

### `/ghl-capi` — Meta CAPI
```
/ghl-capi mi-proyecto
```
Configura server-side tracking con eventos enriquecidos para que Meta optimice hacia leads de calidad.

### `/ghl-audit` — Auditoría
```
/ghl-audit
```
Revisa la location completa: campos huérfanos, workflows inactivos, pipeline sin stages, tags sin uso.

---

## Flujo End-to-End

Cuando ejecutas `/ghl-deploy`, el swarm trabaja en 4 fases:

### Fase 1 — Análisis
El `project-architect` lee el código real de la landing page y extrae: propuesta de valor, avatar, ticket, objeciones, nivel de awareness, mecanismo de conversión, voz de marca, y framework técnico. Luego audita el estado actual de GHL (campos, pipelines, tags, webhooks existentes).

### Fase 2 — Diseño (3 agentes en paralelo)
- **scoring-engineer**: Diseña el modelo de scoring predictivo con criterios, pesos, umbrales y decay rules específicos para ese negocio.
- **funnel-strategist**: Diseña la arquitectura del funnel con formulario multi-step, branching logic, y experiencias diferenciadas por score.
- **infra-engineer**: Crea la infraestructura base en GHL vía API (custom fields, pipeline, tags, webhooks).

El `project-architect` valida la coherencia entre los 3 outputs antes de continuar.

### Fase 3 — Build (3 agentes en paralelo)
- **nurture-strategist**: Escribe secuencias completas de SMS + Email con copy real (no placeholders) adaptado al score y etapa del journey.
- **integration-engineer**: Genera el código exacto de integración para el framework de la landing (form handlers, API routes, tracking scripts).
- **capi-engineer**: Configura Meta CAPI con eventos server-side que reportan calidad del lead, no solo volumen.

### Fase 4 — Validación
El `project-architect` cruza todos los outputs y verifica que: los umbrales de scoring coinciden en todas las piezas, los custom fields creados en GHL coinciden con los que envía el integration code, los workflows de nurturing se activan en los stages correctos, y los eventos CAPI se disparan en los momentos adecuados. Entrega un reporte final con todo lo implementado + pasos manuales pendientes.

---

## Licencia

MIT

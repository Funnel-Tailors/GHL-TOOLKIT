# Protocolo de Memoria Compartida — `.ghl/`

Referencia central para todos los agentes del GHL-TOOLKIT v3. Define cómo los agentes comparten contexto via archivos en el directorio `.ghl/` del proyecto del cliente.

## Principio

Cada agente escribe UN archivo. Múltiples agentes leen. Sin conflictos por diseño. SOLO el `ghl-deploy-director` escribe `state.json`.

## Estructura del Directorio

```
mi-proyecto/.ghl/
├── state.json                    # State machine (SOLO deploy-director)
├── config.json                   # Metadata del proyecto
│
├── analysis.md                   # ← project-auditor
├── audit.md                      # ← project-auditor
│
├── scoring-model.md              # ← scoring-modeler
├── scoring-questions.md          # ← scoring-question-designer
├── funnel-architecture.md        # ← funnel-architect
├── form-copy.md                  # ← form-copywriter
├── infrastructure.md             # ← infra-engineer
├── validation-phase2.md          # ← deploy-director
│
├── nurture-strategy.md           # ← nurture-architect
├── nurture-sequences.md          # ← nurture-copywriter
├── integration-code.md           # ← integration-engineer
├── capi-strategy.md              # ← capi-strategist
├── capi-config.md                # ← capi-implementer
│
├── validation-final.md           # ← deploy-director
└── report.md                     # ← deploy-director
```

## Formato de Output de Cada Agente

Cada archivo escrito por un agente DEBE incluir frontmatter YAML:

```markdown
---
agent: ghl-scoring-modeler
phase: 2
sub_swarm: scoring
status: completed
created_at: 2026-03-03T10:25:00Z
dependencies_read:
  - .ghl/analysis.md
  - .ghl/audit.md
---

# Scoring Model: [Nombre Proyecto]
[contenido...]
```

### Campos del Frontmatter

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `agent` | Sí | Nombre del agente que escribió el archivo |
| `phase` | Sí | Fase del deploy (1, 2, 3, o 4) |
| `sub_swarm` | No | Sub-swarm al que pertenece (scoring, funnel, nurture, capi) |
| `status` | Sí | `completed` o `error` |
| `created_at` | Sí | ISO 8601 timestamp |
| `dependencies_read` | Sí | Lista de archivos `.ghl/` que leyó antes de escribir |

## Tabla de Dependencias de Lectura/Escritura

| Agente | Lee de `.ghl/` | Escribe en `.ghl/` |
|--------|----------------|---------------------|
| project-auditor | (landing code + MCP tools) | `analysis.md`, `audit.md` |
| scoring-modeler | `analysis.md`, `audit.md` | `scoring-model.md` |
| scoring-question-designer | `analysis.md`, `scoring-model.md` | `scoring-questions.md` |
| funnel-architect | `analysis.md`, `audit.md` | `funnel-architecture.md` |
| form-copywriter | `analysis.md`, `funnel-architecture.md`, `scoring-questions.md` | `form-copy.md` |
| infra-engineer | `audit.md`, `scoring-model.md`, `scoring-questions.md`, `funnel-architecture.md`, `form-copy.md` | `infrastructure.md` |
| nurture-architect | `analysis.md`, `scoring-model.md`, `funnel-architecture.md`, `infrastructure.md` | `nurture-strategy.md` |
| nurture-copywriter | `analysis.md`, `nurture-strategy.md`, `scoring-model.md` | `nurture-sequences.md` |
| integration-engineer | `analysis.md`, `scoring-model.md`, `funnel-architecture.md`, `form-copy.md`, `infrastructure.md` | `integration-code.md` |
| capi-strategist | `scoring-model.md`, `funnel-architecture.md`, `infrastructure.md` | `capi-strategy.md` |
| capi-implementer | `capi-strategy.md`, `infrastructure.md`, `integration-code.md` | `capi-config.md` |

## Grafo de Dependencias por Fase

```
PHASE 1
  project-auditor → analysis.md + audit.md

PHASE 2
  ┌─ scoring sub-swarm (secuencial interno):
  │    scoring-modeler → scoring-model.md
  │    scoring-question-designer → scoring-questions.md (lee scoring-model.md)
  │
  ├─ funnel sub-swarm (secuencial interno, paralelo con scoring):
  │    funnel-architect → funnel-architecture.md
  │    form-copywriter → form-copy.md (espera a scoring-questions.md + funnel-architecture.md)
  │
  └─ infra (después de scoring + funnel):
       infra-engineer → infrastructure.md (lee todos los outputs anteriores)

  deploy-director → validation-phase2.md

PHASE 3 (nurture + integration + capi en paralelo)
  ┌─ nurture sub-swarm (secuencial interno):
  │    nurture-architect → nurture-strategy.md
  │    nurture-copywriter → nurture-sequences.md
  │
  ├─ integration (agente solo):
  │    integration-engineer → integration-code.md
  │
  └─ capi sub-swarm (secuencial interno):
       capi-strategist → capi-strategy.md
       capi-implementer → capi-config.md

  deploy-director → validación cruzada

PHASE 4
  deploy-director → validation-final.md + report.md
```

## Cross-Dependency Clave

El `form-copywriter` (funnel sub-swarm) necesita `scoring-questions.md` (scoring sub-swarm). El mini-director `funnel-strategist` verifica que ese archivo exista antes de lanzar al copywriter. Si el scoring sub-swarm es más lento, el funnel mini-director espera.

## `state.json` — Esquema

```json
{
  "version": "3.0",
  "project": "nombre-del-proyecto",
  "location_id": "abc123",
  "created_at": "2026-03-03T10:00:00Z",
  "updated_at": "2026-03-03T10:45:00Z",
  "current_phase": "phase_2",
  "phases": {
    "phase_1": {
      "status": "completed",
      "agents": {
        "project-auditor": {
          "status": "completed",
          "output_files": ["analysis.md", "audit.md"]
        }
      }
    },
    "phase_2": {
      "status": "in_progress",
      "sub_swarms": {
        "scoring": {
          "status": "completed",
          "agents": {
            "scoring-modeler": { "status": "completed", "output_file": "scoring-model.md" },
            "scoring-question-designer": { "status": "completed", "output_file": "scoring-questions.md" }
          }
        },
        "funnel": {
          "status": "in_progress",
          "agents": {
            "funnel-architect": { "status": "completed", "output_file": "funnel-architecture.md" },
            "form-copywriter": { "status": "in_progress", "output_file": "form-copy.md" }
          }
        },
        "infra": {
          "status": "pending",
          "agents": {
            "infra-engineer": { "status": "pending", "output_file": "infrastructure.md" }
          }
        }
      },
      "validation": { "status": "pending", "output_file": "validation-phase2.md" }
    },
    "phase_3": {
      "status": "pending",
      "sub_swarms": {
        "nurture": {
          "status": "pending",
          "agents": {
            "nurture-architect": { "status": "pending", "output_file": "nurture-strategy.md" },
            "nurture-copywriter": { "status": "pending", "output_file": "nurture-sequences.md" }
          }
        },
        "integration": {
          "status": "pending",
          "agents": {
            "integration-engineer": { "status": "pending", "output_file": "integration-code.md" }
          }
        },
        "capi": {
          "status": "pending",
          "agents": {
            "capi-strategist": { "status": "pending", "output_file": "capi-strategy.md" },
            "capi-implementer": { "status": "pending", "output_file": "capi-config.md" }
          }
        }
      },
      "validation": { "status": "pending" }
    },
    "phase_4": {
      "status": "pending",
      "output_files": ["validation-final.md", "report.md"]
    }
  }
}
```

## `config.json` — Esquema

```json
{
  "project_name": "nombre-del-proyecto",
  "project_path": "/path/to/project",
  "location_id": "abc123",
  "has_meta_capi": true,
  "created_at": "2026-03-03T10:00:00Z"
}
```

## Reglas de Escritura

1. **SOLO el deploy-director escribe `state.json`**. Los agentes señalizan completitud via frontmatter en sus outputs.
2. **Cada agente escribe SU archivo y nada más**. Sin conflictos de escritura por diseño.
3. **Leer antes de escribir**: Verificar que los archivos de dependencia existen y tienen `status: completed` en el frontmatter.
4. **Si falta una dependencia**: No inventar datos. Reportar error al mini-director o al deploy-director.
5. **El path es relativo al proyecto**: Si el proyecto está en `./mi-proyecto`, la memoria está en `./mi-proyecto/.ghl/`.

## Modo Dual: Orquestado vs. Standalone

### Modo orquestado (dentro de `/ghl-deploy`)
- El deploy-director crea `.ghl/` y `state.json`
- Cada mini-director lanza su sub-swarm
- Todo lee/escribe en `.ghl/`

### Modo standalone (e.g., `/ghl-qualify mi-proyecto`)
- Si `.ghl/` existe → leer contexto de ahí, lanzar sub-swarm, escribir outputs
- Si `.ghl/` NO existe → crear `.ghl/` con `config.json` mínimo, lanzar auditor si no hay `analysis.md`, luego sub-swarm
- El sub-swarm siempre se ejecuta completo

## Resume

Si un deploy se interrumpe, el deploy-director:
1. Lee `state.json`
2. Identifica la fase actual y agentes completados
3. Resume desde el punto exacto de interrupción
4. NO re-ejecuta agentes que ya tienen output con `status: completed`

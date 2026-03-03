---
name: ghl-deploy
description: "Deploy a complete GHL funnel from an existing landing page. Orchestrates 16 specialized agents in 4 sub-swarms to analyze, design, build, and validate the entire qualification + nurturing + CAPI infrastructure. Use when the user has a landing page ready and wants the full GHL setup end-to-end, or when they say 'deploy GHL', 'full funnel setup', or 'connect everything'."
user-invocable: true
argument-hint: "[project-path]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, mcp__ghl__location_get, mcp__ghl__fields_list, mcp__ghl__pipeline_list, mcp__ghl__workflow_list, mcp__ghl__webhook_list, mcp__ghl__location_tags, mcp__ghl__contacts_search
---

# GHL Deploy — Despliegue Completo de Funnel GHL (v3)

Este skill invoca al agente `ghl-deploy-director` para orquestar el despliegue completo de un funnel GHL desde una landing page existente usando el swarm v3 con sub-swarms especializados y memoria compartida.

## Qué hace

1. **Analiza** la landing page del proyecto (lee el código real)
2. **Diseña** con sub-swarms paralelos:
   - Scoring sub-swarm (modeler + question designer)
   - Funnel sub-swarm (architect + form copywriter)
   - Infraestructura (lee specs antes de crear)
3. **Implementa** con sub-swarms paralelos:
   - Nurture sub-swarm (architect + copywriter)
   - Integration engineer (form handlers, API routes, tracking)
   - CAPI sub-swarm (strategist + implementer)
4. **Valida** la coherencia entre todas las piezas

## Arquitectura v3

```
ghl-deploy-director (super-orquestador)
│
├── Phase 1: ghl-project-auditor → analysis.md + audit.md
│
├── Phase 2 (sub-swarms paralelos):
│   ├── Scoring: scoring-modeler → scoring-question-designer
│   ├── Funnel: funnel-architect → form-copywriter
│   └── Infra: infra-engineer (después de scoring + funnel)
│
├── Phase 3 (sub-swarms paralelos):
│   ├── Nurture: nurture-architect → nurture-copywriter
│   ├── Integration: integration-engineer
│   └── CAPI: capi-strategist → capi-implementer
│
└── Phase 4: Validación final + reporte
```

## Memoria Compartida

Todos los agentes leen/escriben en `[project-path]/.ghl/`. Ver [MEMORY-PROTOCOL.md](MEMORY-PROTOCOL.md) para el protocolo completo.

## Cómo funciona

El proyecto se pasa como argumento: `/ghl-deploy ./mi-proyecto`

Si no se pasa argumento, se usa el directorio actual.

### Prerequisitos
- `GHL_API_KEY` y `GHL_LOCATION_ID` en `.env.local` del proyecto
- Una landing page con al menos un formulario de conversión
- (Opcional) `META_PIXEL_ID` y `META_ACCESS_TOKEN` para CAPI

### Resume

Si el deploy se interrumpe, al relanzar detecta `.ghl/state.json` y resume desde el punto exacto sin re-ejecutar agentes completados.

### Proceso

Lanza el agente `ghl-deploy-director` con el contexto del proyecto:

```
Agent: ghl-deploy-director
Prompt: "Despliega el funnel GHL completo para el proyecto en [path].

Sigue el protocolo de memoria en skills/ghl-deploy/MEMORY-PROTOCOL.md.
Ejecuta las 4 fases con sub-swarms especializados.
Si existe .ghl/state.json, resume desde el punto de interrupción."
```

### Output

Directorio `.ghl/` completo con:
- `analysis.md` + `audit.md` — Análisis del proyecto
- `scoring-model.md` + `scoring-questions.md` — Modelo de scoring
- `funnel-architecture.md` + `form-copy.md` — Arquitectura del funnel
- `infrastructure.md` — Infraestructura GHL con IDs reales
- `nurture-strategy.md` + `nurture-sequences.md` — Secuencias de nurturing
- `integration-code.md` — Código de integración
- `capi-strategy.md` + `capi-config.md` — Configuración CAPI
- `validation-final.md` — Checklist de coherencia
- `report.md` — Reporte final completo

## Skills individuales

Si prefieres ejecutar partes por separado (cada uno lanza su propio sub-swarm):
- `/ghl-setup` — Solo infraestructura base
- `/ghl-qualify` — Solo scoring (modeler + question designer)
- `/ghl-funnel` — Solo funnel (architect + form copywriter)
- `/ghl-nurture` — Solo nurturing (architect + copywriter)
- `/ghl-connect` — Solo integración landing↔GHL
- `/ghl-capi` — Solo CAPI (strategist + implementer)
- `/ghl-audit` — Auditoría de un setup existente

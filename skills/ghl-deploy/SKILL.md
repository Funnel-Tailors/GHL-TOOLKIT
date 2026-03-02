---
name: ghl-deploy
description: "Deploy a complete GHL funnel from an existing landing page. Orchestrates 6 specialized agents in parallel to analyze, design, build, and validate the entire qualification + nurturing + CAPI infrastructure. Use when the user has a landing page ready and wants the full GHL setup end-to-end, or when they say 'deploy GHL', 'full funnel setup', or 'connect everything'."
user-invocable: true
argument-hint: "[project-path]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, mcp__ghl__location_get, mcp__ghl__fields_list, mcp__ghl__pipeline_list, mcp__ghl__workflow_list, mcp__ghl__webhook_list, mcp__ghl__location_tags, mcp__ghl__contacts_search
---

# GHL Deploy — Despliegue Completo de Funnel GHL

Este skill invoca al agente `ghl-project-architect` para orquestar el despliegue completo de un funnel GHL desde una landing page existente.

## Qué hace

1. **Analiza** la landing page del proyecto (lee el código real)
2. **Diseña** en paralelo: scoring model + funnel architecture + infraestructura GHL
3. **Implementa** en paralelo: secuencias de nurturing + integración landing↔GHL + Meta CAPI
4. **Valida** la coherencia entre todas las piezas

## Cómo funciona

El proyecto se pasa como argumento: `/ghl-deploy ./mi-proyecto`

Si no se pasa argumento, se usa el directorio actual.

### Prerequisitos
- `GHL_API_KEY` y `GHL_LOCATION_ID` en `.env.local` del proyecto (o en variables de entorno)
- Una landing page con al menos un formulario de conversión
- (Opcional) `META_PIXEL_ID` y `META_ACCESS_TOKEN` para CAPI

### Proceso

Lanza el agente `ghl-project-architect` con el contexto del proyecto:

```
Agent: ghl-project-architect
Prompt: "Despliega el funnel GHL completo para el proyecto en [path].

Lee la landing page, analiza la oferta/avatar/ticket, y ejecuta las 4 fases:
1. ANÁLISIS: Lee el código, identifica oferta, avatar, framework, formularios
2. DISEÑO PARALELO: Lanza scoring-engineer + funnel-strategist + infra-engineer
3. IMPLEMENTACIÓN PARALELA: Lanza nurture-strategist + integration-engineer + capi-engineer
4. VALIDACIÓN: Verifica coherencia entre todos los outputs

El proyecto está en: $ARGUMENTS (o directorio actual si vacío)"
```

### Output esperado

Reporte completo con:
- Scoring model diseñado e implementado
- Funnel architecture con form multi-step y branching
- Infraestructura GHL creada (custom fields, pipeline, tags, webhooks)
- Secuencias de nurturing con copy real personalizado
- Código de integración landing↔GHL
- Configuración Meta CAPI con eventos y matching
- Pasos manuales pendientes (lo que no se puede hacer vía API)
- Verificación de coherencia entre todas las piezas

## Skills individuales

Si prefieres ejecutar partes por separado:
- `/ghl-setup` — Solo infraestructura base
- `/ghl-qualify` — Solo diseño/ejecución de scoring
- `/ghl-funnel` — Solo diseño de arquitectura del funnel
- `/ghl-nurture` — Solo secuencias de nurturing
- `/ghl-connect` — Solo integración landing↔GHL
- `/ghl-capi` — Solo configuración Meta CAPI
- `/ghl-audit` — Auditoría de un setup existente

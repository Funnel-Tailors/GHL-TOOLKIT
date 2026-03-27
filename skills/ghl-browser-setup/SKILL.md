---
name: ghl-browser-setup
description: "Create and fully configure a single GHL sub-account via browser automation. Uses Playwright MCP to log into the agency dashboard, create the sub-account, set up pipeline, calendar, workflows, and integrations. Complements API operations for custom fields and webhooks. Use when the user says 'create account', 'new sub-account', 'browser setup', or needs to set up a GHL location from scratch including things the API can't do."
user-invocable: true
argument-hint: "[--template template-name]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, mcp__playwright__browser_navigate, mcp__playwright__browser_click, mcp__playwright__browser_type, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_fill_form, mcp__playwright__browser_select_option, mcp__playwright__browser_wait_for, mcp__playwright__browser_evaluate, mcp__playwright__browser_tabs, mcp__playwright__browser_press_key, mcp__playwright__browser_close, mcp__playwright__browser_hover, mcp__playwright__browser_drag, mcp__playwright__browser_resize, mcp__playwright__browser_handle_dialog, mcp__ghl__location_get, mcp__ghl__fields_list, mcp__ghl__fields_create, mcp__ghl__pipeline_list, mcp__ghl__webhook_create, mcp__ghl__webhook_list, mcp__ghl__values_create, mcp__ghl__values_list, mcp__ghl__location_tags, mcp__ghl__workflow_list
---

# GHL Browser Setup — Creación y Configuración de Sub-cuenta via Navegador

Este skill crea y configura una sub-cuenta completa de GHL usando automatización de navegador (Playwright MCP) + API donde es más eficiente.

## Qué hace

1. **Login** en el dashboard de agencia via navegador
2. **Crea** la sub-cuenta siguiendo el wizard de GHL
3. **Captura** Location ID + API Key de la nueva cuenta
4. **Crea pipeline** con stages via navegador (API no puede)
5. **Crea custom fields** via API (más rápido que navegador)
6. **Crea calendario** via navegador (API no puede)
7. **Crea workflows** básicos via navegador (API no puede)
8. **Configura integraciones** (Meta, Stripe) via navegador
9. **Audita** el resultado final via API

## Arquitectura

```
ghl-browser-director (orquestador)
│
├── ghl-browser-auth → Login agencia
├── ghl-account-creator → Crear sub-cuenta + capturar credenciales
├── ghl-pipeline-builder → Pipeline + stages (BROWSER)
├── ghl-infra-engineer → Custom fields + webhooks (API)
├── ghl-calendar-builder → Calendario (BROWSER)
├── ghl-workflow-builder → Workflows básicos (BROWSER)
└── ghl-integration-configurator → Meta/Stripe (BROWSER)
```

## Cómo funciona

### Invocación
```
/ghl-browser-setup --template dental-clinic
/ghl-browser-setup
```

Si se pasa `--template`, usa el template YAML del directorio `templates/`.
Si no se pasa template, pregunta al usuario qué tipo de negocio configurar.

### Prerequisitos
- Credenciales de agencia en `.ghl-browser/secrets.env` o variables de entorno (`GHL_AGENCY_EMAIL`, `GHL_AGENCY_PASSWORD`)
- (Opcional) Template YAML en `templates/`
- Playwright MCP configurado en `~/.claude/settings.json`

### Proceso

Lanza el agente `ghl-browser-director` en modo single-account:

```
Agent: ghl-browser-director
Prompt: "Crea y configura UNA sub-cuenta de GHL.

Template: [nombre del template o 'default']
Datos de la cuenta: [nombre, email, teléfono, dirección si se proporcionaron]

Sigue el flujo completo:
1. Auth → Account Creation → Pipeline → Fields (API) → Calendar → Workflows → Integrations → Audit

Escribe resultados en .ghl/accounts/<nombre>/
Si existe .ghl/batch-queue.json con esta cuenta, resume desde el punto de interrupción."
```

### Output

```
.ghl/
├── browser-auth.md          # Estado de login
├── accounts/
│   └── <nombre-cuenta>/
│       ├── config.json      # Location ID + API Key
│       ├── creation.md      # Detalles de creación
│       └── setup.md         # Pipeline, calendar, workflows, integrations
```

## Browser vs API

| Operación | Método | Razón |
|---|---|---|
| Crear sub-cuenta | BROWSER | No hay API |
| Custom fields | API | Más rápido y fiable |
| Pipeline + stages | BROWSER | No hay API |
| Calendario | BROWSER | No hay API |
| Workflows | BROWSER | No hay API |
| Webhooks | API | Más rápido |
| Integraciones | BROWSER | Requiere UI |

## Templates

Los templates se leen de `templates/<nombre>.yaml`. Estructura:

```yaml
name: nombre-template
account:
  business_type: "tipo"
  timezone: "Europe/Madrid"
pipeline:
  name: "nombre"
  stages: [...]
custom_fields: [...]
calendar: {name, type, duration, buffer, availability}
workflows: [...]
integrations: {meta_pixel: true, stripe: false}
tags: [...]
```

Ver `templates/_base.yaml` para defaults y `templates/dental-clinic.yaml` para ejemplo completo.

## Referencia de UI

Consultar [UI-SELECTORS.md](UI-SELECTORS.md) para patrones de accesibilidad esperados en cada página de GHL.

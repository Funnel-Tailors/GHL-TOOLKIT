---
name: ghl-batch-create
description: "Create and configure MANY GHL sub-accounts in batch from a YAML file. Orchestrates sequential browser automation for each account: creation, pipeline, calendar, workflows, integrations, plus API for custom fields and webhooks. Supports resume from interruptions and error recovery. Use when the user says 'batch create', 'create multiple accounts', 'bulk setup', or wants to set up many GHL locations at once."
user-invocable: true
argument-hint: "[accounts.yaml] [--template template-name]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, mcp__playwright__browser_navigate, mcp__playwright__browser_click, mcp__playwright__browser_type, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_fill_form, mcp__playwright__browser_select_option, mcp__playwright__browser_wait_for, mcp__playwright__browser_evaluate, mcp__playwright__browser_tabs, mcp__playwright__browser_press_key, mcp__playwright__browser_close, mcp__playwright__browser_hover, mcp__playwright__browser_drag, mcp__playwright__browser_resize, mcp__playwright__browser_handle_dialog, mcp__ghl__location_get, mcp__ghl__fields_list, mcp__ghl__fields_create, mcp__ghl__pipeline_list, mcp__ghl__webhook_create, mcp__ghl__webhook_list, mcp__ghl__values_create, mcp__ghl__values_list, mcp__ghl__location_tags, mcp__ghl__workflow_list
---

# GHL Batch Create — Creación Masiva de Sub-cuentas

Este skill crea y configura MUCHAS sub-cuentas de GHL en batch usando automatización de navegador + API.

## Qué hace

1. **Lee** el archivo de cuentas (YAML) y el template
2. **Login** en el dashboard de agencia (una vez)
3. **Por cada cuenta**: crea sub-account, pipeline, fields, calendar, workflows, integrations
4. **Tracking**: batch-queue.json con estado por cuenta
5. **Resume**: si se interrumpe, retoma donde lo dejó
6. **Report**: resumen final con todas las cuentas creadas

## Invocación

```
/ghl-batch-create ./accounts.yaml
/ghl-batch-create ./accounts.yaml --template dental-clinic
/ghl-batch-create --template dental-clinic --count 10
```

### Argumentos
- `accounts.yaml` — Archivo YAML con lista de cuentas (ver formato abajo)
- `--template` — Template a usar para la configuración base
- `--count` — Si no hay archivo YAML, generar N cuentas con nombres auto-generados

## Formato del archivo de cuentas

```yaml
# accounts.yaml
template: dental-clinic
accounts:
  - name: "Clínica Dental Madrid Centro"
    email: "madrid@clinicadental.es"
    phone: "+34911234567"
    address:
      street: "Calle Gran Vía 42"
      city: "Madrid"
      state: "Madrid"
      zip: "28013"
      country: "ES"
  - name: "Clínica Dental Barcelona Eixample"
    email: "barcelona@clinicadental.es"
    phone: "+34931234567"
    address:
      street: "Carrer de Balmes 150"
      city: "Barcelona"
      state: "Barcelona"
      zip: "08008"
      country: "ES"
  # ... más cuentas
```

Campos mínimos por cuenta: `name`. El resto se hereda del template si no se especifica.

## Arquitectura

```
ghl-browser-director (orquestador del batch)
│
├── ghl-browser-auth → Login (una vez al inicio, re-auth si expira)
│
└── POR CADA CUENTA (secuencial):
    ├── ghl-account-creator → Sub-cuenta + credenciales
    ├── ghl-pipeline-builder → Pipeline + stages (BROWSER)
    ├── ghl-infra-engineer → Custom fields + webhooks (API)
    ├── ghl-calendar-builder → Calendario (BROWSER)
    ├── ghl-workflow-builder → Workflows (BROWSER)
    └── ghl-integration-configurator → Meta/Stripe (BROWSER)
```

**Procesamiento secuencial**: una cuenta a la vez (una instancia de browser).

## Prerequisitos

- Credenciales de agencia: `.ghl-browser/secrets.env` o env vars
- Template YAML: `templates/<nombre>.yaml`
- Archivo de cuentas: `accounts.yaml` o similar
- Playwright MCP configurado

## Batch Queue

Estado del batch en `.ghl/batch-queue.json`:
```json
{
  "batch_id": "batch-2026-03-26-001",
  "template": "dental-clinic",
  "total_accounts": 20,
  "accounts": [
    {"index": 1, "name": "...", "status": "completed", "location_id": "abc"},
    {"index": 2, "name": "...", "status": "in_progress", "current_phase": "pipeline"},
    {"index": 3, "name": "...", "status": "pending"}
  ]
}
```

Ver [BATCH-PROTOCOL.md](BATCH-PROTOCOL.md) para el protocolo completo.

## Resume

Si el batch se interrumpe:
1. Al relanzar, detecta `.ghl/batch-queue.json`
2. Salta cuentas `completed`
3. Resume cuentas `in_progress` desde `current_phase`
4. Continúa con `pending`
5. Reintenta `error` al final

## Manejo de errores

- Si una cuenta falla: screenshot + marcar error + **continuar con la siguiente**
- Si expira la sesión: re-autenticar y continuar
- Al final: reintentar cuentas fallidas
- Las cuentas completadas NUNCA se vuelven a procesar

## Output

```
.ghl/
├── batch-queue.json           # Estado del batch
├── browser-auth.md            # Estado de login
├── accounts-created.md        # Resumen final
├── accounts/
│   ├── clinica-dental-madrid/
│   │   ├── config.json        # Location ID + API Key
│   │   ├── creation.md        # Detalles de creación
│   │   └── setup.md           # Pipeline, calendar, workflows
│   ├── clinica-dental-barcelona/
│   │   └── ...
```

## Templates

Ver [TEMPLATES.md](TEMPLATES.md) para documentación del sistema de templates.

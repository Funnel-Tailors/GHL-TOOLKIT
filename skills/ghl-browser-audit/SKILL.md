---
name: ghl-browser-audit
description: "Audit GHL sub-accounts created via browser automation. Navigates to each sub-account and verifies that the configuration matches the template: pipeline stages, calendar, workflows, integrations. Takes screenshots for evidence. Use when the user wants to verify browser-created accounts, or says 'audit browser setup', 'verify accounts', 'check what was created'."
user-invocable: true
argument-hint: "[--account account-name | --all]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, mcp__playwright__browser_navigate, mcp__playwright__browser_click, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_wait_for, mcp__playwright__browser_evaluate, mcp__playwright__browser_tabs, mcp__ghl__location_get, mcp__ghl__fields_list, mcp__ghl__pipeline_list, mcp__ghl__webhook_list, mcp__ghl__location_tags, mcp__ghl__workflow_list
---

# GHL Browser Audit — Auditoría de Cuentas Creadas

Este skill audita sub-cuentas creadas via browser automation, verificando que la configuración real coincide con el template esperado.

## Qué hace

1. **Lee** el template usado y los config.json de las cuentas
2. **Navega** a cada sub-cuenta via browser
3. **Verifica** via browser: pipeline stages, calendario, workflows activos, integraciones
4. **Verifica** via API: custom fields, webhooks, tags
5. **Toma screenshots** de evidencia
6. **Genera report** con discrepancias encontradas

## Invocación

```
/ghl-browser-audit --all                    # Auditar todas las cuentas del último batch
/ghl-browser-audit --account clinica-madrid  # Auditar una cuenta específica
/ghl-browser-audit                          # Auditar todas (default)
```

## Proceso

### 1. Leer estado
- Lee `.ghl/batch-queue.json` para obtener lista de cuentas
- Lee `.ghl/accounts/*/config.json` para credenciales
- Lee template YAML para saber qué esperar

### 2. Login
- Usa `ghl-browser-auth` para asegurar sesión activa

### 3. Por cada cuenta
```
a. Navegar al sub-account
b. BROWSER: Verificar pipeline
   - ¿Existe el pipeline con el nombre correcto?
   - ¿Tiene todos los stages en el orden correcto?
c. API: Verificar custom fields
   - ¿Existen todos los campos del template?
   - ¿Tipos correctos?
d. BROWSER: Verificar calendario
   - ¿Existe el calendario?
   - ¿Disponibilidad correcta?
e. BROWSER: Verificar workflows
   - ¿Existen los workflows esperados?
   - ¿Están activos?
f. BROWSER: Verificar integraciones
   - ¿Meta Pixel conectado? (si aplica)
   - ¿Stripe conectado? (si aplica)
g. Screenshot de cada sección
```

### 4. Generar reporte

## Output

```markdown
# Audit Report: [batch_id o account_name]

## Resumen
- Cuentas auditadas: N
- Sin discrepancias: N
- Con discrepancias: N

## Por cuenta

### Clínica Dental Madrid
| Componente | Esperado | Encontrado | Estado |
|---|---|---|---|
| Pipeline | "Pacientes Dental" (9 stages) | "Pacientes Dental" (9 stages) | ✅ |
| Custom Fields | 12 campos | 12 campos | ✅ |
| Calendar | "Primera Visita" (Round Robin) | "Primera Visita" (Round Robin) | ✅ |
| Workflow "Nuevo Lead" | Activo | Activo | ✅ |
| Workflow "Recordatorio" | Activo | No encontrado | ❌ |
| Meta Pixel | Conectado | Conectado | ✅ |

### Discrepancias
| Cuenta | Componente | Problema | Acción Sugerida |
|---|---|---|---|
| Madrid | Workflow "Recordatorio" | No existe | Crear manualmente o re-ejecutar workflow-builder |

## Screenshots
[Referencias a screenshots tomados durante la auditoría]
```

## Combinación con /ghl-audit

Este skill se centra en verificar lo creado por browser automation contra el template. Para una auditoría más profunda de la configuración GHL (sin referencia a template), usa `/ghl-audit`.

---
name: ghl-setup
description: "Set up a new GHL location with all infrastructure: custom fields, pipeline, webhooks. Use when starting a new project that needs GoHighLevel integration, or when the user says 'set up GHL', 'configure GHL', or 'new funnel project'."
user-invocable: true
argument-hint: "[project-name]"
allowed-tools: Bash, Read, Write, Edit, mcp__ghl__location_get, mcp__ghl__fields_list, mcp__ghl__fields_create, mcp__ghl__pipeline_list, mcp__ghl__webhook_create, mcp__ghl__webhook_list, mcp__ghl__values_create
---

# GHL Setup — Configuración inicial de location

Eres un experto en GoHighLevel configurando la infraestructura base de un nuevo proyecto/funnel.

## Proceso

### 1. Verificar conexión
- Usa `location_get` para validar que las credenciales funcionan
- Si falla, pide al usuario que configure `GHL_API_KEY` y `GHL_LOCATION_ID` en su `.env.local`
- Muestra el nombre de la location para confirmar que es la correcta

### 2. Auditar estado actual
- Usa `fields_list` para ver qué custom fields ya existen
- Usa `pipeline_list` para ver pipelines existentes
- Usa `webhook_list` para ver webhooks registrados
- NO crear duplicados de lo que ya existe

### 3. Crear custom fields estándar
Solo crear los que NO existan ya. Referencia completa en [INFRASTRUCTURE.md](INFRASTRUCTURE.md).

Campos obligatorios:
- `lead_score` (NUMERICAL) — Puntuación total 0-100
- `qualification_status` (SINGLE_OPTIONS: HOT, WARM, COLD, DISQUALIFIED)
- `source_funnel` (TEXT) — Nombre del funnel de origen
- `form_responses` (LARGE_TEXT) — JSON con respuestas del formulario
- `qualification_date` (DATE)
- `utm_source` (TEXT)
- `utm_medium` (TEXT)
- `utm_campaign` (TEXT)
- `behavior_score` (NUMERICAL) — Score de comportamiento en página (0-30)
- `response_score` (NUMERICAL) — Score de respuestas (0-50)
- `engagement_level` (SINGLE_OPTIONS: HIGH, MEDIUM, LOW)
- `capi_events_sent` (LARGE_TEXT) — JSON de eventos Meta enviados

### 4. Crear pipeline base
Si no existe un pipeline de funnel, crear "Funnel Pipeline" con stages:
1. Lead Entrante
2. Cualificando
3. Cualificado HOT
4. Cualificado WARM
5. Cita Agendada
6. Cita Confirmada
7. Cita Completada
8. Cliente
9. Descartado

**NOTA**: La API v2 puede no soportar creación de pipelines directamente. Si no se puede vía API, generar instrucciones paso a paso para crearlo manualmente en GHL UI y continuar con el resto.

### 5. Generar archivo de proyecto
Crear o actualizar `.env.local` en el directorio del proyecto con:
```
GHL_API_KEY=<key actual>
GHL_LOCATION_ID=<location id actual>
```

Y crear `.env.example` (sin valores reales) para el repo.

### 6. Resumen
Mostrar resumen de todo lo configurado:
- Custom fields creados (con IDs)
- Pipeline y stages
- Webhooks registrados
- Próximos pasos recomendados

## Reglas
- NUNCA crear duplicados. Siempre verificar primero.
- Si un campo ya existe con nombre similar, preguntar antes de crear uno nuevo.
- Guardar los IDs de todo lo creado para referencia futura.
- El nombre del proyecto es `$ARGUMENTS` si se proporcionó.

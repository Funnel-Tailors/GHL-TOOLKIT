---
name: ghl-connect
description: "Connect landing page forms to GHL with behavior tracking, UTM capture, and custom field mapping. Use when the user wants to integrate a landing page with GHL, connect forms, add tracking, or when they mention 'connect landing', 'form integration', or 'webhook setup'."
user-invocable: true
argument-hint: "[project-path or landing-url]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch, mcp__ghl__fields_list, mcp__ghl__webhook_create, mcp__ghl__webhook_list, mcp__ghl__contacts_search, mcp__ghl__workflow_list
---

# GHL Connect — Conectar Landing Pages con GHL

Eres un experto en integración de formularios web con GoHighLevel. Tu misión: conectar cualquier landing page para que los form submissions lleguen a GHL con todos los datos de cualificación.

## Proceso

### 1. Analizar la Landing
- Leer el código del proyecto (si se pasa un path)
- Identificar formularios: campos, estructura, framework (React, Next.js, HTML puro)
- Identificar qué datos captura vs qué falta

### 2. Verificar Custom Fields en GHL
- `fields_list` para ver qué campos existen
- Si faltan campos necesarios, avisar (o ejecutar `/ghl-setup`)

### 3. Elegir Método de Integración

**Opción A: Webhook directo a GHL** (más simple)
```
Form Submit → POST a GHL Webhook URL → Workflow procesa
```
- Pros: Simple, sin middleware
- Contras: Menos control, no processing

**Opción B: Via API directa** (más control)
```
Form Submit → POST a API route del proyecto → GHL API contacts_create → Response
```
- Pros: Puedes procesar datos antes de enviar, mejor error handling
- Contras: Necesita backend/API route

**Opción C: Via Supabase Edge Function** (máximo control)
```
Form Submit → POST a Supabase → Procesar + Score → GHL API → Meta CAPI → Response
```
- Pros: Scoring en tiempo real, CAPI directo, logs
- Contras: Más infraestructura

### 4. Implementar Integración

#### Para cada método, generar:

1. **Código del formulario** con todos los campos necesarios:
   - Campos visibles (nombre, email, phone, preguntas de cualificación)
   - Hidden fields (UTMs, fbc, fbp, behavior data, event_id)

2. **Script de tracking** (behavior capture):
   ```javascript
   // Tiempo en página, scroll depth, video watch %
   // Se ejecuta antes del form submit
   ```

3. **Form handler** (submit logic):
   ```javascript
   // Recoge todos los campos
   // Envía a GHL (webhook/API/Supabase)
   // Redirect a thank you page según score
   ```

4. **Mapeo de campos** form → GHL custom fields:
   ```json
   {
     "name": "firstName + lastName",
     "email": "email",
     "phone": "phone",
     "budget_answer": "custom_field:budget_range",
     "timeline_answer": "custom_field:timeline",
     "utm_source": "custom_field:utm_source",
     "time_on_page": "custom_field:time_on_page"
   }
   ```

### 5. Thank You Page Dinámica

Si es posible con el framework del proyecto:
- Pasar score como URL param: `/thank-you?score=75&status=hot`
- Renderizar página personalizada:
  - HOT: Calendario embebido + urgencia
  - WARM: Social proof + calendario
  - COLD: Contenido gratuito + calendario opcional

### 6. Verificar

- Enviar form de prueba
- Verificar que el contacto se creó en GHL con todos los campos
- Verificar que el workflow se triggereó
- Verificar que los hidden fields se capturaron correctamente

## Webhook Patterns

Ver [WEBHOOK-PATTERNS.md](WEBHOOK-PATTERNS.md) para patrones detallados.

## Agente Especialista

Para una integración completa que lea el código real de la landing y genere código production-ready específico al framework, este skill es orquestado por el agente `ghl-integration-engineer` dentro del swarm del `ghl-project-architect`. Usa `/ghl-deploy` para el flujo completo.

## Reglas

- SIEMPRE capturar UTMs y behavior data, incluso si el formulario es simple
- NUNCA enviar datos sin validación básica (email válido, phone con formato)
- Los hidden fields NO deben ser visibles para el usuario
- El form submit debe ser rápido (< 2s). Si necesita processing, hacerlo async.
- Siempre incluir event_id para deduplicación Meta CAPI
- Si el proyecto usa Next.js, preferir Server Actions o API Routes
- Si es HTML puro, usar fetch directo al webhook/API

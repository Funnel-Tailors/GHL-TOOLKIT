---
name: ghl-capi
description: "Configure Meta Conversions API (CAPI) feedback in GHL workflows. Use when the user wants to set up CAPI events, optimize Meta ads with server-side tracking, or when they mention 'CAPI', 'Meta events', 'conversion tracking', or 'Facebook pixel server-side'."
user-invocable: true
argument-hint: "[project-name]"
allowed-tools: Bash, Read, Write, Edit, mcp__ghl__workflow_list, mcp__ghl__fields_list, mcp__ghl__contacts_get, mcp__ghl__contacts_update
---

# GHL CAPI — Configuración de Meta Conversions API

Eres un experto en Meta CAPI y tracking server-side. Tu misión: configurar el feedback loop entre GHL y Meta para que el algoritmo optimice hacia los leads que realmente compran.

## Concepto Clave

Meta optimiza hacia lo que le dices que es una "conversión". Si solo envías `Lead` (form submitted), Meta optimiza para formularios completados = muchos leads basura. Si envías eventos de mayor valor (appointment booked, sale closed), Meta aprende qué tipo de persona realmente convierte.

**La magia**: Enviar eventos con lead_score y qualification_status como custom_data para que Meta optimice hacia leads de alta calidad.

## Mapeo de Eventos Estándar

| Evento en GHL | Evento Meta | Cuándo | Valor para Meta |
|----------------|-------------|--------|-----------------|
| Form Submitted | Lead | Siempre | Bajo (todos lo hacen) |
| Qualification = HOT | CompleteRegistration | Score ≥ 70 | Alto (solo los buenos) |
| Appointment Booked | Schedule | Al agendar | Medio-Alto |
| Appointment Confirmed | InitiateCheckout | Al confirmar | Alto |
| Appointment Completed | Purchase (value=0) | Al asistir | Muy Alto |
| Sale Closed | Purchase (value=real) | Al comprar | Máximo |

Referencia completa en [EVENT-MAPPING.md](EVENT-MAPPING.md).

## Configuración en GHL

GHL tiene **Meta CAPI nativo** como action en workflows. NO necesitas código custom.

### Paso a paso:

1. **Prerequisitos en Meta Business Manager**:
   - Pixel ID configurado
   - Conversions API access token generado
   - Dominio verificado

2. **En GHL → Settings → Integrations → Facebook**:
   - Conectar cuenta de Facebook
   - Vincular Pixel ID
   - Habilitar Conversions API

3. **Crear workflows por evento**:
   Para cada evento del mapeo, crear un workflow:

   **Workflow: CAPI - Lead Event**
   - Trigger: Form Submitted
   - Action 1: Facebook Conversions API → Event: Lead
   - Action 2: Update Contact → capi_events_sent (append "Lead")
   - Action 3: Add Tag → capi-lead-sent

   **Workflow: CAPI - Qualified Lead**
   - Trigger: Tag Added = score-hot
   - Action 1: Facebook Conversions API → Event: CompleteRegistration
   - Custom Data: lead_score, qualification_status
   - Action 2: Update Contact → capi_events_sent (append "CompleteRegistration")

   **Workflow: CAPI - Appointment**
   - Trigger: Appointment Booked
   - Action 1: Facebook Conversions API → Event: Schedule
   - Action 2: Add Tag → capi-schedule-sent

   **Workflow: CAPI - Purchase**
   - Trigger: Opportunity Status = Won
   - Action 1: Facebook Conversions API → Event: Purchase, Value: {{opportunity.monetary_value}}
   - Action 2: Add Tag → capi-purchase-sent

### Datos enriquecidos para CAPI

Enviar siempre que sea posible:
```
user_data:
  em: {{contact.email}} (hashed)
  ph: {{contact.phone}} (hashed)
  fn: {{contact.first_name}} (hashed)
  ln: {{contact.last_name}} (hashed)
  ct: {{contact.city}} (hashed)
  st: {{contact.state}} (hashed)
  country: {{contact.country}} (hashed)
  fbc: {{contact.custom_field.fb_click_id}}
  fbp: {{contact.custom_field.fb_browser_id}}

custom_data:
  lead_score: {{contact.custom_field.lead_score}}
  qualification_status: {{contact.custom_field.qualification_status}}
  source_funnel: {{contact.custom_field.source_funnel}}
  value: {{opportunity.monetary_value}}
```

## Custom Conversions en Meta

Para cada proyecto, crear Custom Conversions en Meta Ads Manager:
1. **Qualified Lead**: Basado en CompleteRegistration con lead_score ≥ 70
2. **Hot Appointment**: Basado en Schedule con qualification_status = HOT
3. **Confirmed Show**: Basado en InitiateCheckout
4. **Closed Sale**: Basado en Purchase con value > 0

Esto permite optimizar campañas específicamente para cada etapa del funnel.

## Reglas

- SIEMPRE incluir event_id para deduplicación browser ↔ server
- Capturar fbc y fbp en el formulario como hidden fields
- Enviar hashed PII (email, phone, name) — GHL lo hace automáticamente via CAPI nativo
- Testear en Meta Events Manager → Test Events antes de activar en producción
- Verificar que no hay eventos duplicados (browser pixel + server CAPI)

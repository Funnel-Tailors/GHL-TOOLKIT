# Infraestructura GHL Estándar

## Custom Fields Completos

### Core Scoring
| Campo | Tipo | Descripción |
|-------|------|-------------|
| lead_score | NUMERICAL | Puntuación total 0-100 (response + behavior + engagement) |
| response_score | NUMERICAL | Score basado en respuestas de formulario (0-50) |
| behavior_score | NUMERICAL | Score basado en comportamiento en página (0-30) |
| engagement_level | SINGLE_OPTIONS | HIGH / MEDIUM / LOW |
| qualification_status | SINGLE_OPTIONS | HOT / WARM / COLD / DISQUALIFIED |
| qualification_date | DATE | Fecha en la que se cualificó |

### Tracking de Origen
| Campo | Tipo | Descripción |
|-------|------|-------------|
| source_funnel | TEXT | Nombre del funnel (ej: "webinar-launch-q1") |
| utm_source | TEXT | UTM source del tráfico |
| utm_medium | TEXT | UTM medium |
| utm_campaign | TEXT | UTM campaign |
| utm_content | TEXT | UTM content (opcional) |
| utm_term | TEXT | UTM term (opcional) |
| landing_url | TEXT | URL de la landing page donde entró |

### Datos de Formulario
| Campo | Tipo | Descripción |
|-------|------|-------------|
| form_responses | LARGE_TEXT | JSON con todas las respuestas |
| form_step_reached | NUMERICAL | Último step del multi-step form completado |
| form_completion_time | TEXT | Tiempo que tardó en completar el form (segundos) |

### Comportamiento en Página
| Campo | Tipo | Descripción |
|-------|------|-------------|
| time_on_page | NUMERICAL | Segundos en la página |
| scroll_depth | NUMERICAL | Porcentaje de scroll (0-100) |
| video_watch_pct | NUMERICAL | Porcentaje de video visto (0-100) |
| page_visits | NUMERICAL | Número total de visitas a la landing |
| pricing_page_viewed | CHECKBOX | Si visitó página de pricing |

### Meta CAPI
| Campo | Tipo | Descripción |
|-------|------|-------------|
| capi_events_sent | LARGE_TEXT | JSON con eventos enviados a Meta |
| fb_click_id | TEXT | fbc (Facebook Click ID) |
| fb_browser_id | TEXT | fbp (Facebook Browser ID) |
| meta_lead_event_id | TEXT | Event ID para deduplicación |

### Citas y Seguimiento
| Campo | Tipo | Descripción |
|-------|------|-------------|
| appointment_reminder_level | SINGLE_OPTIONS | HOT_REMINDER / WARM_REMINDER / COLD_REMINDER |
| no_show_count | NUMERICAL | Veces que no se presentó |
| last_nurture_sequence | TEXT | Nombre de la última secuencia de nurturing |
| days_since_first_touch | NUMERICAL | Días desde primer contacto |

## Pipeline Base: Funnel Pipeline

### Stages (en orden)
1. **Lead Entrante** — Acaba de enviar el formulario
2. **Cualificando** — En proceso de scoring (automático)
3. **Cualificado HOT** — Score ≥ 70, listo para cerrar
4. **Cualificado WARM** — Score 40-69, necesita nurturing
5. **Cita Agendada** — Ha reservado slot en calendario
6. **Cita Confirmada** — Ha confirmado asistencia
7. **Cita Completada** — Asistió a la llamada
8. **Cliente** — Compró / Cerrado Won
9. **Descartado** — No cualificado o perdido

### Lógica de Movimiento Automático
- Lead entra → **Lead Entrante**
- Scoring ejecutado → **Cualificado HOT/WARM** o **Descartado** (si COLD/DISQUALIFIED)
- Agenda cita → **Cita Agendada**
- Confirma → **Cita Confirmada**
- Asiste → **Cita Completada**
- Compra → **Cliente**

## Tags Estándar

### Scoring
- `score-hot`, `score-warm`, `score-cold`, `score-disqualified`

### Funnel Stage
- `funnel-entered`, `form-completed`, `appointment-booked`, `appointment-confirmed`, `appointment-completed`, `sale-closed`

### Nurturing
- `nurture-active`, `nurture-completed`, `nurture-paused`
- `reminder-24h-sent`, `reminder-2h-sent`, `reminder-15min-sent`

### Meta CAPI
- `capi-lead-sent`, `capi-registration-sent`, `capi-schedule-sent`, `capi-purchase-sent`

# Audit Checklist — Checklist Completa de Auditoría

## Custom Fields (20 puntos)

### Core Scoring (8 puntos)
- [ ] lead_score (NUMERICAL) — 2 pts
- [ ] response_score (NUMERICAL) — 1 pt
- [ ] behavior_score (NUMERICAL) — 1 pt
- [ ] qualification_status (SINGLE_OPTIONS: HOT/WARM/COLD/DISQUALIFIED) — 2 pts
- [ ] engagement_level (SINGLE_OPTIONS: HIGH/MEDIUM/LOW) — 1 pt
- [ ] qualification_date (DATE) — 1 pt

### Tracking (5 puntos)
- [ ] source_funnel (TEXT) — 1 pt
- [ ] utm_source (TEXT) — 1 pt
- [ ] utm_medium (TEXT) — 1 pt
- [ ] utm_campaign (TEXT) — 1 pt
- [ ] landing_url (TEXT) — 1 pt

### Datos de Formulario (4 puntos)
- [ ] form_responses (LARGE_TEXT) — 2 pts
- [ ] form_step_reached (NUMERICAL) — 1 pt
- [ ] form_completion_time (TEXT) — 1 pt

### Meta CAPI (3 puntos)
- [ ] fb_click_id (TEXT) — 1 pt
- [ ] fb_browser_id (TEXT) — 1 pt
- [ ] capi_events_sent (LARGE_TEXT) — 1 pt

## Pipeline (20 puntos)

### Estructura (10 puntos)
- [ ] Pipeline de funnel existe — 3 pts
- [ ] Stage: Lead Entrante — 1 pt
- [ ] Stage: Cualificando — 1 pt
- [ ] Stage: Cualificado HOT — 1 pt
- [ ] Stage: Cualificado WARM — 1 pt
- [ ] Stage: Cita Agendada — 1 pt
- [ ] Stage: Cita Confirmada — 1 pt
- [ ] Stage: Cliente / Won — 1 pt

### Salud (10 puntos)
- [ ] No hay leads en "Lead Entrante" > 7 días — 3 pts
- [ ] No hay leads en "Cualificando" > 48h — 2 pts
- [ ] Ratio HOT/total > 15% — 2 pts
- [ ] Ratio Cita Agendada/Cualificado > 30% — 3 pts

## Workflows (20 puntos)

### Esenciales (12 puntos)
- [ ] Post-form inmediato (SMS/email) — 3 pts
- [ ] Scoring automático on contact create — 3 pts
- [ ] Recordatorios pre-llamada (-24h, -2h, -15min) — 3 pts
- [ ] No-show recovery — 3 pts

### Importantes (8 puntos)
- [ ] Nurturing pre-agenda (si no agenda en 24h) — 2 pts
- [ ] Confirmación de cita — 2 pts
- [ ] Post-llamada follow-up — 2 pts
- [ ] CAPI event triggers — 2 pts

## Tags (10 puntos)

### Scoring tags (4 puntos)
- [ ] score-hot — 1 pt
- [ ] score-warm — 1 pt
- [ ] score-cold — 1 pt
- [ ] score-disqualified — 1 pt

### Funnel stage tags (3 puntos)
- [ ] funnel-entered — 1 pt
- [ ] appointment-booked — 1 pt
- [ ] sale-closed — 1 pt

### Consistency (3 puntos)
- [ ] Nomenclatura consistente (kebab-case) — 1 pt
- [ ] No hay tags duplicados (similar naming) — 1 pt
- [ ] No hay tags huérfanos (0 contactos) — 1 pt

## Webhooks (10 puntos)

- [ ] Al menos 1 webhook activo — 3 pts
- [ ] URLs respondiendo (no 404/500) — 3 pts
- [ ] Eventos cubiertos: contact.create, opportunity.update — 2 pts
- [ ] Eventos cubiertos: appointment.* — 2 pts

## Contactos - Sample Check (20 puntos)

### Data Quality (10 puntos)
- [ ] > 90% tienen email — 3 pts
- [ ] > 80% tienen phone — 2 pts
- [ ] > 50% tienen lead_score relleno — 3 pts
- [ ] > 30% tienen behavior_score — 2 pts

### Scoring Health (5 puntos)
- [ ] Distribución razonable (no todo HOT o todo COLD) — 3 pts
- [ ] Scores actualizados en últimos 7 días — 2 pts

### Engagement (5 puntos)
- [ ] > 50% tienen tags de scoring — 2 pts
- [ ] > 30% tienen notas — 1 pt
- [ ] > 20% están en pipeline activo — 2 pts

## Puntuación Total

| Área | Max |
|------|-----|
| Custom Fields | 20 |
| Pipeline | 20 |
| Workflows | 20 |
| Tags | 10 |
| Webhooks | 10 |
| Contactos | 20 |
| **TOTAL** | **100** |

### Interpretación
- **90-100**: Setup excelente, solo fine-tuning
- **70-89**: Bueno, pero hay gaps importantes
- **50-69**: Funcional pero le falta bastante
- **< 50**: Setup incompleto, ejecutar /ghl-setup

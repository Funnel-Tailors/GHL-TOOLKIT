# Qualification Flows — Patrones de Cualificación Progresiva

## Concepto: Cualificación Progresiva

En lugar de hacer 10 preguntas de golpe, la cualificación se distribuye en múltiples touchpoints:

```
Step 1 (Landing): Behavior tracking automático → Behavior Score
Step 2 (Form): 3-5 preguntas estratégicas → Response Score
Step 3 (Post-form): Engagement con mensajes → Engagement Score
Step 4 (Pre-call): Respuestas a recordatorios → Score refinado
```

Cada step suma al score total. Cuanto más avanza el lead, más sabemos de él.

## Patrón 1: Progressive Profiling

En lugar de un formulario largo, usa múltiples formularios cortos:

**Form 1 (en la landing)**: Nombre, email, phone
→ Score base: 10 puntos (completó form básico)

**Form 2 (en thank you page)**: Sector, empresa, rol
→ Score adicional: según ICP fit

**Form 3 (en email de nurturing)**: Presupuesto, timeline
→ Score adicional: según capacidad y urgencia

**Resultado**: El lead ni siquiera siente que está siendo cualificado. Cada interacción es natural y aporta valor.

## Patrón 2: Micro-Commitments

Cada pequeña acción suma puntos y compromiso:

```
Click en ad             → 0 puntos (no tracked)
Visita landing          → 2 puntos (time_on_page)
Scroll > 50%            → 3 puntos
Video > 25%             → 3 puntos
Video > 75%             → 7 puntos
Inicia formulario       → 5 puntos
Completa step 1 de form → 5 puntos
Completa step 2 de form → 10 puntos
Completa form           → 15 puntos
Abre email              → 3 puntos
Click en email          → 5 puntos
Responde SMS            → 10 puntos
Agenda cita             → 15 puntos
Confirma cita           → 5 puntos
Asiste a cita           → 10 puntos
─────────────────────────────────
Total posible:          ~100 puntos
```

## Patrón 3: Smart Branching

Las preguntas del form dependen de las respuestas anteriores:

```
Pregunta 1: "¿Eres empresario o empleado?"
  ├─ Empresario → Pregunta 2A: "¿Cuántos empleados?"
  │   ├─ < 5 → Score +3, flujo para micropymes
  │   ├─ 5-50 → Score +8, flujo para pymes
  │   └─ > 50 → Score +10, flujo para enterprise
  │
  └─ Empleado → Pregunta 2B: "¿Puedes tomar decisiones de compra?"
      ├─ Sí → Score +8, continuar
      └─ No → Score +2, preguntar quién decide
```

**Implementación**: Esto se hace en la landing con JavaScript. Cada branch envía los datos a GHL con los custom fields correspondientes.

## Patrón 4: Intent Signals

Señales que revelan intención de compra sin preguntar directamente:

| Señal | Lo que revela | Score |
|-------|---------------|-------|
| Visita pricing antes del form | Intención de compra alta | +8 |
| Vuelve a la landing 2+ veces | Está comparando opciones | +5 |
| Lee testimonios/casos | Busca validación social | +5 |
| Descarga lead magnet | Quiere aprender, no comprar (aún) | +3 |
| Comparte en redes | Embajador potencial | +5 |
| Envía email preguntando | Está activamente interesado | +10 |

## Patrón 5: Disqualification Checkpoints

En ciertos puntos, descartar activamente leads que no encajan:

**Checkpoint 1 (Form pregunta 2)**: Si presupuesto < mínimo → DISQUALIFIED
- Redirect a página de contenido gratuito
- No agendar llamada
- Ahorrar tiempo del equipo de ventas

**Checkpoint 2 (Post-form)**: Si no abre emails en 72h → COLD
- Reducir frecuencia de nurturing
- Reasignar a secuencia pasiva

**Checkpoint 3 (Pre-call)**: Si no confirma cita → Reducir prioridad
- No enviar recordatorio de 15 min
- Si no-show → secuencia de recovery light

## Implementación Técnica en GHL

### Custom Fields necesarios
```
form_step_reached (NUMERICAL): 1, 2, 3, 4, 5
form_branch (TEXT): "enterprise", "pyme", "freelance"
intent_signals (LARGE_TEXT): JSON de señales detectadas
disqualified_reason (TEXT): "budget", "not_decision_maker", "competitor"
qualification_method (TEXT): "auto", "manual", "hybrid"
```

### Tags de Cualificación Progresiva
```
qual-step-1, qual-step-2, qual-step-3
qual-hot, qual-warm, qual-cold, qual-disqualified
qual-checkpoint-passed, qual-checkpoint-failed
intent-high, intent-medium, intent-low
```

### Workflows de GHL

**Workflow 1: Auto-Score on Form Submit**
- Trigger: Form submitted / Webhook received
- Condition: Check form_responses
- Actions: Calculate scores, update fields, add tags, move pipeline stage

**Workflow 2: Re-Score on Engagement**
- Trigger: Email opened / SMS replied / Tag added
- Actions: Recalculate engagement_score, update lead_score, check if status changed

**Workflow 3: Decay Check (daily)**
- Trigger: Scheduled daily at midnight
- Condition: days_since_last_engagement > 3
- Actions: Reduce scores, update status if thresholds crossed
```

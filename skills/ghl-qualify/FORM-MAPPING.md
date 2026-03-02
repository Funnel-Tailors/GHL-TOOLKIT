# Form Mapping — Cómo mapear respuestas a scores

## Principio

Cada pregunta del formulario de cualificación tiene un objetivo de scoring específico. El mapeo define qué respuesta equivale a cuántos puntos.

## Preguntas Universales (aplican a casi todo funnel)

### 1. Pregunta de Presupuesto
**Objetivo**: Capacidad de inversión
```
"¿Cuánto estás dispuesto a invertir en [solución]?"
- Más de [ticket x2]: +20 (encaja perfectamente)
- [ticket x1 - ticket x2]: +15 (puede pagar)
- [ticket x0.5 - ticket x1]: +10 (justo, pero posible)
- Menos de [ticket x0.5]: +0 (probablemente no compre)
```

### 2. Pregunta de Urgencia/Timeline
**Objetivo**: Velocidad de decisión
```
"¿Cuándo necesitas resolver esto?"
- Ya / Esta semana: +15 (urgencia máxima)
- Este mes: +10 (urgencia alta)
- Este trimestre: +5 (urgencia media)
- Solo estoy explorando: -15 (no hay urgencia)
```

### 3. Pregunta de Rol/Decisor
**Objetivo**: Autoridad de compra
```
"¿Qué rol tienes en tu empresa?"
- CEO / Fundador / Director: +10 (decision maker)
- Manager / Responsable de área: +8 (influencer fuerte)
- Empleado: +3 (puede recomendar)
- Freelance / Estudiante: +0 a -5 (depende del producto)
```

### 4. Pregunta de Problema
**Objetivo**: Dolor identificado
```
"¿Cuál es tu mayor desafío con [área]?"
- Respuesta específica y detallada: +10
- Respuesta genérica: +5
- "No estoy seguro": +0
```

### 5. Pregunta de Intentos Previos
**Objetivo**: Madurez del lead
```
"¿Has intentado resolver esto antes?"
- Sí, he invertido en soluciones: +10 (sabe que cuesta dinero)
- Sí, pero no funcionó: +8 (frustrado, busca alternativa)
- No, es la primera vez: +3 (puede no entender el valor)
```

## Preguntas Específicas por Tipo de Funnel

### Funnel de Consultoría
- "¿Cuántos empleados tiene tu empresa?" → Califica tamaño
- "¿Facturación anual aproximada?" → Califica capacidad de pago

### Funnel de SaaS
- "¿Qué herramientas usas actualmente?" → Product fit
- "¿Cuántas personas usarían la herramienta?" → Potencial de contrato

### Funnel de Formación
- "¿Cuál es tu nivel actual en [tema]?" → Fit del programa
- "¿Puedes dedicar X horas semanales?" → Compromiso

### Funnel de E-commerce High Ticket
- "¿Para cuándo lo necesitas?" → Urgencia
- "¿Has comprado productos similares antes?" → Buyer behavior

## Hidden Fields (No preguntas, se capturan automáticamente)

Estos se envían como hidden fields en el formulario:
```
utm_source, utm_medium, utm_campaign, utm_content, utm_term
landing_url (window.location.href)
referrer (document.referrer)
time_on_page (calculado con JS)
scroll_depth (calculado con JS)
video_watch_pct (YouTube/Vimeo API)
device_type (mobile/desktop/tablet)
```

## Formato de Almacenamiento en GHL

Las respuestas se guardan en `form_responses` como JSON:
```json
{
  "submitted_at": "2026-03-02T15:30:00Z",
  "form_id": "funnel-qualifier-v1",
  "responses": {
    "budget": "5k+",
    "timeline": "this_month",
    "role": "ceo",
    "problem": "No consigo leads cualificados para mi equipo de ventas",
    "previous_attempts": "yes_invested"
  },
  "hidden": {
    "utm_source": "facebook",
    "utm_campaign": "launch-q1",
    "time_on_page": 245,
    "scroll_depth": 87,
    "video_watch_pct": 72,
    "device_type": "mobile"
  },
  "calculated_scores": {
    "response_score": 45,
    "behavior_score": 25,
    "engagement_score": 0,
    "total": 70,
    "status": "HOT"
  }
}
```

# Scoring Rules — Framework Completo

## Principios de Scoring

1. **Objetivo**: Predecir la probabilidad de que un lead compre tras la llamada
2. **No es binario**: Un score permite priorizar, no solo filtrar
3. **Dinámico**: El score puede subir con engagement posterior
4. **Transparente**: Cada punto tiene justificación clara

## Personalización por Tipo de Negocio

### High Ticket (> 2000€)
- Peso mayor en: decision maker (+15), presupuesto (+20), urgencia (+15)
- Behavior score menos relevante (reducir a 0-20)
- Engagement score crítico (subir a 0-30)
- Umbral HOT: ≥ 75

### Mid Ticket (500-2000€)
- Scoring estándar (50/30/20)
- Umbral HOT: ≥ 70

### Low Ticket (< 500€)
- Peso mayor en: behavior score (+40) y engagement (+30)
- Response score menor (0-30)
- Umbral HOT: ≥ 60

### SaaS / Suscripción
- Añadir dimensión: Product Fit Score (0-20)
- ¿Usa herramientas similares? +10
- ¿Tiene el equipo para usarlo? +10
- Ajustar total a 0-120, normalizar a 0-100

## Scoring Negativo (Descalificadores)

Algunos criterios restan puntos o descalifican directamente:

| Señal | Efecto |
|-------|--------|
| "Solo estoy mirando" | -15 puntos |
| Sin presupuesto declarado | -10 puntos |
| Competidor identificado | DISQUALIFIED |
| Email falso/temporal | DISQUALIFIED |
| País/zona no servida | DISQUALIFIED |
| Menor de edad (si aplica) | DISQUALIFIED |

## Decay (Deterioro temporal)

El score se deteriora si el lead no interactúa:
- Después de 3 días sin engagement: -5 puntos
- Después de 7 días: -10 puntos
- Después de 14 días: -20 puntos
- Después de 30 días: score = COLD automáticamente

## Score Recalculation Triggers

Recalcular score cuando:
1. Nuevo form submission recibido
2. Email abierto o link clickeado
3. SMS respondido
4. Cita agendada (+15 automático)
5. Cita cancelada (-10)
6. No-show (-20)
7. Manual request del equipo

## Ejemplo de Configuración por Proyecto

```json
{
  "projectName": "webinardos-launch",
  "scoring": {
    "response": {
      "max": 50,
      "criteria": [
        {"question": "budget", "values": {"5k+": 20, "2k-5k": 15, "1k-2k": 10, "<1k": 0}},
        {"question": "timeline", "values": {"this_month": 15, "this_quarter": 10, "this_year": 5, "just_looking": -15}},
        {"question": "role", "values": {"ceo": 10, "marketing_director": 10, "employee": 5, "student": -10}},
        {"question": "problem", "values": {"specific": 10, "vague": 5, "none": 0}}
      ]
    },
    "behavior": {
      "max": 30,
      "criteria": [
        {"metric": "time_on_page", "threshold": 180, "points": 10},
        {"metric": "video_watch_pct", "threshold": 50, "points": 10},
        {"metric": "pricing_page_viewed", "threshold": true, "points": 5},
        {"metric": "page_visits", "threshold": 2, "points": 5}
      ]
    },
    "engagement": {
      "max": 20,
      "criteria": [
        {"event": "email_opened", "points": 5},
        {"event": "email_clicked", "points": 5},
        {"event": "sms_replied", "points": 10}
      ]
    },
    "thresholds": {
      "hot": 70,
      "warm": 40,
      "cold": 20
    },
    "disqualifiers": ["competitor", "fake_email", "underage"]
  }
}
```

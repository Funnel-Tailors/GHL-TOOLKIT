---
name: ghl-qualify
description: "Design and execute lead qualification and scoring criteria for a GHL funnel. Use when the user wants to set up scoring rules, qualify leads, define qualification criteria, or when they mention 'scoring', 'lead quality', or 'qualification'."
user-invocable: true
argument-hint: "[project-name or contact-id]"
allowed-tools: Bash, Read, Write, Edit, mcp__ghl__contacts_search, mcp__ghl__contacts_get, mcp__ghl__contacts_update, mcp__ghl__contacts_add_tags, mcp__ghl__contacts_remove_tags, mcp__ghl__contacts_add_note, mcp__ghl__opportunity_create, mcp__ghl__opportunity_move_stage, mcp__ghl__opportunity_search, mcp__ghl__pipeline_list, mcp__ghl__fields_list
---

# GHL Qualify — Motor de Cualificación de Leads

Eres un experto en cualificación de leads y scoring avanzado. Tu misión: definir criterios de cualificación que maximicen la calidad de los leads que llegan a la llamada de ventas.

## Modos de Operación

### Modo 1: DISEÑAR criterios (sin contactId)
Si el usuario quiere diseñar/ajustar criterios de scoring para un proyecto:

1. **Entender el negocio**: Pregunta sobre oferta, avatar, ticket, objeciones principales
2. **Diseñar scoring**: Usa el framework de 3 dimensiones (ver [SCORING-RULES.md](SCORING-RULES.md))
3. **Mapear formularios**: Define qué respuesta da cuántos puntos (ver [FORM-MAPPING.md](FORM-MAPPING.md))
4. **Definir umbrales**: HOT/WARM/COLD/DISQUALIFIED
5. **Generar configuración**: Crear archivo de reglas para el proyecto

### Modo 2: EJECUTAR scoring (con contactId)
Si se pasa un contactId como argumento:

1. **Obtener datos**: `contacts_get` para traer todo el perfil
2. **Calcular score**: Aplicar reglas del proyecto al contacto
3. **Actualizar contacto**:
   - `contacts_update` → lead_score, response_score, behavior_score, qualification_status
   - `contacts_add_tags` → score-hot / score-warm / score-cold / score-disqualified
4. **Mover en pipeline**: `opportunity_move_stage` al stage correspondiente
5. **Añadir nota**: `contacts_add_note` con desglose del scoring

## Framework de Scoring (3 Dimensiones)

### Response Score (0-50 puntos)
Basado en respuestas del formulario de cualificación:

| Criterio | Puntos | Lógica |
|----------|--------|--------|
| Presupuesto adecuado | +15 | Respuesta indica capacidad de inversión |
| Urgencia alta | +10 | "Lo necesito ya" / "Este mes" |
| Decision maker | +10 | Es quien toma la decisión de compra |
| Problema claro | +10 | Ha identificado un problema específico |
| Encaja en ICP | +5 | Perfil demográfico/profesional correcto |

### Behavior Score (0-30 puntos)
Basado en comportamiento en la página:

| Criterio | Puntos | Lógica |
|----------|--------|--------|
| Tiempo en página > 3min | +10 | Alto interés |
| Video visto > 50% | +10 | Consumió el contenido |
| Visitó pricing | +5 | Intención de compra |
| Múltiples visitas | +5 | Recurrencia = interés real |

### Engagement Score (0-20 puntos)
Basado en interacción post-formulario:

| Criterio | Puntos | Lógica |
|----------|--------|--------|
| Abrió email confirmación | +5 | Está atento |
| Clickeó link en email | +5 | Engagement activo |
| Respondió SMS | +10 | Máximo engagement |

### Umbrales de Cualificación

| Status | Score Total | Acción |
|--------|------------|--------|
| **HOT** | ≥ 70 | Prioridad máxima. Agenda inmediata. Recordatorios directos. |
| **WARM** | 40–69 | Nurturing activo. Social proof. Recordatorios con valor. |
| **COLD** | 20–39 | Nurturing suave. Puede reactivarse. |
| **DISQUALIFIED** | < 20 | No encaja. Marcar y no invertir recursos. |

## Reglas

- Los criterios son 100% configurables por proyecto. Los de arriba son defaults.
- SIEMPRE mostrar el desglose del score al actualizar un contacto.
- NUNCA sobrescribir un score sin mostrar antes el anterior y el nuevo.
- Si un contacto ya tiene score, preguntar antes de recalcular.
- Documentar las reglas de cada proyecto para que sean reproducibles.

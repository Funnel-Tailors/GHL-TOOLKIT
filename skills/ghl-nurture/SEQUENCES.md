# Sequences — Templates de Secuencias Completas

## Secuencia 1: Post-Formulario Inmediato

### SMS (enviar en < 2 minutos)
```
HOT:
"{{contact.first_name}}, recibido. He visto tus respuestas y encajas perfecto. Agenda tu llamada aquí y hablamos esta semana: {{calendar_link}}"

WARM:
"{{contact.first_name}}, gracias por completar el formulario. Te he preparado una llamada donde veremos tu caso. Elige tu mejor hora: {{calendar_link}}"

COLD:
"{{contact.first_name}}, hemos recibido tu info. Agenda una llamada rápida para ver si podemos ayudarte: {{calendar_link}}"
```

### Email (enviar en < 5 minutos)
```
Subject: "{{contact.first_name}}, tu próximo paso"

Body:
Hola {{contact.first_name}},

He recibido tus respuestas y [personalizar según score].

En nuestra llamada vamos a:
1. [Punto de valor 1 basado en su problema]
2. [Punto de valor 2]
3. [Plan de acción personalizado]

👉 Agenda aquí: {{calendar_link}}

[Firma]

P.D.: [Urgencia/escasez si aplica]
```

## Secuencia 2: Nurturing Pre-Agenda

### Día 1 — Social Proof (SMS)
```
"{{contact.first_name}}, [nombre cliente] estaba en tu misma situación. En 3 meses pasó de [estado antes] a [resultado]. ¿Quieres saber cómo? Agenda: {{calendar_link}}"
```

### Día 2 — Caso de Estudio (Email)
```
Subject: "Cómo [nombre] consiguió [resultado] en [tiempo]"

Body:
{{contact.first_name}},

Quiero que conozcas a [nombre del caso].

Tenía [problema similar al del lead].
Probó [soluciones que no funcionaron].
Hasta que [descubrió/implementó nuestra solución].

Resultado: [métrica concreta y timeline].

Si quieres un plan similar para tu caso:
👉 {{calendar_link}}

[Firma]
```

### Día 3 — Urgencia (SMS)
```
"{{contact.first_name}}, solo aceptamos [X] proyectos al mes y quedan [Y] plazas para [mes]. Si quieres entrar, agenda antes del [fecha]: {{calendar_link}}"
```

### Día 5 — Valor + Última Oportunidad (Email)
```
Subject: "{{contact.first_name}}, última oportunidad esta semana"

Body:
{{contact.first_name}},

He guardado un hueco para hablar contigo pero no te he visto agendarte.

Mira, en la llamada te voy a dar [algo de valor gratuito]:
- [Valor 1]
- [Valor 2]
- [Valor 3]

Sin compromiso. 30 minutos. Y si no es para ti, te lo diré yo mismo.

👉 Últimos huecos: {{calendar_link}}

[Firma]
```

### Día 7 — Check Final (SMS)
```
"{{contact.first_name}}, ¿sigues buscando [solución]? Si sí, me quedan huecos esta semana: {{calendar_link}}. Si no, sin problema — te deseo lo mejor."
```

## Secuencia 3: Recordatorios Pre-Llamada

### -24 horas
```
HOT SMS: "{{contact.first_name}}, mañana a las {{appointment_time}}. ¿Todo listo? Responde OK para confirmar."

WARM Email:
Subject: "Mañana hablamos, {{contact.first_name}}"
Body: "Mañana a las {{appointment_time}} nos vemos. Para que la llamada sea productiva, vamos a hablar de: [3 puntos basados en sus respuestas]. Link: {{zoom_link}}"

COLD SMS: "{{contact.first_name}}, mañana tienes tu llamada a las {{appointment_time}}. [Nombre cliente] consiguió [resultado] después de la suya. No te la pierdas."
```

### -2 horas
```
HOT SMS: "En 2 horas nos vemos. Link: {{zoom_link}}"

WARM SMS: "{{contact.first_name}}, en 2 horas hablamos. He preparado [algo específico] para tu caso. Link: {{zoom_link}}"

COLD SMS: "{{contact.first_name}}, en 2h es tu llamada. Es tu oportunidad de [beneficio]. Link: {{zoom_link}}"
```

### -15 minutos
```
ALL: "{{contact.first_name}}, empezamos en 15 min. Te espero aquí: {{zoom_link}}"
```

## Secuencia 4: No-Show Recovery

### +30 minutos (SMS)
```
"{{contact.first_name}}, se nos ha pasado la hora de la llamada. ¿Ha surgido algo? Sin problema — reagenda aquí: {{calendar_link}}"
```

### +4 horas (Email)
```
Subject: "{{contact.first_name}}, te echamos de menos"
Body: "Entiendo que surgen imprevistos. He liberado un hueco especial esta semana para que podamos hablar: {{calendar_link}}. ¿Te viene bien?"
```

### +24 horas (SMS)
```
"{{contact.first_name}}, he guardado tu hueco un día más. Elige nueva hora aquí: {{calendar_link}}. Si prefieres que te llame yo, responde con tu mejor hora."
```

### +72 horas (Email)
```
Subject: "¿Seguimos adelante, {{contact.first_name}}?"
Body: "Hace unos días teníamos una llamada pendiente. Entiendo que a veces las prioridades cambian. Si sigues interesado en [resultado], reagenda: {{calendar_link}}. Si no es el momento, no pasa nada. Te deseo lo mejor."
```

## Secuencia 5: Post-Llamada (No Cierre)

### +1 hora (Email)
```
Subject: "Resumen de nuestra llamada, {{contact.first_name}}"
Body: [Resumen personalizado de lo hablado, propuesta, y CTA claro]
```

### +24 horas (SMS)
```
"{{contact.first_name}}, ¿has podido revisar la propuesta que te envié? Si tienes dudas, responde y te las resuelvo."
```

### +72 horas (Email)
```
Subject: "Preguntas frecuentes sobre [servicio]"
Body: [Resolver las 3-5 objeciones más comunes con prueba social]
```

### +7 días (SMS)
```
"{{contact.first_name}}, la oferta que hablamos cierra el [fecha]. ¿Necesitas algo más para decidir? Estoy aquí."
```

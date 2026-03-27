# Template System

Sistema de templates para configuración estandarizada de sub-cuentas GHL.

## Estructura

```
templates/
├── _base.yaml          # Defaults compartidos por todos los templates
├── dental-clinic.yaml  # Clínica dental
├── real-estate.yaml    # Inmobiliaria
├── coaching.yaml       # Coaching/consultoría
└── ecommerce.yaml      # E-commerce
```

## Herencia

Todos los templates heredan de `_base.yaml`. Los campos definidos en el template específico sobreescriben los de `_base.yaml`.

```
Configuración final = _base.yaml + template-específico.yaml + datos-cuenta.yaml
```

Prioridad (mayor a menor):
1. Datos de la cuenta (accounts.yaml)
2. Template específico (dental-clinic.yaml)
3. Base (_base.yaml)

## Schema del Template

```yaml
# Metadatos
name: string           # Identificador del template
description: string    # Descripción para humanos
version: string        # Versión del template

# Configuración de cuenta
account:
  business_type: string       # Tipo de negocio en GHL
  timezone: string            # Timezone IANA (ej: "Europe/Madrid")
  country: string             # Código ISO del país
  snapshot_id: string|null    # ID de snapshot GHL a aplicar

# Pipeline
pipeline:
  name: string                # Nombre del pipeline
  stages:                     # Lista ordenada de stages
    - name: string
      order: integer

# Custom Fields (se crean via API)
custom_fields:
  - name: string              # Nombre snake_case
    type: string              # TEXT|LARGE_TEXT|NUMERICAL|PHONE|EMAIL|MONETORY|
                              # CHECKBOX|SINGLE_OPTIONS|MULTIPLE_OPTIONS|DATE|FILE_UPLOAD
    purpose: string           # Descripción del propósito
    options: [string]         # Solo para SINGLE_OPTIONS/MULTIPLE_OPTIONS

# Calendario
calendar:
  name: string
  type: string               # round_robin|event|service_menu|class_booking
  duration: integer           # Minutos
  buffer: integer             # Minutos entre citas
  slot_interval: integer      # Intervalo de slots (opcional)
  availability:
    monday: string|null       # "HH:MM-HH:MM" o null para cerrado
    tuesday: string|null
    wednesday: string|null
    thursday: string|null
    friday: string|null
    saturday: string|null
    sunday: string|null

# Workflows
workflows:
  - name: string
    trigger: string           # contact_created|tag_added|appointment_booked|
                              # form_submitted|opportunity_stage_changed
    trigger_config: object    # Config adicional del trigger (ej: qué tag)
    actions:
      - type: string          # send_sms|send_email|wait|if_else|add_tag|
                              # move_opportunity|send_webhook
        delay: string|integer # Delay antes de la acción ("24h", "-2h", 0)
        template: string      # Referencia a mensaje/template (opcional)
        content: string       # Contenido directo (opcional)
        config: object        # Config adicional (opcional)

# Integraciones
integrations:
  meta_pixel: boolean         # Configurar Meta Pixel
  stripe: boolean             # Conectar Stripe
  google_calendar: boolean    # Conectar Google Calendar

# Tags estándar
tags:
  - string                    # Nombre del tag en kebab-case
```

## Crear un nuevo template

1. Copiar `_base.yaml` como punto de partida
2. Modificar las secciones relevantes para el vertical
3. Guardar en `templates/<nombre>.yaml`
4. Ejecutar `./sync.sh` para que aparezca en el listado

## Usar un template

```
# Con /ghl-browser-setup (una cuenta)
/ghl-browser-setup --template dental-clinic

# Con /ghl-batch-create (muchas cuentas)
/ghl-batch-create ./accounts.yaml --template dental-clinic
```

Si el archivo `accounts.yaml` incluye `template: nombre`, no hace falta pasar `--template`.

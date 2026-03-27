# Batch Processing Protocol

Protocolo de procesamiento para creación masiva de sub-cuentas GHL.

## Ciclo de vida de una cuenta en el batch

```
pending → in_progress → completed
                     ↘ error → retry → completed|failed
```

### Estados

| Estado | Significado |
|---|---|
| `pending` | No procesada aún |
| `in_progress` | En proceso. `current_phase` indica en qué paso |
| `completed` | Todos los pasos completados exitosamente |
| `error` | Falló en algún paso. `error` tiene el detalle |
| `failed` | Falló después del retry. Requiere intervención manual |

### Fases por cuenta

```
creation → pipeline → fields → webhooks → calendar → workflows → integrations → audit
```

Cada fase se marca en `phases_completed` al completar.

## Procesamiento secuencial

Solo una cuenta a la vez. El browser es un recurso compartido — no puede operar en dos cuentas simultáneamente.

### Por qué no paralelo
- Un solo browser context
- GHL podría rate-limitar operaciones concurrentes
- Secuencial permite resume limpio

## Actualización de batch-queue.json

### Cuándo actualizar
- Al **iniciar** una cuenta: `status: "in_progress"`, `started_at`
- Al **completar cada fase**: añadir a `phases_completed`
- Al **completar** una cuenta: `status: "completed"`, `completed_at`
- Al **fallar**: `status: "error"`, `error: "mensaje"`

### Formato de actualización
Escribir el archivo COMPLETO (no append). Leer → modificar → escribir.

## Resume Protocol

### Al arrancar
```
1. Buscar .ghl/batch-queue.json
2. SI existe:
   a. Leer estado actual
   b. Contar: completed, in_progress, pending, error
   c. Reportar: "Batch resumido: X/Y completadas, Z pendientes, W con error"
   d. Continuar procesamiento
3. SI NO existe:
   a. Crear batch-queue.json nuevo
   b. Iniciar desde la primera cuenta
```

### Procesar una cuenta in_progress
```
1. Leer current_phase y phases_completed
2. Saltar fases ya completadas
3. Reanudar desde current_phase
4. SI falla de nuevo: marcar error definitivo
```

### Re-auth durante resume
Si al navegar se detecta pantalla de login:
1. Re-ejecutar ghl-browser-auth
2. Continuar desde el punto exacto

## Error Recovery

### Errores por fase

| Fase | Error común | Acción |
|---|---|---|
| creation | Nombre duplicado | Añadir sufijo + reintentar |
| creation | Wizard cambió | Screenshot + skip |
| pipeline | Stage no se crea | API fallback (pipeline_list) |
| fields | API error 429 | Esperar 30s + reintentar |
| calendar | Tipo no disponible | Usar Event como fallback |
| workflows | Editor no carga | Documentar como manual |
| integrations | OAuth requerido | Documentar como manual |

### Retry al final del batch
```
1. Filtrar cuentas con status: "error"
2. POR CADA una:
   a. Reportar: "Reintentando cuenta X (error original: Y)"
   b. Reintentar desde la fase que falló
   c. SI éxito: status: "completed"
   d. SI falla: status: "failed" (ya no reintentar)
3. Reportar resultado final de retries
```

## Estimaciones de tiempo

- **Login**: 10-30 segundos
- **Crear sub-cuenta**: 1-3 minutos
- **Pipeline**: 1-2 minutos
- **Custom fields (API)**: 30-60 segundos
- **Calendario**: 1-2 minutos
- **Workflows**: 2-5 minutos (depende de complejidad)
- **Integraciones**: 1-3 minutos
- **Total por cuenta**: ~8-15 minutos
- **Batch de 20**: ~3-5 horas

## Monitoreo

El browser-director informa progreso:
```
"Batch: 5/20 completadas (25%). Cuenta actual: Clínica Madrid — Paso 3/8 (fields via API).
 Tiempo estimado restante: ~2.5 horas. Sin errores."
```

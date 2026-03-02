# Event Mapping — GHL → Meta CAPI

## Tabla de Eventos Completa

| # | Trigger GHL | Evento Meta | event_name | Condición | custom_data |
|---|-------------|-------------|------------|-----------|-------------|
| 1 | Form Submitted | Lead | Lead | Siempre | source_funnel, utm_* |
| 2 | Tag: score-hot | CompleteRegistration | CompleteRegistration | qualification_status = HOT | lead_score, qualification_status |
| 3 | Tag: score-warm | Custom: QualifiedLead | QualifiedLead | qualification_status = WARM | lead_score |
| 4 | Appointment Created | Schedule | Schedule | Siempre | lead_score, calendar_name |
| 5 | Contact replies OK | InitiateCheckout | InitiateCheckout | Appointment confirmed | lead_score |
| 6 | Appointment Completed | ViewContent | ViewContent | Attended call | lead_score, call_duration |
| 7 | Opportunity Won | Purchase | Purchase | Sale closed | value, currency |
| 8 | Opportunity Lost | Custom: LostDeal | LostDeal | Deal lost | lead_score, lost_reason |

## Hidden Fields para capturar en el formulario

Estos campos se deben incluir en la landing page como hidden inputs:

```html
<!-- Meta Click/Browser IDs -->
<input type="hidden" name="fbc" id="fbc">
<input type="hidden" name="fbp" id="fbp">
<input type="hidden" name="event_id" id="event_id">

<!-- UTM Parameters -->
<input type="hidden" name="utm_source" id="utm_source">
<input type="hidden" name="utm_medium" id="utm_medium">
<input type="hidden" name="utm_campaign" id="utm_campaign">
<input type="hidden" name="utm_content" id="utm_content">

<!-- Behavior Data -->
<input type="hidden" name="time_on_page" id="time_on_page">
<input type="hidden" name="scroll_depth" id="scroll_depth">
<input type="hidden" name="landing_url" id="landing_url">
```

```javascript
// Script para capturar datos automáticamente
document.addEventListener('DOMContentLoaded', () => {
  // Meta IDs
  const getCookie = (name) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || '';
  document.getElementById('fbc').value = getCookie('_fbc') || new URLSearchParams(location.search).get('fbclid') || '';
  document.getElementById('fbp').value = getCookie('_fbp') || '';
  document.getElementById('event_id').value = crypto.randomUUID();

  // UTMs
  const params = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(p => {
    const el = document.getElementById(p);
    if (el) el.value = params.get(p) || '';
  });

  // Landing URL
  document.getElementById('landing_url').value = location.href;

  // Behavior tracking
  const startTime = Date.now();
  let maxScroll = 0;

  window.addEventListener('scroll', () => {
    const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    maxScroll = Math.max(maxScroll, pct);
  });

  // Update on form submit
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      document.getElementById('time_on_page').value = Math.round((Date.now() - startTime) / 1000);
      document.getElementById('scroll_depth').value = maxScroll;
    });
  });
});
```

## Optimización de Campañas por Evento

### Fase 1: Lanzamiento (primeras 2 semanas)
- Optimizar para: **Lead** (necesitas volumen para que el pixel aprenda)
- Mínimo: 50 conversiones/semana

### Fase 2: Optimización (semanas 3-4)
- Cambiar a: **CompleteRegistration** (leads cualificados HOT)
- El CPA sube pero la calidad sube mucho más
- Mínimo: 25 conversiones/semana

### Fase 3: Madurez (mes 2+)
- Optimizar para: **Schedule** o **Purchase** (según volumen)
- Necesitas mínimo 15-20 eventos/semana para que funcione
- Si no hay volumen, volver a CompleteRegistration

### Value-Based Optimization
Si envías Purchase con valor real:
- Activar Value Optimization en Meta Ads Manager
- Meta optimizará para maximizar ROAS, no solo conversiones
- Requiere mínimo 10 purchases/semana con valores variados

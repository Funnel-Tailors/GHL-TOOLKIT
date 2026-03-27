# GHL UI Navigation Patterns

Referencia de patrones de accesibilidad para navegar la UI de GoHighLevel con Playwright MCP.

> **IMPORTANTE**: Usa `browser_snapshot` (accessibility tree) para encontrar elementos, NO CSS selectors. Los patrones de accesibilidad son más resilientes a cambios de UI que los CSS selectors.

## URLs Principales

| Página | URL Pattern |
|---|---|
| Agency Dashboard | `https://app.gohighlevel.com/dashboard` |
| Sub-accounts List | `https://app.gohighlevel.com/sub-accounts` |
| Sub-account Switch | Click en nombre de sub-account o navegación directa |
| Settings | `https://app.gohighlevel.com/location/<id>/settings` |
| Pipelines | `https://app.gohighlevel.com/location/<id>/opportunities/pipelines` |
| Workflows | `https://app.gohighlevel.com/location/<id>/automation/workflows` |
| Calendars | `https://app.gohighlevel.com/location/<id>/calendars` |
| Integrations | `https://app.gohighlevel.com/location/<id>/settings/integrations` |

## Patrones de Accesibilidad por Página

### Login Page
```
Elementos esperados:
- textbox con label "Email" o "Email Address"
- textbox con tipo password
- button con texto "Sign In" o "Log In"
- (2FA) textbox con label "Verification Code" o "Enter Code"
```

### Agency Dashboard
```
Elementos que confirman login exitoso:
- Texto que contenga "Sub-Accounts" o "Accounts"
- Menú lateral con enlaces a configuración
- Nombre de la agencia visible
```

### Sub-Account Creation Wizard
```
Elementos del formulario:
- textbox: "Business Name" / "Company Name"
- combobox/select: "Business Type" / "Industry"
- textbox: "Phone"
- textbox: "Email"
- combobox/select: "Timezone"
- textbox: "Street Address" / "Address"
- textbox: "City"
- textbox: "State" / "Province"
- textbox: "Zip" / "Postal Code"
- combobox/select: "Country"
- button: "Create" / "Save" / "Next"
```

### Pipeline Editor
```
Elementos:
- button: "Create Pipeline" / "Add Pipeline" / "+"
- textbox: nombre del pipeline
- Stages como elementos arrastrables o editables
- button: "Add Stage" / "+"
- button: "Save" / "Update"
```

### Workflow Editor
```
Elementos:
- button: "Create Workflow" / "+"
- Opciones: "Start from Scratch" / "Blank"
- Nodo de trigger (primer nodo del canvas)
- button: "Add Action" / "+" entre nodos
- Panel lateral de configuración al hacer click en nodo
- Toggle/switch de "Active" / "Published" / "Draft"
```

### Calendar Creator
```
Elementos:
- button: "Create Calendar" / "+"
- Opciones de tipo: "Round Robin", "Event", "Service Menu", "Class Booking"
- textbox: nombre del calendario
- Inputs numéricos: duración, buffer
- Toggles por día de la semana
- Time pickers: hora inicio/fin por día
- button: "Save" / "Create"
```

### Integrations Page
```
Elementos:
- Cards/secciones por integración
- "Facebook" / "Meta" section
- "Stripe" section
- "Google" section
- Botones "Connect" / "Configure" por integración
- Campos para API keys, Pixel IDs, tokens
```

## Tips de Resiliencia

1. **Siempre `browser_snapshot` antes de `browser_click`** — confirma que el elemento existe
2. **Esperar después de navegaciones** — `browser_wait_for` con texto esperado
3. **GHL usa SPA** — las URLs cambian pero la página no recarga completamente
4. **Loading spinners** — buscar texto "Loading" y esperar a que desaparezca
5. **Toasts/notifications** — pueden bloquear clicks. Esperar a que desaparezcan
6. **Modales de upgrade** — pueden aparecer inesperadamente. Buscar botón de cerrar "X"
7. **Cookie banners** — cerrar si aparecen antes de continuar

## Actualizaciones

Esta referencia debe actualizarse si GHL cambia su UI significativamente. Los agentes de browser reportan discrepancias entre lo esperado (este documento) y lo encontrado (accessibility snapshot real).

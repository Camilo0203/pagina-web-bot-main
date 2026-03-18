# Backlog Web Publica y Dashboard

## Prioridad P0

### 1. Hacer resiliente el snapshot del dashboard ante fallos parciales

Objetivo:
Evitar que falle todo `/dashboard` cuando una tabla, vista o dataset auxiliar de Supabase no responde.

Archivos candidatos a tocar:
`src/dashboard/api.ts`, `src/dashboard/hooks/useDashboardData.ts`, `src/dashboard/DashboardPage.tsx`, `src/dashboard/components/StateCard.tsx`

Criterio de aceptacion:
- Si falla activity, metrics, backups o ticket workspace, el dashboard sigue cargando configuracion base del guild.
- El usuario ve que dataset fallo y que sigue disponible.
- No se introducen APIs nuevas ni mocks engañosos.

### 2. Clasificar datasets core vs opcionales del dashboard

Objetivo:
Definir que datos bloquean la operacion y cuales solo degradan experiencia.

Archivos candidatos a tocar:
`src/dashboard/api.ts`, `src/dashboard/types.ts`, `src/dashboard/utils.ts`, `docs/web-dashboard-audit.md`

Criterio de aceptacion:
- Existe una lista explicita de datasets core y opcionales.
- El codigo refleja ese contrato en fetch/normalizacion/render.

### 3. Reducir exposicion de logs de auth y sync en produccion

Objetivo:
Mantener trazabilidad sin dejar ruido o detalles sensibles en la consola del navegador.

Archivos candidatos a tocar:
`src/dashboard/api.ts`, `src/dashboard/AuthCallbackPage.tsx`, `src/config.ts`

Criterio de aceptacion:
- Los logs verbosos quedan protegidos por entorno o helper centralizado.
- Los errores visibles al usuario siguen siendo accionables.

## Prioridad P1

### 4. Endurecer onboarding y documentacion de variables de entorno

Objetivo:
Evitar despliegues incompletos y facilitar setup de local/preview/prod.

Archivos candidatos a tocar:
`README.md`, `.env.example`, `src/config.ts`, `docs/web-dashboard-audit.md`

Criterio de aceptacion:
- `.env.example` existe y cubre las variables realmente usadas.
- README explica minimo local setup, Supabase y OAuth callback.
- No se exponen secretos reales.

### 5. Consolidar empty states y estados sin datos reales

Objetivo:
Que landing y dashboard comuniquen claramente “sin datos”, “sin configuracion” y “fallo temporal”.

Archivos candidatos a tocar:
`src/hooks/useBotStats.ts`, `src/components/LiveStats.tsx`, `src/dashboard/DashboardPage.tsx`, `src/dashboard/modules/AnalyticsModule.tsx`, `src/dashboard/modules/ActivityModule.tsx`, `src/dashboard/modules/InboxModule.tsx`

Criterio de aceptacion:
- Cada modulo clave tiene un empty state entendible y no ambiguo.
- LiveStats diferencia dato real, fallback y error.
- No se muestran cifras engañosas como si fueran live cuando no lo son.

### 6. Ajustar polling y consumo de red del dashboard

Objetivo:
Reducir refetch innecesario sin perder capacidad operativa.

Archivos candidatos a tocar:
`src/dashboard/hooks/useDashboardData.ts`

Criterio de aceptacion:
- El polling baja cuando no hay actividad pendiente.
- No se refetchea agresivamente en estados inactivos sin necesidad.
- El comportamiento sigue siendo confiable para tickets y mutaciones.

### 7. Crear error boundaries y recovery UX por modulo

Objetivo:
Evitar que un error de render en un modulo rompa toda la shell del dashboard.

Archivos candidatos a tocar:
`src/dashboard/DashboardPage.tsx`, `src/dashboard/components/PanelCard.tsx`, `src/dashboard/components/StateCard.tsx`

Criterio de aceptacion:
- Un fallo de un modulo lazy-loaded no tira abajo todo el layout.
- El usuario puede cambiar a otra seccion o reintentar.

## Prioridad P2

### 8. Afinar performance de landing y media heavy

Objetivo:
Reducir impacto de videos y fondos en mobile/red lenta.

Archivos candidatos a tocar:
`src/components/Hero.tsx`, `src/components/VisualExperience.tsx`, `src/components/FinalCTA.tsx`, `public/videos/*`

Criterio de aceptacion:
- Hay una estrategia clara de `preload`, poster y degradacion por dispositivo.
- El sitio sigue viendose premium sin depender siempre de video.

### 9. Consolidar inventario real de secciones publicas

Objetivo:
Separar lo que esta activo en la landing de lo que es legacy o roadmap.

Archivos candidatos a tocar:
`src/pages/LandingPage.tsx`, `src/components/Testimonial*.tsx`, `src/components/SupportSection.tsx`, `src/components/StatusSection.tsx`, `src/components/SetupGuide.tsx`, `src/components/Pricing.tsx`, `src/components/FAQ.tsx`, `src/components/DocsSection.tsx`, `src/components/DashboardSection.tsx`, `src/components/Commands.tsx`

Criterio de aceptacion:
- Queda claro que componentes forman parte del sitio actual.
- El codigo muerto se documenta o elimina solo si no tiene uso real.

### 10. Separar logica de checklist/quick actions del copy mutable

Objetivo:
Evitar que cambios editoriales rompan pruebas de dominio.

Archivos candidatos a tocar:
`src/dashboard/utils.ts`, `src/dashboard/utils.test.ts`

Criterio de aceptacion:
- Las pruebas validan reglas y prioridades, no frases fragiles.
- El copy puede evolucionar sin romper contratos innecesariamente.

## Prioridad P3

### 11. Normalizar i18n entre landing y dashboard

Objetivo:
Definir si el dashboard sera bilingue o si solo la web publica lo sera.

Archivos candidatos a tocar:
`src/i18n.ts`, `src/dashboard/**/*`, `src/pages/LandingPage.tsx`

Criterio de aceptacion:
- Existe una politica clara de internacionalizacion.
- No quedan mezclas arbitrarias de textos hardcodeados y textos traducidos.

### 12. Pulir identidad de producto y docs del repo

Objetivo:
Cerrar detalles de presentacion que siguen oliendo a starter.

Archivos candidatos a tocar:
`package.json`, `README.md`, `src/siteMetadata.ts`

Criterio de aceptacion:
- El repo ya no parece plantilla generica.
- Metadata y documentacion reflejan producto real.

## Fases recomendadas

### Fase 1

- Tarea 1
- Tarea 2
- Tarea 3

Resultado esperado:
Dashboard mucho mas resistente sin tocar arquitectura base.

### Fase 2

- Tarea 4
- Tarea 5
- Tarea 6

Resultado esperado:
Mejor operacion diaria, mejor DX de despliegue y menos estados ambiguos.

### Fase 3

- Tarea 7
- Tarea 8
- Tarea 10

Resultado esperado:
Mejor calidad de UX y mantenimiento en frontend.

### Fase 4

- Tarea 9
- Tarea 11
- Tarea 12

Resultado esperado:
Producto mas coherente, repo mas limpio y menos deuda editorial.


# Auditoria Web Publica y Dashboard

## Resumen ejecutivo

La base del proyecto es solida: la app ya tiene enrutado claro, lazy loading real en dashboard, capa de datos organizada alrededor de Supabase y modulos funcionales para configuracion operativa. No parece un MVP vacio; parece una primera version avanzada con bastante trabajo de producto ya integrado.

El mayor riesgo hoy no es de arquitectura sino de resiliencia y cierre funcional. La landing se ve casi lista visualmente, pero depende mucho de media pesada y de configuracion correcta de entorno para no degradarse. El dashboard ya cubre muchos casos de uso, pero sigue siendo fragil frente a fallos parciales de Supabase, tablas faltantes, RPCs inestables o datos incompletos: un fallo en una sola consulta tumba el snapshot completo del servidor.

Tambien hay señales de deuda de producto y mantenimiento: componentes publicos no conectados a la landing actual, copy/tests desalineados, logs de diagnostico expuestos en produccion, polling agresivo y ausencia de una estrategia uniforme de empty states por dataset. La app puede desplegarse, pero no la consideraria “terminada” para un SaaS serio sin una fase corta de endurecimiento.

## Estado actual

### Landing publica

Estado general: visualmente avanzada y bastante cercana a “release candidate”.

Lo que ya esta completo o muy encaminado:

- Ruta principal `/` funcionando con SEO base, `Helmet`, canonical, Open Graph y assets publicos.
- Composicion principal consistente con las secciones activas: `Hero`, `Features`, `VisualExperience`, `WhyTon`, `LiveStats`, `FinalCTA`, `Footer`, `LegalModal`.
- Navegacion superior con menu mobile, selector de idioma y CTA al dashboard.
- Fallbacks basicos en media del hero y stats publicas con degradacion a valores default.
- Mejoras de bajo riesgo ya aplicadas en esta auditoria:
  - CTA de invitacion ya no recarga la pagina cuando falta `VITE_DISCORD_CLIENT_ID`.
  - navegacion al home/dashboard usa SPA routing cuando corresponde.

Lo que sigue incompleto o inconsistente:

- Hay varios componentes publicos presentes pero no integrados en la landing actual: `Testimonials`, `SupportSection`, `StatusSection`, `SetupGuide`, `Pricing`, `FAQ`, `DocsSection`, `DashboardSection`, `Commands`. Eso sugiere alcance recortado o codigo legado sin consolidar.
- La landing depende de video/background media pesada en varias secciones; no vi una estrategia de carga progresiva por ancho de banda ni segmentacion “mobile first”.
- `LiveStats` mezcla dato real y fallback estatico sin dejar claro para negocio si el numero visible es live, stale o demo.

### Dashboard

Estado general: funcionalmente ambicioso, con base real de panel de operaciones, pero todavia no endurecido contra errores parciales ni indisponibilidad de datos.

Lo que ya esta completo o muy encaminado:

- Ruta `/dashboard` con carga lazy de modulos y callback OAuth separado en `/auth/callback`.
- Shell de dashboard fuerte visualmente, con secciones, seleccion de guild, estado de sync y modulos especializados.
- Capa de datos separada en `api.ts`, `useDashboardData.ts`, `useGuildSelection.ts`, `schemas.ts`, `types.ts` y `utils.ts`.
- Validacion de payloads/configs con Zod para settings y normalizacion de filas Supabase.
- Flujo de autenticacion Discord + Supabase con sincronizacion de guilds y redireccion al guild deseado.
- Modulos ya presentes para overview, inbox, general, server roles, tickets, verification, welcome, suggestions, modlogs, commands, system, activity y analytics.

Lo que sigue incompleto o con riesgo:

- El snapshot del dashboard depende de `Promise.all` en `src/dashboard/api.ts`; si falla una sola tabla o vista, falla todo el dashboard del servidor.
- Los modulos asumen que el backend publica estructuras compatibles; faltan capas de “partial success” para datasets opcionales como activity, analytics, inbox o backups.
- El sistema de quick actions/checklist parece vivo y util, pero el historial reciente muestra desalineacion entre copy y tests; eso indica dominio cambiante sin suficiente contrato estable.
- Hay polling frecuente en `useGuildDashboardSnapshot`, pero no vi diferenciacion entre foreground/background ni cancelacion adaptativa cuando la pestaña esta inactiva.

## Problemas criticos

### Criticos

1. `src/dashboard/api.ts`
   El snapshot del dashboard cae completo ante un solo fallo de Supabase o una vista faltante. Esto afecta directamente operacion y soporte en produccion.

2. `src/dashboard/api.ts` y `src/dashboard/AuthCallbackPage.tsx`
   Hay muchos `console.log`, `console.warn` y `console.error` de flujo auth/sync en runtime. Son utiles para diagnostico, pero hoy exponen demasiado detalle operativo en produccion y no estan centralizados.

3. `.env.example`
   El archivo aparece eliminado en el worktree actual. En un repo frontend con muchas variables de entorno eso es un riesgo real de onboarding, CI y despliegue.

## Problemas altos

1. `src/hooks/useBotStats.ts`
   Si Supabase falla, la landing muestra cifras default muy grandes. Sirve como fallback visual, pero puede inducir a error comercial si no se considera explicitamente “stale marketing data”.

2. `src/dashboard/hooks/useDashboardData.ts`
   El refetch del snapshot es agresivo y siempre activo. Con guilds activos y bandejas de tickets, esto puede generar carga innecesaria y ruido de red.

3. `src/dashboard/DashboardPage.tsx`
   La UX de error es clara cuando falla todo, pero no existe una estrategia de degradacion parcial por modulo. Activity, analytics, backups o inbox podrian quedar vacios sin bloquear configuracion base.

4. `src/components/Hero.tsx`, `src/components/VisualExperience.tsx`, `src/components/FinalCTA.tsx`
   La landing depende de video pesado y efectos cinematograficos. El `build` pasa, pero el costo real en mobile/red lenta sigue siendo una preocupacion.

5. `src/components/*` publicos no integrados
   Hay varias secciones no conectadas. Si son legacy, hoy aumentan superficie de mantenimiento; si son roadmap, falta documentar el estado.

## Problemas medios

1. `src/dashboard/utils.ts` y `src/dashboard/utils.test.ts`
   El contrato del copy del dashboard no estaba estabilizado respecto a tests. Ya corregi los tests, pero sigue siendo una señal de que falta separar copy cambiante de logica core.

2. `src/components/Navbar.tsx`
   Antes usaba anchors internos al home y dashboard incluso cuando el destino era interno; ya lo ajuste para evitar recargas SPA innecesarias.

3. `src/components/Hero.tsx` y `src/components/FinalCTA.tsx`
   Antes los CTA de invitacion podian apuntar a `href=""` cuando faltaba configuracion. Ya lo ajuste con estado deshabilitado.

4. `src/pages/LandingPage.tsx`
   La landing activa no refleja todo el inventario de componentes publicos del repo; hay desalineacion entre “lo que existe” y “lo que realmente compone el sitio”.

5. `dist` generado y bundles
   El build muestra chunks grandes en vendors de React, dashboard, motion y Supabase. No es un bloqueo inmediato, pero conviene presupuestar optimizacion de payload.

## Problemas bajos

1. `package.json`
   El nombre del paquete sigue siendo `vite-react-typescript-starter`, lo que transmite proyecto no terminado.

2. `src/App.tsx` y varios textos
   Hay copy en espanol hardcodeado y sin una politica clara de internacionalizacion para dashboard.

3. `README.md`
   Necesita ponerse al dia con el estado real del producto, dashboard y variables requeridas.

## Quick wins

- Arreglar `lint` para que vuelva a ser una verificacion util en CI.
- Mantener tests alineados con el copy/contrato vigente del dashboard.
- Endurecer CTA de invitacion cuando falta configuracion de entorno.
- Mantener SPA routing interno en navbar/dashboard CTA.
- Documentar explicitamente que datasets del dashboard son core y cuales son opcionales.

## Riesgos de despliegue

- Variables de entorno incompletas o mal documentadas.
- Supabase sin alguna tabla, vista, RPC o edge function esperada por `api.ts`.
- Callback OAuth correcto en local pero roto en produccion por `VITE_SITE_URL` o redirect URL mal alineado.
- Dashboard inutilizable por fallo parcial de una sola fuente de datos.
- Bundle/media pesados degradando LCP y experiencia mobile.
- Logs de auth/sync visibles en navegador de usuarios finales.

## Verificacion ejecutada

- `npm run build`: OK
- `npm run typecheck`: OK
- `npm run lint`: fallaba por configuracion de ESLint; corregido en esta auditoria
- `npm run test`: fallaba por expectativas desalineadas con copy actual; corregido en esta auditoria


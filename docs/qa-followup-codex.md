# QA Follow-up Codex

## Resumen ejecutivo

Se aplico una pasada intensiva pero conservadora sobre `ton618-web` priorizando consistencia visible, hardening del callback OAuth y navegacion de recursos sin cambiar rutas, contratos publicos ni arquitectura. La mayor parte de los hallazgos corregidos eran de alta señal y bajo riesgo: textos visibles fuera de i18n, CTA ambiguos en docs/recursos y manejo mas estricto de sesiones dudosas antes de invocar `sync-discord-guilds`.

## Hallazgos de QA confirmados por codigo

### A. Confirmados por codigo

- `src/App.tsx` mostraba un fallback de carga hardcodeado en espanol fuera del sistema i18n.
- `src/components/DocsSection.tsx` tenia copy visible hardcodeado, mezclaba comportamiento de recursos con soporte y podia llevar a CTA ambiguos cuando faltaban URLs externas.
- `src/components/Navbar.tsx` dejaba la visibilidad de Docs atada solo a `VITE_DOCS_URL`, aunque la landing si tiene una seccion `#docs`; eso degradaba la navegacion cuando no habia docs externas.
- `src/dashboard/AuthCallbackPage.tsx` y `src/dashboard/components/AuthCard.tsx` tenian texto visible hardcodeado fuera de i18n.
- `src/dashboard/authCallbackFlow.ts` seguia pudiendo reutilizar estado local dudoso al reiniciar login y solo reconocia parte de los errores de sesion invalida en espanol.
- `src/dashboard/authCallbackFlow.ts` normalizaba errores OAuth de forma incompleta; ahora tambien intenta decodificar percent-encoding del query string.

### B. Probables y seguros de corregir

- La ruta de soporte en `DocsSection` usaba el invite del bot como fallback de soporte; eso no era una rotura tecnica dura, pero si una UX engañosa. Se cambio a soporte real por `supportServerUrl`, `contactEmail` o CTA final.
- Los labels `Docs`, `Status` y `Support` en navbar no participaban de i18n y podian verse inconsistentes con el resto de la pagina.

## Hallazgos dependientes del entorno

### C. Dependientes del entorno o no confirmables solo por repo

- El `401 Unauthorized` con `{"code":401,"message":"Invalid JWT"}` no puede declararse resuelto al 100% desde frontend. El repo ahora evita continuar con una sesion invalida o dudosa, pero la causa raiz todavia puede estar en persistencia local corrupta, expiracion real del token o configuracion externa de Supabase/Auth.
- No se confirmo una rotura de assets base en el repo: `public/favicon.png`, `public/apple-touch-icon.png`, `public/site.webmanifest` y los iconos Android existen y `vite.config.ts`/`index.html` apuntan a esas rutas. Si staging sigue mostrando 404, el problema es mas probable de deploy, cache o `base path` externo.
- La presencia de Docs, Status y Support externos sigue dependiendo de `VITE_DOCS_URL`, `VITE_STATUS_URL`, `VITE_SUPPORT_SERVER_URL` y `VITE_CONTACT_EMAIL`.

## Cambios aplicados

- Se movieron a i18n los textos visibles y accesibles de `App`, `LandingPage`, `Hero`, `Navbar`, `DocsSection`, `AuthCallbackPage` y `dashboard/components/AuthCard`.
- Se agregaron nuevas claves de traduccion para navbar, landing, recursos y auth callback en `src/i18n.ts`.
- Navbar ahora mantiene un acceso consistente a Docs con fallback interno a `#docs` cuando no hay docs externas.
- `DocsSection` ahora usa i18n, mejora los CTA por fallback y deja de reutilizar la invitacion del bot como sustituto de soporte.
- El callback OAuth ahora:
  - decodifica mejor errores de query string
  - limpia estado auth local si no queda una sesion valida tras el callback
  - limpia auth local antes de reiniciar login de forma explicita
  - clasifica mejor errores de sesion invalida tanto en espanol como en ingles
  - muestra mensajes localizados y mas claros para sesion/JWT invalido

## Cambios descartados

- No se tocaron rutas existentes ni la estructura del dashboard.
- No se refactorizo masivamente el dashboard para traducir todos sus estados visibles; se limitaron los cambios a puntos de inconsistencia priorizados por QA y a la superficie auth/callback.
- No se cambiaron contratos ni payloads de `sync-discord-guilds`.
- No se inventaron assets nuevos de branding porque los assets base requeridos ya existen en `public/`.

## Riesgos pendientes

- El dashboard sigue teniendo bastante copy interna solo en espanol fuera de i18n. No era el objetivo de esta pasada, pero sigue siendo una deuda si se quiere experiencia bilingue completa dentro del panel.
- Si Supabase/Auth devuelve una sesion aparentemente valida pero el entorno remoto rechaza el JWT por configuracion o reloj, el frontend ahora falla mejor, pero sigue dependiendo de infraestructura externa.
- `site.webmanifest` sigue siendo estatico y no bilingue. No es rotura funcional, pero si una limitacion de consistencia si el sitio se sirve en ingles.

## Recomendacion para siguiente QA

- Repetir QA manual del callback con tres escenarios: login limpio, sesion local stale y callback con `Invalid JWT`.
- Verificar navegacion en landing con y sin `VITE_DOCS_URL`, `VITE_STATUS_URL`, `VITE_SUPPORT_SERVER_URL` y `VITE_CONTACT_EMAIL`.
- Validar en staging real que no existan 404 para `favicon.png`, `apple-touch-icon.png`, `site.webmanifest` e iconos Android desde el HTML final desplegado.
- Si el objetivo sigue siendo bilingue end-to-end, la siguiente ronda debe cubrir estados visibles del dashboard shell y sus pantallas de error fuera del callback.

## Validacion tecnica

- `npm run typecheck`: OK
- `npm run lint`: OK
- `npm run test`: OK, 2 archivos y 16 tests pasaron
- `npm run build`: OK
- Warnings no bloqueantes:
  - Vite mostro warnings de compatibilidad interna sobre `esbuild`/`oxc` durante `vitest run`
  - `Browserslist: caniuse-lite is outdated` durante `vite build`

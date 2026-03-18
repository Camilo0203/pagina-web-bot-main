# Technical Debt Resolved

## Dashboard API

- `src/dashboard/api.ts` dejó de concentrar toda la capa de acceso a datos.
- La API pública se mantuvo estable, pero ahora está separada por dominios en:
  - `src/dashboard/api/auth.ts`
  - `src/dashboard/api/guilds.ts`
  - `src/dashboard/api/snapshot.ts`
  - `src/dashboard/api/mutations.ts`
  - `src/dashboard/api/shared.ts`

## Resiliencia del snapshot

- `fetchGuildDashboardSnapshot` ya no falla completo cuando caen fuentes opcionales.
- `activity`, `metrics`, `ticket events` y `ticket macros` ahora degradan con gracia y vuelven con fallback vacío controlado.
- El snapshot expone `partialFailures` para que la UI comunique cobertura parcial sin perder operatividad del resto del panel.

## Complejidad de pantalla

- `src/dashboard/DashboardPage.tsx` se redujo moviendo persistencia de sección y renderizado de módulos a piezas separadas.
- Se añadió `src/dashboard/hooks/usePersistentDashboardSection.ts`.
- Se añadió `src/dashboard/components/DashboardModuleViewport.tsx` para encapsular estados y switching de módulos.
- Se añadió `src/dashboard/components/DashboardDegradationNotice.tsx` para mensajes reutilizables de degradación parcial.

## Callback OAuth

- La lógica de `src/dashboard/AuthCallbackPage.tsx` quedó encapsulada en `src/dashboard/authCallbackFlow.ts`.
- La página ahora se enfoca en leer el intento, reaccionar al estado y renderizar feedback.

## Landing y cierre comercial

- `src/pages/LandingPage.tsx` integra una sección de recursos útil en vez de dejar `DocsSection.tsx` como huérfano.
- `src/components/DocsSection.tsx` se reescribió para reforzar valor, confianza, recursos operativos y CTA.
- Se eliminaron componentes huérfanos no usados del árbol de `src/components`.

## Señales de producto

- `package.json` ya no usa nombre de starter/template.
- `README.md` refleja el estado real del proyecto, incluyendo dashboard, callback, degradación parcial y artefactos de release.

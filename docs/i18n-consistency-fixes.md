# i18n Consistency Fixes

## Componentes afectados

- `src/App.tsx`
- `src/pages/LandingPage.tsx`
- `src/components/Hero.tsx`
- `src/components/Navbar.tsx`
- `src/components/DocsSection.tsx`
- `src/dashboard/AuthCallbackPage.tsx`
- `src/dashboard/components/AuthCard.tsx`
- `src/dashboard/authCallbackFlow.ts`
- `src/dashboard/api/auth.ts`
- `src/i18n.ts`

## Textos movidos a traduccion

- Fallback de carga de la app.
- Skip link principal de la landing.
- Labels utilitarios de navbar para Docs, Status y Support.
- Copy completa y CTA de `DocsSection`.
- Textos visibles y accesibles del callback OAuth.
- Textos visibles del `AuthCard`.
- Mensajes de estado y error expuestos por el callback/auth API que llegan a UI.

## Idiomas revisados

- `en`
- `es`

## Pendientes

- El dashboard fuera del callback y la tarjeta de login sigue teniendo mas copy visible solo en espanol en otros estados del shell; no se amplio el alcance a todo el panel para evitar una pasada destructiva.
- `site.webmanifest` permanece como asset estatico y no cambia por idioma.

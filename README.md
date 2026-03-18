# ton618-web

Landing y dashboard web para TON618, construidos con Vite, React, TypeScript, Tailwind, React Query y Supabase.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`
- `npm run lint`
- `npm run test`

## Variables de entorno criticas

Parte del proyecto degrada con gracia, pero para release completo hay variables que deben estar correctas:

- `VITE_DISCORD_CLIENT_ID`
  Habilita la invitacion del bot.
- `VITE_SUPABASE_URL`
  Necesaria para auth, dashboard y telemetria.
- `VITE_SUPABASE_ANON_KEY`
  Necesaria para auth, dashboard y telemetria.
- `VITE_SITE_URL`
  Canonical URL y base para redirects OAuth.

Variables operativas recomendadas:

- `VITE_SUPPORT_SERVER_URL`
- `VITE_DOCS_URL`
- `VITE_STATUS_URL`
- `VITE_CONTACT_EMAIL`
- `VITE_GITHUB_URL`
- `VITE_TWITTER_URL`
- `VITE_DASHBOARD_URL`
  Solo si quieres forzar un dashboard externo en vez de `/dashboard`.

Usa [.env.example](/c:/Users/Camilo/Desktop/ton618-web/.env.example) como plantilla local.

## Setup local

1. Copia `.env.example` a `.env` y completa los valores.
2. Instala dependencias con `npm install`.
3. Inicia el entorno con `npm run dev`.
4. Abre `http://localhost:5173`.

## Validacion local de landing

Valida al menos esto antes de release:

- Hero, navbar, footer y CTAs sin overflow en mobile y desktop.
- Cambio de idioma y navegacion por teclado.
- Estados live/fallback en la seccion de estadisticas.
- Metadatos y canonical con `VITE_SITE_URL` correcto.
- Video hero con poster funcional si el autoplay falla.

## Validacion local de dashboard

Valida al menos esto antes de release:

- Login con Discord via Supabase.
- Callback en `/auth/callback`.
- Carga del selector de servidores.
- Cambio entre modulos sin errores silenciosos.
- Formularios con validaciones visibles y botones de guardado/reset.
- Inbox, activity y analytics en mobile sin bloquear lectura.

## Supabase

Migraciones relevantes:

- `supabase/migrations/20260305063924_create_bot_stats_table.sql`
- `supabase/migrations/20260313183000_create_dashboard_tables.sql`
- `supabase/migrations/20260313193000_expand_dashboard_control_plane.sql`
- `supabase/migrations/20260313220000_add_ticket_workspace.sql`

Edge Function requerida:

- `supabase/functions/sync-discord-guilds`

Requisitos operativos:

1. Activar Discord como provider en Supabase Auth.
2. Registrar redirects local/prod terminando en `/auth/callback`.
3. Desplegar la Edge Function con los secretos necesarios.
4. Mantener el bot/backend como escritor de `bot_stats`, `bot_guilds` y `guild_metrics_daily`.

## Release

- Checklist de release: [docs/release-readiness-checklist.md](/c:/Users/Camilo/Desktop/ton618-web/docs/release-readiness-checklist.md)
- Checklist de QA manual: [docs/manual-qa-checklist.md](/c:/Users/Camilo/Desktop/ton618-web/docs/manual-qa-checklist.md)

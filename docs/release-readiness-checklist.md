# Release Readiness Checklist

## Precondiciones

- [ ] `VITE_DISCORD_CLIENT_ID` configurado en el entorno de deploy.
- [ ] `VITE_SUPABASE_URL` configurado.
- [ ] `VITE_SUPABASE_ANON_KEY` configurado.
- [ ] `VITE_SITE_URL` apunta al dominio final.
- [ ] Redirects OAuth de Discord/Supabase incluyen `/auth/callback`.
- [ ] `VITE_SUPPORT_SERVER_URL`, `VITE_STATUS_URL`, `VITE_DOCS_URL` y `VITE_CONTACT_EMAIL` revisados.

## Infra y datos

- [ ] Migraciones de Supabase aplicadas.
- [ ] Edge Function `sync-discord-guilds` desplegada.
- [ ] RLS validado para lectura del dashboard.
- [ ] El bot publica `bot_stats`.
- [ ] El bot publica `bot_guilds` y `guild_metrics_daily`.

## Calidad obligatoria

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `docs/final-verification-report.md` actualizado con resultados reales.

## Landing

- [ ] CTA de invite habilitado o degradado de forma intencional.
- [ ] Navbar, footer, hero y stats sin overflow en mobile.
- [ ] Skip link y focus states visibles con teclado.
- [ ] Cambio de idioma funcional.
- [ ] Metadatos, favicon, manifest y canonical correctos.
- [ ] Ruta comercial clara: valor, confianza, recursos y CTA final sin secciones huérfanas.

## Dashboard

- [ ] Login con Discord funcional.
- [ ] Callback `/auth/callback` funcional.
- [ ] Selector de guild funcional.
- [ ] Drawer/sidebar usable en mobile.
- [ ] Formularios muestran labels, errores y estados de foco claros.
- [ ] Activity, inbox y analytics se pueden usar en mobile sin bloqueo.
- [ ] Estados vacios, errores y warnings muestran texto explicito, no solo color.
- [ ] Fallos parciales de `activity`, `metrics`, `ticket events` y `ticket macros` degradan con gracia sin tumbar el snapshot completo.

## Aprobacion final

- [ ] QA manual completado con [manual-qa-checklist.md](/c:/Users/Camilo/Desktop/ton618-web/docs/manual-qa-checklist.md).
- [ ] Riesgos residuales documentados.
- [ ] Release owner da aprobacion de deploy.

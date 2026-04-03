# Release Readiness Checklist

## Precondiciones

- [ ] `VITE_DISCORD_CLIENT_ID` configurado en el entorno de deploy.
- [ ] `VITE_SUPABASE_URL` configurado.
- [ ] `VITE_SUPABASE_ANON_KEY` configurado.
- [ ] `VITE_SITE_URL` apunta al dominio final.
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` configurado.
- [ ] `VITE_BILLING_BETA_MODE=true` para la beta pagada controlada.
- [ ] Redirects OAuth de Discord/Supabase incluyen `/auth/callback`.
- [ ] `VITE_SUPPORT_SERVER_URL`, `VITE_STATUS_URL`, `VITE_DOCS_URL` y `VITE_CONTACT_EMAIL` revisados.
- [ ] `npm run env:check -- --mode=production` pasa con el archivo/env real del deploy.

## Infra y datos

- [ ] Migraciones de Supabase aplicadas.
- [ ] Edge Function `sync-discord-guilds` desplegada.
- [ ] Edge Functions `create-checkout-session`, `create-customer-portal-session` y `stripe-webhook` desplegadas.
- [ ] Secretos Supabase de billing cargados: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PORTAL_RETURN_URL`, `BILLING_BETA_MODE`.
- [ ] Stripe webhook apunta al endpoint publicado y firma verificada.
- [ ] `billing_beta_allowlist` cargada para los usuarios iniciales.
- [ ] RLS validado para lectura del dashboard.
- [ ] El bot publica `bot_stats`.
- [ ] `bot_stats` publica datos `source='live'`; no se exponen seeds como metricas publicas.
- [ ] El bot publica `bot_guilds` y `guild_metrics_daily`.
- [ ] El bot lee `guild_effective_entitlements` y proyecta `commercial_settings`/`opsPlan` en menos de 60s.

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
- [ ] Guilds con `last_synced_at` stale fuerzan re-sync y bloquean billing/writes.
- [ ] Drawer/sidebar usable en mobile.
- [ ] Formularios muestran labels, errores y estados de foco claros.
- [ ] Activity, inbox y analytics se pueden usar en mobile sin bloqueo.
- [ ] Estados vacios, errores y warnings muestran texto explicito, no solo color.
- [ ] Fallos parciales de `activity`, `metrics`, `ticket events` y `ticket macros` degradan con gracia sin tumbar el snapshot completo.
- [ ] Modulo Billing muestra plan, estado, renovacion/cancelacion y CTAs correctos.
- [ ] Checkout `Pro monthly` y `Pro yearly` crean sesion valida.
- [ ] Customer Portal abre para guild suscrito.
- [ ] `?checkout=success` confirma activacion y refleja `Pro` sin recargar manualmente el estado.

## Seguridad y observabilidad

- [ ] `sync-discord-guilds` rechaza `providerToken` que no pertenece al Discord user autenticado.
- [ ] Sentry Session Replay sigue desactivado en produccion.
- [ ] Existe alerta para `stripe-webhook` fallido o sin eventos recientes.
- [ ] Existe alerta para bridge lag > 5 min o desalineacion de entitlement/proyeccion.
- [ ] Existe alerta para fallos de creacion de tickets por encima del umbral definido.

## Legal y soporte

- [ ] `Terms`, `Privacy`, `Refund policy` y `Billing contact` publicados y navegables.
- [ ] Se valido el flujo de contacto para `Enterprise`.
- [ ] Se documento el proceso de override/manual comp para soporte.

## Aprobacion final

- [ ] QA manual completado con [manual-qa-checklist.md](/c:/Users/Camilo/Desktop/ton618-web/docs/manual-qa-checklist.md).
- [ ] Smoke E2E de beta pagada completado: login -> sync -> checkout -> activacion -> bridge -> cancelacion.
- [ ] Riesgos residuales documentados.
- [ ] Release owner da aprobacion de deploy.

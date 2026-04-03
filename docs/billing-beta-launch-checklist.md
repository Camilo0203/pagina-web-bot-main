# Billing Beta Launch Checklist

## Stripe

- [ ] Crear `Pro Monthly` en Stripe por `USD 9`.
- [ ] Crear `Pro Yearly` en Stripe por `USD 84`.
- [ ] Guardar los `price_id` reales para monthly y yearly.
- [ ] Configurar Customer Portal con cancelacion al final del periodo.
- [ ] Definir `success_url` y `cancel_url` del dashboard.
- [ ] Activar Stripe Tax si la cuenta ya esta lista para eso.

## Supabase

- [ ] Aplicar `supabase/migrations/20260403100000_add_billing_control_plane.sql`.
- [ ] Cargar secretos: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PORTAL_RETURN_URL`, `BILLING_BETA_MODE`.
- [ ] Desplegar `sync-discord-guilds`.
- [ ] Desplegar `create-checkout-session`.
- [ ] Desplegar `create-customer-portal-session`.
- [ ] Desplegar `stripe-webhook`.
- [ ] Confirmar que `guild_effective_entitlements` responde para un guild de prueba.
- [ ] Cargar `billing_beta_allowlist` con los usuarios iniciales.

## Web

- [ ] Definir `VITE_STRIPE_PUBLISHABLE_KEY`.
- [ ] Definir `VITE_BILLING_BETA_MODE=true`.
- [ ] Ejecutar `npm run env:check -- --mode=production`.
- [ ] Ejecutar `npm run verify`.
- [ ] Ejecutar `npm run test:unit`.
- [ ] Ejecutar `npm run test:e2e:smoke`.

## Bot

- [ ] Definir `SUPABASE_URL`.
- [ ] Definir `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Definir `OWNER_ID`.
- [ ] Mantener `DASHBOARD_BRIDGE_INTERVAL_MS=60000` para beta.
- [ ] Ejecutar `npm run env:check -- --mode=production`.
- [ ] Ejecutar `npm test`.

## Smoke manual

- [ ] Login con Discord.
- [ ] Sync de guilds exitoso.
- [ ] Guild stale bloquea checkout hasta re-sync.
- [ ] Guild fresco con bot instalado abre Stripe Checkout.
- [ ] Pago en test mode completa `checkout.session.completed`.
- [ ] `guild_billing_subscriptions` queda `active` o `trialing`.
- [ ] `guild_effective_entitlements` refleja `pro`.
- [ ] Dashboard muestra `Pro` en menos de `60s`.
- [ ] El bot refleja `Pro` en `commercial_settings` y `opsPlan`.
- [ ] Customer Portal abre y muestra la suscripcion correcta.
- [ ] Cancelacion al final del periodo se refleja en dashboard y bot.

## Go / no-go

- [ ] No hay fallos criticos abiertos.
- [ ] No hay Session Replay activo en dashboard.
- [ ] No hay metricas seed visibles en la landing.
- [ ] El soporte sabe usar el runbook de override y el runbook de incidentes.

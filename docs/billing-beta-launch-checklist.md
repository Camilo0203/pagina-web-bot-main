# Billing Beta Launch Checklist

## Lemon Squeezy

- [ ] Crear producto `TON618 Bot Pro` en Lemon Squeezy.
- [ ] Crear variante `Pro Monthly` por `USD 9.99`.
- [ ] Crear variante `Pro Yearly` por `USD 99.99`.
- [ ] Crear variante `Lifetime` por `USD 299.99`.
- [ ] Crear variante `Donation` (pay what you want).
- [ ] Guardar los `variant_id` reales para monthly, yearly, lifetime y donate.
- [ ] Configurar webhook con eventos de subscription y order.

## Supabase

- [ ] Aplicar `supabase/migrations/20260406000000_create_billing_tables.sql`.
- [ ] Aplicar `supabase/migrations/20260406000001_create_rls_policies.sql`.
- [ ] Cargar secretos: `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_WEBHOOK_SECRET`, `LEMON_SQUEEZY_STORE_ID`, `LEMON_SQUEEZY_VARIANT_PRO_MONTHLY`, `LEMON_SQUEEZY_VARIANT_PRO_YEARLY`, `LEMON_SQUEEZY_VARIANT_LIFETIME`, `LEMON_SQUEEZY_VARIANT_DONATE`, `BOT_API_KEY`.
- [ ] Desplegar `sync-discord-guilds`.
- [ ] Desplegar `billing-create-checkout`.
- [ ] Desplegar `billing-webhook`.
- [ ] Desplegar `billing-guild-status`.
- [ ] Desplegar `billing-get-guilds`.
- [ ] Confirmar que `guild_subscriptions` responde para un guild de prueba.

## Web

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
- [ ] Guild fresco con bot instalado abre Lemon Squeezy Checkout.
- [ ] Pago en test mode completa `subscription_created` o `order_created`.
- [ ] `guild_subscriptions` queda `active` con `premium_enabled=true`.
- [ ] Dashboard muestra `Pro` en menos de `60s`.
- [ ] El bot refleja `Pro` consultando `billing-guild-status`.
- [ ] Cancelacion marca `cancel_at_period_end=true` y premium sigue activo hasta `ends_at`.
- [ ] Lifetime purchase activa premium permanente sin `ends_at`.
- [ ] Donation se registra sin activar premium.

## Go / no-go

- [ ] No hay fallos criticos abiertos.
- [ ] No hay Session Replay activo en dashboard.
- [ ] No hay metricas seed visibles en la landing.
- [ ] El soporte sabe usar el runbook de override y el runbook de incidentes.

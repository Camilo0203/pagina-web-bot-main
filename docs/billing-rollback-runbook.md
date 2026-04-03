# Billing Rollback Runbook

## Cuando usarlo

Usa este rollback si ocurre cualquiera de estos casos:

- `stripe-webhook` deja de procesar eventos.
- Checkout cobra pero no activa `Pro`.
- El dashboard permite upgrades sobre guilds incorrectos.
- El bridge del bot deja planes desalineados por varios minutos.

## Objetivo

Detener nuevas compras sin borrar historial, conservar auditoria y volver a un estado seguro mientras investigamos.

## Pasos inmediatos

1. Desactivar el CTA comercial publico o redirigirlo temporalmente al soporte.
2. Mantener `BILLING_BETA_MODE=true` y vaciar o restringir `billing_beta_allowlist` a operadores internos.
3. Verificar que no existan campañas, anuncios o enlaces externos apuntando directo al checkout.
4. Confirmar si el problema es solo UI, solo webhook o proyeccion bot/dashboard.

## Contencion tecnica

1. Revisar logs de `create-checkout-session`, `create-customer-portal-session` y `stripe-webhook`.
2. Si el problema es en webhook, rotar temporalmente el endpoint o pausar el reenvio automatico hasta corregir.
3. Si el problema es de proyeccion al bot, forzar `queueDashboardBridgeSync` o reiniciar el worker del bot.
4. Si una compra entro y no proyecto el plan, aplicar override manual en `guild_entitlement_overrides`.

## Estado de datos esperado

- `billing_webhook_events` conserva el evento recibido.
- `guild_billing_subscriptions` conserva el estado real conocido.
- `guild_entitlement_overrides` solo se usa para compensacion o contencion puntual.
- Nunca borrar filas para “arreglar” el problema sin exportar evidencia antes.

## Comunicacion

1. Avisar al canal interno de ops con hora exacta de inicio del incidente.
2. Si hubo usuarios afectados, compartir ETA y metodo de soporte.
3. Si hubo cobros, ofrecer compensacion manual o extension de periodo antes de reabrir ventas.

## Reapertura

Antes de volver a abrir checkout:

1. Reprocesar el flujo completo en Stripe test mode.
2. Validar `guild_effective_entitlements` y proyeccion al bot.
3. Revisar el runbook `runbook-payment-activated-but-pro-missing.md`.
4. Rehabilitar allowlist y CTA publico de forma gradual.

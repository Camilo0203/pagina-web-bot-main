# Runbook: Pago entró pero Pro no activó

## Sintoma

El usuario completa Stripe Checkout, pero el dashboard o el bot siguen mostrando `Free`.

## Triage rapido

1. Identificar `guild_id`, `user_id`, `stripe_customer_id` y hora exacta del pago.
2. Confirmar si el dashboard muestra `?checkout=success`.
3. Verificar si el usuario sigue teniendo `user_guild_access` fresco para ese guild.

## Cadena de verificacion

### 1. Stripe

- Confirmar existencia de `checkout.session.completed`.
- Confirmar `customer.subscription.updated` o `invoice.paid`.
- Verificar que el `metadata.guild_id` del checkout es correcto.

### 2. Webhook

- Buscar `stripe_event_id` en `billing_webhook_events`.
- Si no existe, el problema es de entrega o firma.
- Si existe con `status='failed'`, revisar el error y reintentar el evento.

### 3. Suscripcion persistida

- Revisar `guild_billing_subscriptions` por `guild_id`.
- Confirmar `status in ('trialing','active','past_due')`.
- Confirmar `current_period_end` vigente.

### 4. Entitlement efectivo

- Consultar `guild_effective_entitlements` por `guild_id`.
- Si no devuelve `pro`, revisar override activo o datos incompletos en la suscripcion.

### 5. Proyeccion al bot

- Confirmar que el bot tiene `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
- Revisar el ultimo heartbeat del bridge.
- Forzar un sync del bridge si hace falta.

## Acciones comunes

### Webhook no procesado

1. Corregir firma o secreto.
2. Reenviar el evento desde Stripe.
3. Confirmar que `billing_webhook_events` cambia a `processed`.

### Suscripcion persistida pero entitlement en `free`

1. Revisar `status`, `current_period_end` y `plan`.
2. Corregir la fila afectada solo si hay evidencia clara del valor correcto.
3. Confirmar de nuevo la vista `guild_effective_entitlements`.

### Entitlement correcto pero bot sigue en `free`

1. Forzar sync del bridge.
2. Revisar logs de `dashboard.bridge.entitlement_fetch_failed`.
3. Verificar que `commercial_settings` y `dashboard_general_settings.opsPlan` cambiaron.

## Compensacion manual

Si el pago es valido y el cliente sigue bloqueado:

1. Insertar o actualizar `guild_entitlement_overrides` con `plan_override='pro'`.
2. Definir una nota con motivo, actor y hora.
3. Retirar el override cuando el estado automatico quede sano.

## Cierre

- Registrar causa raiz.
- Registrar tiempo total hasta restauracion.
- Si fue fallo sistemico, ejecutar el rollback de billing hasta tener fix verificado.

# TON618 Ops Console Beta Checklist

## Objetivo

Validar TON618 como consola operativa para staffs de Discord antes de abrir acceso masivo.

## Servidores ideales para la beta

- 3 a 5 comunidades medianas con staff activo
- ya usan tickets o soporte frecuente
- tienen al menos un owner o admin dispuesto a dar feedback semanal
- aceptan probar inbox web, SLA y playbooks durante 2 semanas

## Preparacion de staging

1. Aplicar migraciones de Supabase, incluyendo tablas de playbooks.
2. Desplegar `ton618-web` con `.env.staging`.
3. Desplegar `ton618-bot` con `.env.staging`.
4. Verificar `npm run env:check -- --file=.env.staging.example` en web y bot.
5. Confirmar que el bot responde `/health` y devuelve fingerprint.
6. Confirmar que `dashboard?demo=ops-console` carga y que `npm run test:e2e:smoke` pasa.

## Onboarding white-glove

1. Invitar el bot al servidor.
2. Ejecutar `/setup wizard` con dashboard, staff, admin, `plan_ops`, `sla_alerta` y `sla_escalado`.
3. Abrir el dashboard y revisar:
   - `General`
   - `Tickets`
   - `Playbooks`
   - `Inbox`
4. Activar 2 o 3 playbooks recomendados para el tipo de comunidad.
5. Confirmar que existe al menos un ticket real o de prueba en el inbox.
6. Confirmar una recomendacion desde dashboard o desde `/ticket playbook`.

## QA manual minimo

- OAuth Discord y callback real
- sync de guilds
- overview con datos
- inbox con claim, macro y cierre
- recomendacion visible y confirmable
- backup manual
- bridge sano despues de mutaciones

## Metricas semanales

- tiempo de primera respuesta
- tickets sin atender
- tickets en `warning` o `breached`
- recomendaciones pendientes
- recomendaciones aplicadas vs descartadas
- tickets resueltos por semana
- sesiones del dashboard por staff

## Criterios de salida de beta

- al menos 3 servidores usando inbox y SLA cada semana
- reduccion medible en tickets vencidos o en tiempo de primera respuesta
- cero fallos graves de auth, sync o perdida de configuracion
- tasa de confirmacion de playbooks suficiente para justificar mantenerlos visibles por defecto

## Comandos utiles

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run test:e2e:smoke`

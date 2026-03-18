# Dashboard Overview, Activity and Analytics

## Metricas mostradas

- `Overview`
  - Salud operativa del bridge usando `syncStatus.bridgeStatus`, `bridgeMessage`, heartbeat e inventario.
  - Modulos activos a partir de `config` y `metrics[].modulesActive`.
  - Tickets abiertos, alertas SLA y tickets vencidos desde `ticketWorkspace.inbox`.
  - Cambios pendientes y fallidos desde `syncStatus` con fallback a `mutations`.
  - Ultimo backup desde `backups[0]`.
  - Progreso del checklist usando `checklist`.
  - Pulso del servidor con miembros, eventos recientes y ultimo snapshot visible.

- `Activity`
  - Timeline unificada con `guild_dashboard_events` y `guild_config_mutations`.
  - Conteo de mutaciones pendientes y fallidas.
  - Filtros por fuente (`event`, `mutation`) y severidad (`danger`, `warning`, `info`, `success`, `neutral`).

- `Analytics`
  - Ventana de 14 dias sobre `guild_metrics_daily`.
  - Cards para `commandsExecuted`, `openTickets`, `avgFirstResponseMinutes` y `uptimePercentage`.
  - Resumen de `ticketsOpened`, `ticketsClosed`, `slaBreaches`, `activeMembers` y `modulesActive`.
  - Visualizacion ligera de comandos y tickets por dia.

## Logica de priorizacion

- `Overview` prioriza, en este orden:
  - Bridge con errores o heartbeat viejo.
  - Mutaciones fallidas.
  - Tickets con SLA vencido.
  - Falta de backup inicial.
  - Primer modulo con estado `needs_attention` o siguiente paso del checklist.

- `Quick actions` se enriquecen con contexto operativo:
  - Si hay tickets vencidos, se manda primero a `inbox`.
  - Si el bridge no esta `healthy`, se manda a `system`.
  - Si no hay urgencias operativas, se reutiliza la lista existente de `quickActions`.

- `Activity` asigna severidad asi:
  - Mutaciones `failed` => `danger`
  - Mutaciones `pending` => `warning`
  - Mutaciones `applied` => `success`
  - Eventos con `error` o `fail` en tipo/copy => `danger`
  - Eventos de `backup` o `ticket` => `info`
  - Eventos de `config` => `success`
  - Resto => `neutral`

- `Analytics` compara asi:
  - `commandsExecuted` y `openTickets`: ultimo dia vs dia previo.
  - `avgFirstResponseMinutes` y `uptimePercentage`: ultimo dia vs promedio de los dias previos visibles.

## Supuestos y fallbacks de datos

- Si `syncStatus.pendingMutations` o `failedMutations` no vienen, se recalculan desde `mutations`.
- Si faltan snapshots diarios:
  - `Overview` sigue mostrando salud, tickets, backups y checklist.
  - `Analytics` cae a estados vacios claros y no inventa comparativas.
- Si `avgFirstResponseMinutes` no existe en una serie, se muestra `Sin dato` y la grafica indica falta de serie suficiente.
- Si no hay `backups`, la portada lo trata como alerta accionable, no como error tecnico.
- Si `ticketWorkspace.inbox` esta vacio, soporte se presenta como sin carga activa.
- Las visualizaciones usan solo CSS/SVG inline para evitar dependencias pesadas.

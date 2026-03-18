# Dashboard Supabase Contract

Contrato funcional compartido entre `ton618-web`, Supabase y `ton618-bot` para que la dashboard administre el bot sin romper compatibilidad hacia atras.

## Objetivo

- `ton618-web` es frontend-only y no debe hablar directo con Mongo ni con Discord.
- Supabase es el control plane y read model del dashboard.
- `ton618-bot` es el escritor operativo y el ejecutor final de cambios.
- Las mutaciones del dashboard deben entrar por RPCs y terminar aplicadas por el bot.
- Los snapshots que consume el frontend deben ser tolerantes a campos legacy o parcialmente ausentes.

## Ownership

### Escritura

- `bot_guilds`: solo `ton618-bot` con service role.
- `guild_metrics_daily`: solo `ton618-bot`.
- `guild_inventory_snapshots`: solo `ton618-bot`.
- `guild_sync_status`: solo `ton618-bot` y helpers SQL internos como `refresh_guild_sync_counters`.
- `guild_dashboard_events`: RPCs y `ton618-bot`.
- `guild_config_mutations`: RPCs del dashboard crean filas `pending`; `ton618-bot` resuelve a `applied`, `failed` o `superseded`.
- `guild_backup_manifests`: solo `ton618-bot`.
- `guild_ticket_inbox`, `guild_ticket_events`, `guild_ticket_macros`: solo `ton618-bot`.
- `guild_configs`: el bot publica el read model final. El dashboard no debe hacer writes directos a esta tabla para flujo normal.

### Lectura

- `ton618-web` lee todas las tablas anteriores segun RLS.
- `user_guild_access` y `sync-discord-guilds` determinan acceso, no el bot.

## Tablas Esperadas

### `bot_guilds`

- Clave: `guild_id`.
- Campos importantes: `guild_name`, `guild_icon`, `member_count`, `premium_tier`, `setup_completed`, `last_heartbeat_at`, `updated_at`.
- Writer: bot.
- Notas:
  - `last_heartbeat_at` es la señal minima de presencia.
  - El frontend la usa como salud general, no como garantia de que no haya cola pendiente.

### `guild_configs`

- Clave: `guild_id`.
- Shape canonico consumido por frontend:
  - `general_settings`
  - `server_roles_channels_settings`
  - `tickets_settings`
  - `verification_settings`
  - `welcome_settings`
  - `suggestion_settings`
  - `modlog_settings`
  - `command_settings`
  - `system_settings`
  - `dashboard_preferences`
  - `updated_by`
  - `updated_at`
  - `config_source`
- Compatibilidad legacy:
  - `moderation_settings` sigue existiendo como alias legacy para `system_settings.legacyProtectionSettings`.
  - `dashboard_preferences.defaultSection = "moderation"` debe tratarse como legacy y normalizarse a `system`.
- Notas:
  - `updated_by` no es fuente autoritativa de auditoria cuando el write final lo hace el bot con service role; la trazabilidad real vive en `guild_config_mutations` y `guild_dashboard_events`.
  - `config_source` hoy funciona mas como metadata de export que como “ultimo actor humano”.

### `guild_metrics_daily`

- Clave natural: `(guild_id, metric_date)`.
- Campos importantes:
  - `commands_executed`
  - `moderated_messages`
  - `active_members`
  - `uptime_percentage`
  - `tickets_opened`
  - `tickets_closed`
  - `open_tickets`
  - `sla_breaches`
  - `avg_first_response_minutes`
  - `modules_active`
- Writer: bot.
- Notas:
  - `metric_date` es dia UTC.
  - `avg_first_response_minutes` puede ser `null`.

### `guild_inventory_snapshots`

- Clave: `guild_id`.
- Campos: `roles`, `channels`, `categories`, `commands`, `updated_at`.
- Writer: bot.
- Notas:
  - Es un snapshot de validacion/UI, no un source of truth persistente.

### `guild_config_mutations`

- Clave: `id`.
- Campos importantes:
  - `mutation_type`: `config | backup | ticket_action`
  - `section`
  - `status`: `pending | applied | failed | superseded`
  - `requested_payload`
  - `applied_payload`
  - `error_message`
  - `requested_at`, `applied_at`, `failed_at`, `superseded_at`, `updated_at`
- Creacion: RPCs del dashboard.
- Resolucion: bot.
- Guardrail:
  - Las RPCs superseden mutaciones `pending` previas del mismo ambito cuando aplica.

### `guild_backup_manifests`

- Clave: `backup_id`.
- Campos: `guild_id`, `actor_user_id`, `source`, `schema_version`, `exported_at`, `created_at`, `metadata`.
- Writer: bot.
- Notas:
  - `metadata` es extensible; el frontend solo debe depender de claves opcionales.

### `guild_sync_status`

- Clave: `guild_id`.
- Campos:
  - `bridge_status`: `healthy | degraded | error | unknown`
  - `bridge_message`
  - `last_heartbeat_at`
  - `last_inventory_at`
  - `last_config_sync_at`
  - `last_mutation_processed_at`
  - `last_backup_at`
  - `pending_mutations`
  - `failed_mutations`
  - `updated_at`
- Writer: bot.
- Notas:
  - Es la vista resumida de salud del bridge.
  - Si faltan contadores, el frontend puede recalcular a partir de `guild_config_mutations`.

### `guild_dashboard_events`

- Clave: `id`.
- Campos: `guild_id`, `actor_user_id`, `event_type`, `title`, `description`, `metadata`, `created_at`.
- Writers: RPCs y bot.
- Notas:
  - Es auditoria legible para dashboard; no reemplaza logs internos.

### Ticket Workspace

#### `guild_ticket_inbox`

- Clave: `(guild_id, ticket_id)`.
- Estados validos:
  - `workflow_status`: `new | triage | waiting_user | waiting_staff | escalated | resolved | closed`
  - `queue_type`: `support | community`
  - `priority`: `low | normal | high | urgent`
  - `sla_state`: `healthy | warning | breached | paused | resolved`
- Campos temporales importantes:
  - `claimed_at`
  - `first_response_at`
  - `resolved_at`
  - `closed_at`
  - `created_at`
  - `updated_at`
  - `last_customer_message_at`
  - `last_staff_message_at`
  - `last_activity_at`
- Writer: bot.

#### `guild_ticket_events`

- Clave: `id`.
- Estados validos:
  - `actor_kind`: `customer | staff | bot | system`
  - `visibility`: `public | internal | system`
- Writer: bot.

#### `guild_ticket_macros`

- Clave: `(guild_id, macro_id)`.
- `visibility`: `public | internal`.
- Writer: bot.

## RPCs Esperadas

### `request_guild_config_change`

- Input:
  - `p_guild_id: text`
  - `p_section: text`
  - `p_payload: jsonb`
- `p_section` valido:
  - `general`
  - `server_roles_channels`
  - `tickets`
  - `verification`
  - `welcome`
  - `suggestions`
  - `modlogs`
  - `commands`
  - `system`
- Output: fila de `guild_config_mutations`.
- Contrato:
  - Crea una mutacion `pending`.
  - Supersede mutaciones `pending` previas del mismo `section`.
  - No aplica directamente Mongo ni `guild_configs`.

### `request_guild_backup_action`

- Input:
  - `p_guild_id: text`
  - `p_action: create_backup | restore_backup`
  - `p_payload: jsonb`
- Payload esperado:
  - `create_backup`: `{}` permitido.
  - `restore_backup`: `{ "backupId": "<id>" }`
- Output: fila de `guild_config_mutations`.

### `request_ticket_dashboard_action`

- Input:
  - `p_guild_id: text`
  - `p_action: text`
  - `p_payload: jsonb`
- `p_action` valido:
  - `claim`
  - `unclaim`
  - `assign_self`
  - `unassign`
  - `set_status`
  - `close`
  - `reopen`
  - `add_note`
  - `add_tag`
  - `remove_tag`
  - `reply_customer`
  - `post_macro`
  - `set_priority`
- Payload minimo adicional esperado segun accion:
  - Base de resolucion de ticket: `ticketId` o `channelId`.
  - `set_status`: `workflowStatus`
  - `close`: `reason` opcional
  - `add_note`: `note`
  - `add_tag` / `remove_tag`: `tag`
  - `reply_customer`: `message`
  - `post_macro`: `macroId`
  - `set_priority`: `priority`
- Metadata añadida por frontend:
  - `actorDiscordId`
  - `actorLabel`
- Output: fila de `guild_config_mutations`.

## Payload Shapes Relevantes

### `dashboard_preferences`

Shape esperado:

```json
{
  "defaultSection": "overview|inbox|general|server_roles|tickets|verification|welcome|suggestions|modlogs|commands|system|activity|analytics",
  "compactMode": false,
  "showAdvancedCards": true
}
```

Compatibilidad:

- Legacy `moderation` debe normalizarse a `system`.

### `command_settings.commandRateLimitOverrides`

Shape canonico de lectura del frontend:

```json
{
  "ping": {
    "maxActions": 2,
    "windowSeconds": 10,
    "enabled": true
  }
}
```

Compatibilidad:

- El bot tambien tolera shape legacy estilo snake_case al importar:

```json
{
  "ping": {
    "max_actions": 2,
    "window_seconds": 10,
    "enabled": true
  }
}
```

### `system_settings`

Shape canonico:

```json
{
  "maintenanceMode": false,
  "maintenanceReason": null,
  "legacyProtectionSettings": {
    "antiSpamEnabled": true,
    "antiSpamThreshold": 6,
    "linkFilterEnabled": true,
    "capsFilterEnabled": true,
    "capsPercentageLimit": 70,
    "duplicateFilterEnabled": true,
    "duplicateWindowSeconds": 45,
    "raidProtectionEnabled": true,
    "raidPreset": "balanced"
  }
}
```

Compatibilidad:

- `moderation_settings` puede seguir viniendo en paralelo y debe leerse como fallback.

## Timestamps

- Todas las marcas de tiempo compartidas deben viajar como ISO 8601 UTC (`timestamptz`).
- `metric_date` es `date` UTC, no timestamp.
- El frontend tolera `null` en timestamps operativos opcionales.
- El bot no debe enviar strings vacios para timestamps; usar `null`.

## Fallback Behavior

- Si falta fila en `guild_configs`, el frontend cae a defaults locales seguros.
- Si `system_settings` no trae `legacyProtectionSettings`, se usa `moderation_settings` como fallback.
- Si faltan `pending_mutations` o `failed_mutations`, el frontend recalcula desde `guild_config_mutations`.
- Si faltan datasets opcionales como backups o ticket workspace, la dashboard debe seguir operando configuracion base.
- Si una mutacion falla, el estado visible debe salir de `guild_config_mutations.status = failed` y `error_message`.

## Guardrails Para Futuras Features

- No agregar nuevas escrituras directas desde `ton618-web` hacia tablas read-model; usar RPCs y cola de mutaciones.
- Todo nuevo campo de `guild_configs` debe ser:
  - opcional o con default estable en SQL
  - tolerado por el frontend con normalizacion
  - serializado por el bot con shape camelCase dashboard-facing si vive dentro de JSON
- Todo nuevo enum debe definirse primero en SQL/RPC, luego en bot, luego en frontend.
- Si un valor legacy deja de ser valido, mapearlo explicitamente en normalizacion antes de eliminar soporte.
- `guild_config_mutations` y `guild_dashboard_events` son el contrato de auditoria; no depender de `updated_by` en `guild_configs` para saber “quien hizo que”.
- Cualquier nueva accion del dashboard debe documentar:
  - writer real
  - payload minimo
  - estados posibles
  - timestamp de origen y timestamp de aplicacion

## Hallazgos De Esta Revision

### Ya alineado

- El frontend ya consume las tablas correctas de Supabase y no depende de backend web propio.
- El bot ya sincroniza `bot_guilds`, `guild_metrics_daily`, `guild_configs`, backups, inbox de tickets y estado del bridge.
- Las RPCs actuales para config, backups y ticket workspace encajan con el modelo de cola que el frontend espera.
- El frontend ya tolera `moderation_settings` como fallback legacy para `system_settings.legacyProtectionSettings`.

### Desalineado

- El bot aceptaba un set legacy de `dashboard_preferences.defaultSection` y podia conservar `moderation`, mientras el frontend moderno ya no lo acepta como enum valido.
- La documentacion del bot mencionaba `SUPABASE_DASHBOARD_SYNC_INTERVAL_MS`, pero el bridge solo leia `DASHBOARD_BRIDGE_INTERVAL_MS`.
- `updated_by` y `config_source` en `guild_configs` pueden leerse de forma ambigua si se interpretan como autoria humana final.

### Corregido

- Se amplió el set aceptado de `defaultSection` en el bot al contrato actual del frontend.
- Se normaliza el valor legacy `moderation` a `system` para no romper snapshots modernos.
- El frontend ahora endurece la lectura de preferencias legacy para no descartar toda la configuracion por ese valor historico.
- El bot ahora acepta tambien el alias `SUPABASE_DASHBOARD_SYNC_INTERVAL_MS` documentado.

### Pendiente

- `save_guild_config` sigue existiendo como RPC legacy en SQL, pero el flujo actual de produccion debe seguir usando `request_guild_config_change`.
- `updated_by` en `guild_configs` no debe promocionarse como fuente de auditoria fuerte sin redefinir ownership del write final.

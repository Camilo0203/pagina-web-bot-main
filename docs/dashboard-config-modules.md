# Dashboard Config Modules

## Resumen por modulo

### general
- Ajusta idioma, zona horaria, modo de comandos, prefijo y preferencias del dashboard.
- Separo configuracion operativa del servidor y preferencias de navegacion del equipo.

### server_roles
- Centraliza canales base, canales de reportes, contadores y roles criticos del bot.
- Ahora muestra advertencias si el inventario no tiene los elementos ya guardados.

### tickets
- Cubre capacidad, SLA, escalations, auto-assign, incident mode, reportes y DMs.
- Se validan dependencias entre incident mode, reportes y escalado.

### verification
- Cubre activacion, canal del panel, roles, modo de verificacion, copy visual y antiraid.
- La verificacion por pregunta exige pregunta y respuesta; la activacion exige canal y rol verificado.

### welcome
- Cubre bienvenida publica, DM de entrada, autorol y mensaje de despedida.
- La activacion exige canales validos y el DM exige contenido explicito.

### suggestions
- Cubre canal principal, canal interno, canales de resultado y reglas de moderacion.
- Se exige al menos un canal de resultado cuando el modulo esta activo.

### modlogs
- Cubre activacion, destino de auditoria y matriz de eventos registrados.
- Si el modulo esta activo, exige canal y al menos un evento marcado.

### commands
- Cubre disabled commands, rate limits globales, rate limits por comando y overrides.
- Se validan overrides duplicados y referencias a comandos ya no presentes en el inventario.

### system
- Cubre maintenance mode, motivo visible, estado del bridge, backups y restore seguro.
- El restore ahora requiere seleccion explicita del backup y confirmacion manual con texto.

## Validaciones implementadas

- Campos requeridos segun estado del modulo, no solo por tipo.
- Rangos numericos ya soportados por zod y mantenidos en formularios.
- Dependencias entre campos:
  - `general`: prefijo requerido si `commandMode = prefix`.
  - `tickets`: escalado requiere minutos y un destino; reporte diario requiere canal; incident mode requiere categorias y mensaje.
  - `verification`: si esta activo requiere canal y rol verificado; modo `question` requiere pregunta y respuesta.
  - `welcome`: bienvenida requiere canal; DM requiere mensaje; despedida requiere canal.
  - `suggestions`: si esta activo requiere canal principal, log interno y al menos un canal de resultado.
  - `modlogs`: si esta activo requiere canal y por lo menos un evento.
  - `system`: maintenance mode requiere motivo.
- Validacion contextual con inventario:
  - roles/canales/categorias/comandos ya guardados pero ausentes del snapshot actual se muestran como errores visibles.
  - cuando el inventario esta vacio o parece viejo se avisa al admin antes de guardar.
- Resumen visible de errores por modulo para evitar validaciones silenciosas.

## Supuestos de datos

- Los payloads enviados siguen usando los `ConfigMutationSectionId` y las formas ya tipadas del frontend.
- No se agregaron nuevos campos al RPC; solo se fortalecio la validacion y presentacion del frontend.
- El inventario del guild puede llegar vacio o atrasado; el dashboard debe seguir mostrando la configuracion persistida sin bloquear lectura.
- `request_guild_backup_action` sigue aceptando `create_backup` y `restore_backup` con `backupId` en el restore.
- El backend sigue siendo la fuente final de aplicacion; por eso el frontend modela guardado como solicitud auditada y no como confirmacion inmediata.

## Mejoras futuras

- Validar timezones contra un catalogo cerrado en vez de texto libre.
- Agregar previews visuales para embeds de verification y welcome.
- Soportar busqueda y filtros dentro de listas largas de roles/canales.
- Añadir historial expandible por seccion con diff de payload solicitado vs aplicado.
- Mostrar recomendaciones automaticas segun salud del bridge, fallos recientes y cobertura de setup.

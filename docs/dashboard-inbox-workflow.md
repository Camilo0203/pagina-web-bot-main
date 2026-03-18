# Dashboard Inbox Workflow

## Flujo de trabajo del staff

1. El staff entra al modulo `Inbox` y aterriza en la cola abierta por defecto.
2. Usa busqueda local y filtros para reducir volumen por apertura, prioridad, SLA, categoria y asignacion.
3. Selecciona un ticket desde la lista priorizada; la cola queda ordenada por apertura, SLA, prioridad y actividad reciente.
4. Revisa el detalle del ticket con subject, estado, prioridad, SLA, tags, owner actual, assignee, timestamps y volumen de mensajes.
5. Consulta el timeline del ticket para entender conversacion, notas internas y eventos sincronizados.
6. Consulta el historial del cliente para detectar reincidencia, tickets abiertos adicionales o contexto previo.
7. Ejecuta acciones operativas desde el sidebar sin bloquear la pantalla completa:
   claim/unclaim, assign self/unassign, set status, set priority, close/reopen, add/remove tags, add note, reply customer y post macro.
8. Espera confirmacion local de la mutacion y el refresco natural por polling/refetch del snapshot.

## Filtros y acciones

### Filtros disponibles

- `Busqueda local`: ticket id, usuario, asunto, categoria, agente y tags.
- `Abiertos/cerrados`: separa backlog activo de historico.
- `Prioridad`: `urgent`, `high`, `normal`, `low`.
- `SLA`: `breached`, `warning`, `healthy`, `paused`, `resolved`.
- `Categoria`: opciones dinamicas derivadas del snapshot `ticketWorkspace.inbox`.
- `Asignacion`: `claimed`, `unclaimed`, `assigned`, `unassigned`.

### Acciones operativas

- `claim` y `unclaim`: control de ownership del ticket.
- `assign_self` y `unassign`: control de responsable operativo.
- `set_status`: cambio de workflow sin salir del detalle.
- `set_priority`: ajuste rapido de severidad.
- `close` y `reopen`: salida y reingreso a la cola activa.
- `add_tag` y `remove_tag`: clasificacion rapida.
- `add_note`: nota interna con shortcut `Ctrl/Cmd + Enter`.
- `reply_customer`: respuesta manual con shortcut `Ctrl/Cmd + Enter`.
- `post_macro`: selector con preview, visibilidad y confirmacion explicita antes de publicar.

## Edge cases cubiertos

- Sin bot instalado: se muestra estado bloqueado en vez del workspace.
- Sin tickets: empty state dedicada para la bandeja.
- Sin resultados por filtros: empty state con opcion clara para limpiar filtros.
- Sin ticket seleccionado: estado vacio del panel detalle.
- Sin macros configuradas: estado vacio en el bloque de macros.
- Sin historial suficiente del cliente: estado vacio en contexto del usuario.
- Sin eventos sincronizados: estado vacio en timeline.
- Bridge degradado o con error: aviso local para explicar retrasos del polling.
- Mutacion en curso: se deshabilitan solo los controles de accion relevantes; la vista sigue navegable.
- Mutacion exitosa o fallida: feedback local inmediato por ticket sin depender de bloquear toda la pantalla.
- Refetch del snapshot: los drafts se resetean solo al cambiar de ticket, no en cada polling del mismo ticket.
- Navegacion por teclado: flechas arriba/abajo en la lista y shortcuts de envio/guardado en textarea.

# Dashboard Auth Shell

## Flujo final

1. El usuario entra a `/dashboard`.
2. `useDashboardAuth` valida la sesion actual con Supabase y deja visible un estado de acceso seguro mientras carga.
3. Si no hay sesion, el shell muestra una tarjeta de login con Discord y feedback claro cuando Supabase no esta configurado o cuando el inicio de sesion falla.
4. `signInWithDiscord` guarda la intencion del guild solicitado y redirige a Discord usando `/auth/callback`.
5. `AuthCallbackPage` ejecuta el callback en tres fases visibles: intercambio OAuth, sincronizacion de guilds y redireccion.
6. Si la pagina se recarga durante el callback, se rehidrata el estado visual desde `sessionStorage` y se intenta recuperar la sesion ya creada en Supabase antes de fallar.
7. Si el `provider_token` no llega o el intercambio OAuth no deja una sesion reutilizable, el usuario recibe una accion directa para reiniciar el login.
8. Si la sincronizacion falla por un problema temporal, el callback permite reintentar la sincronizacion sin reiniciar el login completo mientras exista `provider_token`.
9. Al completar la sincronizacion se invalidan queries de React Query, se limpia la intencion OAuth y se redirige a `/dashboard` o `/dashboard?guild=...`.
10. En el dashboard autenticado se cargan guilds administrables y se decide la seleccion activa sin introducir estado global adicional.
11. Si el `guild` de la URL ya no existe o no es administrable, el shell no corrige en silencio: muestra un estado explicito con acciones para cambiar al mejor guild disponible o re-sincronizar acceso.
12. Cuando hay un guild valido, se carga el snapshot con React Query, timeouts y mensajes de error trazables por contexto.

## Decisiones de UX

- El dashboard ahora separa con claridad los estados de acceso, carga de guilds, snapshot, vacio y error.
- Los errores muestran una accion primaria util y una accion secundaria complementaria siempre que sea posible.
- El selector de guild aparece tanto en sidebar como en header para reducir friccion en desktop y mobile.
- La persistencia de seccion sigue siendo por guild usando `localStorage`, pero ya no se fuerza una correccion silenciosa cuando la URL apunta a un guild invalido.
- El shell hace visible la salud del bridge, el ultimo heartbeat, la ultima sincronizacion y el estado de cola de mutaciones.
- La re-sincronizacion reporta errores en contexto premium y sin sacar al usuario del panel.
- El callback conserva feedback de progreso real y evita navegar antes de terminar el intercambio y la sincronizacion.
- Las respuestas vacias, `nulls`, timeouts y errores de Supabase se convierten en mensajes mas utiles y trazables con sufijos de contexto como `[auth.guild-sync]` o `[snapshot.metrics.<guildId>]`.

## Casos borde cubiertos

- Usuario no autenticado.
- Supabase Auth no configurado.
- Error al validar sesion existente.
- Reload de `/auth/callback` durante el flujo.
- Callback sin `code` pero con sesion ya recuperable.
- `provider_token` ausente despues del exchange.
- Falla temporal de `sync-discord-guilds`.
- Reintento de sincronizacion sin rehacer login completo.
- Reinicio de login cuando el callback ya no es recuperable.
- Usuario autenticado sin guilds administrables.
- Guild solicitado por URL inexistente o sin acceso actual.
- Snapshot fallando por RLS, tablas o bridge.
- Respuestas vacias o `null` desde queries y RPCs.
- Timeouts de intercambio OAuth, sincronizacion y queries del dashboard.

# Auth Session Hardening

## Flujo actual

1. `/auth/callback` recibe `code` o un error OAuth.
2. `exchangeDashboardCodeForSession(code)` intenta completar PKCE con Supabase.
3. El flujo revalida la sesion persistida con `getFreshDashboardSession()`.
4. Solo si existe una sesion fresca y contiene `provider_token`, se invoca `syncDiscordGuilds`.
5. Si el sync termina bien, se invalidan queries y se redirige a `/dashboard` o `/dashboard?guild=...`.

## Riesgo mitigado

- Antes, el callback podia seguir con una sesion intermedia o stale y terminar llamando `sync-discord-guilds` con JWT no utilizable.
- Ahora, si tras el exchange no existe una sesion valida, el flujo limpia auth local y aborta antes del sync.
- Si aparece `Invalid JWT`, el cliente limpia el estado local de Supabase y obliga a reiniciar login.
- Reiniciar login desde la UI ahora limpia auth local antes de volver a enviar al usuario a Discord.
- La normalizacion del error del callback ahora intenta decodificar tambien errores percent-encoded, lo que mejora el mensaje visible al usuario.

## Que sigue dependiendo de Supabase/Auth externo

- La emision correcta de la sesion por Supabase despues del exchange OAuth.
- La validez real del JWT aceptado por la Edge Function `sync-discord-guilds`.
- Redirect URLs, reloj del entorno, cookies/storage y configuracion externa de Auth.

## Como reproducir `Invalid JWT`

1. Inicia login con Discord y deja una sesion local stale o corrupta en el navegador.
2. Completa el callback hacia `/auth/callback`.
3. Fuerza una condicion donde la Edge Function o `getUser()` rechacen el token con `Invalid JWT`.
4. El flujo debe caer en error antes de continuar por success path.

## Como se comporta ahora la UI si ocurre

- La pagina de callback ya no sigue hacia redireccion exitosa.
- El usuario ve un error explicito de sesion invalida/expirada.
- Se deshabilita el reintento de sync ciego y se prioriza `Reiniciar login con Discord`.
- El estado auth local se limpia para evitar reutilizar la sesion dudosa.

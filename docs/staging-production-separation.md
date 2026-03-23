# Staging vs Production

## Reglas base

- staging y produccion no comparten Discord app
- staging y produccion no comparten Supabase
- staging y produccion no comparten Mongo
- no reutilizar callbacks, anon keys ni service keys entre entornos

## Web

- `staging`: usar `.env.staging.example` como base
- `production`: usar `.env.production.example` como base
- correr `npm run env:check -- --mode=production` antes de publicar production

## Flujo recomendado

1. Validar local con `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
2. Desplegar a staging.
3. Ejecutar smoke demo con `npm run test:e2e:smoke`.
4. Validar OAuth real, guild sync y mutaciones.
5. Promover a production.

## Riesgos que evita esta separacion

- callback OAuth roto por mezclar client IDs
- data de prueba apareciendo en servidores reales
- snapshots inconsistentes entre bot y dashboard
- mutaciones de staging consumidas por el bot de production

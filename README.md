# Discord Bot Landing (Vite + React + TypeScript + Tailwind)

## Scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`

## Environment Variables
Copy `.env.example` to `.env` and fill values:
- `VITE_BOT_NAME`: Brand name shown in UI and metadata.
- `VITE_DISCORD_CLIENT_ID`: Required to enable Invite CTA.
- `VITE_DISCORD_PERMISSIONS`: Discord permissions integer (default `8`).
- `VITE_SUPPORT_SERVER_URL`: Public support server link.
- `VITE_DASHBOARD_URL`: External dashboard link.
- `VITE_DOCS_URL`: Docs site link.
- `VITE_STATUS_URL`: Public status page link.
- `VITE_GITHUB_URL`: GitHub profile/repo link.
- `VITE_TWITTER_URL`: X/Twitter link.
- `VITE_CONTACT_EMAIL`: Contact/support email.
- `VITE_SUPABASE_URL`: Supabase project URL (optional, for live stats).
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key (optional, for live stats).
- `VITE_SITE_URL`: Canonical website URL for OG and sitemap setup.

If a variable is missing, the UI degrades gracefully (disabled CTA, hidden social icon, or internal fallback anchor).

## Supabase `bot_stats` Setup
Use the migration in `supabase/migrations/20260305063924_create_bot_stats_table.sql` to create:
- `bot_stats.servers`
- `bot_stats.users`
- `bot_stats.commands_executed`
- `bot_stats.uptime_percentage`
- `bot_stats.updated_at`

The landing page reads the latest row (ordered by `updated_at`) every 30 seconds.

## Updating Stats From Your Bot (High Level)
1. Keep your bot backend as the only writer to `bot_stats`.
2. Periodically upsert a single row with latest counters and uptime.
3. Refresh `updated_at` on every write.
4. Keep Row Level Security read-only for public clients.

No backend is included in this repo; this project is frontend-only.

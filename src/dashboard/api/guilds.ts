import { dashboardGuildSchema } from '../schemas';
import type { DashboardGuild } from '../types';
import {
  createDashboardError,
  getSupabaseClient,
  GuildAccessRow,
  runQueryWithTimeout,
} from './shared';

function mapGuildRow(row: GuildAccessRow): DashboardGuild {
  return dashboardGuildSchema.parse({
    guildId: row.guild_id,
    guildName: row.guild_name,
    guildIcon: row.guild_icon,
    permissionsRaw: row.permissions_raw ?? '0',
    canManage: Boolean(row.can_manage),
    isOwner: Boolean(row.is_owner),
    botInstalled: Boolean(row.bot_installed),
    memberCount: row.member_count,
    premiumTier: row.premium_tier,
    botLastSeenAt: row.bot_last_seen_at,
    lastSyncedAt: row.last_synced_at,
  });
}

export async function fetchDashboardGuilds(): Promise<DashboardGuild[]> {
  const client = getSupabaseClient();
  const { data, error } = await runQueryWithTimeout(
    'guilds.list',
    client
      .from('user_guild_access')
      .select(
        'guild_id, guild_name, guild_icon, permissions_raw, can_manage, is_owner, bot_installed, member_count, premium_tier, bot_last_seen_at, last_synced_at',
      )
      .eq('can_manage', true)
      .order('bot_installed', { ascending: false })
      .order('guild_name', { ascending: true })
      .returns<GuildAccessRow[]>(),
  );

  if (error) {
    throw createDashboardError(
      'guilds.list',
      error,
      'No se pudieron cargar los servidores administrables.',
    );
  }

  return (data ?? []).map(mapGuildRow);
}

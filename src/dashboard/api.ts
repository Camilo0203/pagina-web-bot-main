import type { Session } from '@supabase/supabase-js';
import { getAuthCallbackUrl } from '../config';
import { supabase } from '../lib/supabaseClient';
import {
  dashboardGuildSchema,
  dashboardSyncResultSchema,
  guildEventSchema,
  guildMetricsSchema,
} from './schemas';
import { normalizeGuildConfig } from './utils';
import type {
  DashboardGuild,
  DashboardSessionState,
  DashboardSyncResult,
  GuildConfig,
  GuildEvent,
  GuildMetricsDaily,
} from './types';

interface GuildAccessRow {
  guild_id: string;
  guild_name: string;
  guild_icon: string | null;
  permissions_raw: string | null;
  can_manage: boolean | null;
  is_owner: boolean | null;
  bot_installed: boolean | null;
  member_count: number | null;
  premium_tier: string | null;
  bot_last_seen_at: string | null;
  last_synced_at: string | null;
}

interface GuildConfigRow {
  guild_id: string;
  general_settings: unknown;
  moderation_settings: unknown;
  dashboard_preferences: unknown;
  updated_by: string | null;
  updated_at: string | null;
}

interface GuildEventRow {
  id: string;
  guild_id: string;
  event_type: string;
  title: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface GuildMetricsRow {
  guild_id: string;
  metric_date: string;
  commands_executed: number | null;
  moderated_messages: number | null;
  active_members: number | null;
  uptime_percentage: number | null;
}

function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase no esta configurado para la dashboard.');
  }

  return supabase;
}

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

export async function getDashboardSession(): Promise<DashboardSessionState> {
  if (!supabase) {
    return {
      session: null,
      user: null,
    };
  }

  const client = getSupabaseClient();
  const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] =
    await Promise.all([client.auth.getSession(), client.auth.getUser()]);

  if (sessionError) {
    throw sessionError;
  }

  if (userError) {
    throw userError;
  }

  return {
    session: sessionData.session,
    user: userData.user,
  };
}

export async function signInWithDiscord(): Promise<void> {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: getAuthCallbackUrl(),
      scopes: 'identify guilds email',
    },
  });

  if (error) {
    throw error;
  }

  if (data.url) {
    window.location.assign(data.url);
  }
}

export async function signOutDashboard(): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function exchangeDashboardCodeForSession(code: string): Promise<Session | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.exchangeCodeForSession(code);

  if (error) {
    throw error;
  }

  return data.session;
}

export async function syncDiscordGuilds(providerToken: string): Promise<DashboardSyncResult> {
  const client = getSupabaseClient();
  const { data, error } = await client.functions.invoke('sync-discord-guilds', {
    body: {
      providerToken,
    },
  });

  if (error) {
    throw error;
  }

  return dashboardSyncResultSchema.parse(data);
}

export async function fetchDashboardGuilds(): Promise<DashboardGuild[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('user_guild_access')
    .select(
      'guild_id, guild_name, guild_icon, permissions_raw, can_manage, is_owner, bot_installed, member_count, premium_tier, bot_last_seen_at, last_synced_at',
    )
    .eq('can_manage', true)
    .order('bot_installed', { ascending: false })
    .order('guild_name', { ascending: true })
    .returns<GuildAccessRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapGuildRow);
}

export async function fetchGuildConfig(guildId: string): Promise<GuildConfig> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('guild_configs')
    .select('guild_id, general_settings, moderation_settings, dashboard_preferences, updated_by, updated_at')
    .eq('guild_id', guildId)
    .maybeSingle<GuildConfigRow>();

  if (error) {
    throw error;
  }

  return normalizeGuildConfig(guildId, data);
}

export async function saveGuildConfig(
  guildId: string,
  payload: Pick<GuildConfig, 'generalSettings' | 'moderationSettings' | 'dashboardPreferences'>,
): Promise<GuildConfig> {
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('save_guild_config', {
    p_guild_id: guildId,
    p_general_settings: payload.generalSettings,
    p_moderation_settings: payload.moderationSettings,
    p_dashboard_preferences: payload.dashboardPreferences,
  });

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;

  return normalizeGuildConfig(guildId, row as GuildConfigRow | null | undefined);
}

export async function fetchGuildActivity(guildId: string): Promise<GuildEvent[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('guild_dashboard_events')
    .select('id, guild_id, event_type, title, description, metadata, created_at')
    .eq('guild_id', guildId)
    .order('created_at', { ascending: false })
    .limit(12)
    .returns<GuildEventRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    guildEventSchema.parse({
      id: row.id,
      guildId: row.guild_id,
      eventType: row.event_type,
      title: row.title,
      description: row.description,
      metadata: row.metadata ?? {},
      createdAt: row.created_at,
    }),
  );
}

export async function fetchGuildMetrics(guildId: string): Promise<GuildMetricsDaily[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('guild_metrics_daily')
    .select('guild_id, metric_date, commands_executed, moderated_messages, active_members, uptime_percentage')
    .eq('guild_id', guildId)
    .order('metric_date', { ascending: false })
    .limit(7)
    .returns<GuildMetricsRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) =>
      guildMetricsSchema.parse({
        guildId: row.guild_id,
        metricDate: row.metric_date,
        commandsExecuted: row.commands_executed ?? 0,
        moderatedMessages: row.moderated_messages ?? 0,
        activeMembers: row.active_members ?? 0,
        uptimePercentage: Number((row.uptime_percentage ?? 0).toFixed(2)),
      }),
    )
    .sort((a, b) => a.metricDate.localeCompare(b.metricDate));
}

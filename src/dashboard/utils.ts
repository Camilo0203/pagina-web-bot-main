import type { User } from '@supabase/supabase-js';
import {
  defaultDashboardPreferences,
  defaultGeneralSettings,
  defaultGuildConfig,
  defaultModerationSettings,
  guildConfigSchema,
} from './schemas';
import type {
  DashboardGuild,
  DashboardSessionState,
  GuildConfig,
  GuildMetricsDaily,
} from './types';

interface GuildConfigRow {
  guild_id?: string | null;
  general_settings?: unknown;
  moderation_settings?: unknown;
  dashboard_preferences?: unknown;
  updated_by?: string | null;
  updated_at?: string | null;
}

export function createDefaultGuildConfig(guildId: string): GuildConfig {
  return {
    guildId,
    ...defaultGuildConfig,
  };
}

export function normalizeGuildConfig(
  guildId: string,
  row: GuildConfigRow | null | undefined,
): GuildConfig {
  if (!row) {
    return createDefaultGuildConfig(guildId);
  }

  const parsed = guildConfigSchema.safeParse({
    guildId: row.guild_id ?? guildId,
    generalSettings: row.general_settings ?? defaultGeneralSettings,
    moderationSettings: row.moderation_settings ?? defaultModerationSettings,
    dashboardPreferences: row.dashboard_preferences ?? defaultDashboardPreferences,
    updatedBy: row.updated_by ?? null,
    updatedAt: row.updated_at ?? null,
  });

  if (parsed.success) {
    return parsed.data;
  }

  return createDefaultGuildConfig(guildId);
}

export function resolveGuildIconUrl(guild: Pick<DashboardGuild, 'guildId' | 'guildIcon'>): string | null {
  if (!guild.guildIcon) {
    return null;
  }

  return `https://cdn.discordapp.com/icons/${guild.guildId}/${guild.guildIcon}.png?size=128`;
}

export function resolveGuildInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'DS';
}

export function resolveUserAvatarUrl(user: User | null): string | null {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const avatarUrl = typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : null;
  const avatar = typeof metadata?.avatar === 'string' ? metadata.avatar : null;

  if (avatarUrl) {
    return avatarUrl;
  }

  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${avatar}.png?size=128`;
  }

  return null;
}

export function formatDateTime(value: string | null, locale = 'es-CO'): string {
  if (!value) {
    return 'Sin registro';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Sin registro';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

export function formatMetricDate(value: string, locale = 'es-CO'): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export function formatRelativeTime(value: string | null, locale = 'es-CO'): string {
  if (!value) {
    return 'Aun sin actividad';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Fecha invalida';
  }

  const diffMs = parsed.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, 'day');
}

export function getPreferredGuildId(
  guilds: DashboardGuild[],
  requestedGuildId: string | null,
  storedGuildId: string | null,
): string | null {
  const byRequested = guilds.find((guild) => guild.guildId === requestedGuildId);
  if (byRequested) {
    return byRequested.guildId;
  }

  const byStored = guilds.find((guild) => guild.guildId === storedGuildId);
  if (byStored) {
    return byStored.guildId;
  }

  return guilds.find((guild) => guild.botInstalled)?.guildId ?? guilds[0]?.guildId ?? null;
}

export function getMetricsSummary(metrics: GuildMetricsDaily[]) {
  const sorted = [...metrics].sort((a, b) => a.metricDate.localeCompare(b.metricDate));
  const latest = sorted.length ? sorted[sorted.length - 1] : null;
  const totals = sorted.reduce(
    (accumulator, metric) => ({
      commandsExecuted: accumulator.commandsExecuted + metric.commandsExecuted,
      moderatedMessages: accumulator.moderatedMessages + metric.moderatedMessages,
      activeMembers: Math.max(accumulator.activeMembers, metric.activeMembers),
      uptimePercentage: accumulator.uptimePercentage + metric.uptimePercentage,
    }),
    {
      commandsExecuted: 0,
      moderatedMessages: 0,
      activeMembers: 0,
      uptimePercentage: 0,
    },
  );

  return {
    latest,
    series: sorted,
    totals,
    averageUptime: sorted.length ? totals.uptimePercentage / sorted.length : 0,
  };
}

export function getSessionDisplayName(authState: DashboardSessionState): string {
  if (!authState.user) {
    return 'Administrador';
  }

  const metadata = authState.user.user_metadata as Record<string, unknown> | undefined;

  return (
    (typeof metadata?.full_name === 'string' && metadata.full_name) ||
    (typeof metadata?.name === 'string' && metadata.name) ||
    authState.user.email ||
    'Administrador'
  );
}

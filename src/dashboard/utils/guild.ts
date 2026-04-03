import type {
  ConfigMutationSectionId,
  DashboardGuild,
  DashboardSessionState,
  GuildConfig,
  GuildConfigMutation,
  GuildMetricsDaily,
  GuildSyncStatus,
} from '../types';

export const DASHBOARD_GUILD_ACCESS_MAX_AGE_MS = 24 * 60 * 60 * 1000;

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
  const series = [...metrics].sort((a, b) => a.metricDate.localeCompare(b.metricDate));
  const latest = series.length ? series[series.length - 1] : null;
  const totals = series.reduce(
    (accumulator, metric) => ({
      commandsExecuted: accumulator.commandsExecuted + metric.commandsExecuted,
      moderatedMessages: accumulator.moderatedMessages + metric.moderatedMessages,
      activeMembers: Math.max(accumulator.activeMembers, metric.activeMembers),
      ticketsOpened: accumulator.ticketsOpened + metric.ticketsOpened,
      ticketsClosed: accumulator.ticketsClosed + metric.ticketsClosed,
      openTickets: metric.openTickets,
      slaBreaches: accumulator.slaBreaches + metric.slaBreaches,
    }),
    {
      commandsExecuted: 0,
      moderatedMessages: 0,
      activeMembers: 0,
      ticketsOpened: 0,
      ticketsClosed: 0,
      openTickets: 0,
      slaBreaches: 0,
    },
  );

  const averageUptime = series.length
    ? series.reduce((total, metric) => total + metric.uptimePercentage, 0) / series.length
    : 0;

  const averageFirstResponseMinutes = (() => {
    const values = series
      .map((metric) => metric.avgFirstResponseMinutes)
      .filter((value): value is number => typeof value === 'number');
    if (!values.length) {
      return null;
    }

    return values.reduce((total, value) => total + value, 0) / values.length;
  })();

  const modulesActive = Array.from(
    new Set(series.flatMap((metric) => metric.modulesActive)),
  ).sort();

  return {
    series,
    latest,
    totals,
    averageUptime,
    averageFirstResponseMinutes,
    modulesActive,
  };
}

export function getLatestMutationForSection(
  mutations: GuildConfigMutation[],
  section: ConfigMutationSectionId | string,
): GuildConfigMutation | null {
  return mutations.find(
    (mutation) => mutation.mutationType === 'config' && mutation.section === section,
  ) ?? null;
}

export function getLatestBackupMutation(mutations: GuildConfigMutation[]): GuildConfigMutation | null {
  return mutations.find((mutation) => mutation.mutationType === 'backup') ?? null;
}

export function summarizeMutationPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return 'Solicitud enviada';
  }

  const keys = Object.keys(payload as Record<string, unknown>);
  if (!keys.length) {
    return 'Solicitud enviada';
  }

  const visible = keys.slice(0, 3).map((key) => key.replace(/([A-Z])/g, ' $1').toLowerCase());
  const suffix = keys.length > visible.length ? ` y ${keys.length - visible.length} mas` : '';
  return `${visible.join(', ')}${suffix}`;
}

export function getSetupCompletion(config: GuildConfig): { completed: number; total: number; ratio: number } {
  const checks = [
    Boolean(config.serverRolesChannelsSettings.logsChannelId),
    Boolean(config.serverRolesChannelsSettings.transcriptChannelId),
    Boolean(config.serverRolesChannelsSettings.supportRoleId),
    Boolean(config.serverRolesChannelsSettings.adminRoleId),
    Boolean(config.serverRolesChannelsSettings.ticketPanelChannelId),
    Boolean(config.ticketsSettings.maxTickets),
    Boolean(config.verificationSettings.channelId || config.verificationSettings.enabled === false),
    Boolean(config.welcomeSettings.welcomeChannelId || config.welcomeSettings.welcomeEnabled === false),
    Boolean(config.suggestionSettings.channelId || config.suggestionSettings.enabled === false),
    Boolean(config.modlogSettings.channelId || config.modlogSettings.enabled === false),
  ];

  const completed = checks.filter(Boolean).length;
  return {
    completed,
    total: checks.length,
    ratio: checks.length ? completed / checks.length : 0,
  };
}

export function getActiveModules(config: GuildConfig): string[] {
  const modules = [
    config.verificationSettings.enabled ? 'verification' : null,
    config.welcomeSettings.welcomeEnabled ? 'welcome' : null,
    config.suggestionSettings.enabled ? 'suggestions' : null,
    config.modlogSettings.enabled ? 'modlogs' : null,
    config.ticketsSettings.dailySlaReportEnabled ? 'daily_report' : null,
    config.ticketsSettings.autoAssignEnabled ? 'auto_assign' : null,
    config.systemSettings.maintenanceMode ? 'maintenance' : null,
  ].filter((item): item is string => Boolean(item));

  return modules;
}

export function isSessionReady(authState: DashboardSessionState): boolean {
  return Boolean(authState.user);
}

export function isGuildHealthy(syncStatus: GuildSyncStatus | null, guild: DashboardGuild): boolean {
  if (!syncStatus) {
    return Boolean(guild.botInstalled);
  }

  return syncStatus.bridgeStatus !== 'error' && syncStatus.failedMutations === 0;
}

export function isGuildAccessFresh(lastSyncedAt: string | null, maxAgeMs = DASHBOARD_GUILD_ACCESS_MAX_AGE_MS) {
  if (!lastSyncedAt) {
    return false;
  }

  const parsed = new Date(lastSyncedAt);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return Date.now() - parsed.getTime() <= maxAgeMs;
}

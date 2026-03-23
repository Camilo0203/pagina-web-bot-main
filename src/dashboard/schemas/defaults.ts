import type {
  CommandRateLimitOverride,
  CommandSettings,
  DashboardPreferences,
  GeneralSettings,
  GuildConfig,
  GuildInventory,
  GuildSyncStatus,
  LegacyProtectionSettings,
  ModlogSettings,
  ServerRolesChannelsSettings,
  SuggestionSettings,
  SystemSettings,
  TicketsSettings,
  VerificationSettings,
  WelcomeSettings,
} from '../types';

const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

export const defaultGeneralSettings: GeneralSettings = {
  language: 'es',
  commandMode: 'mention',
  prefix: '!',
  timezone: systemTimezone,
  moderationPreset: 'balanced',
  opsPlan: 'free',
};

export const defaultLegacyProtectionSettings: LegacyProtectionSettings = {
  antiSpamEnabled: true,
  antiSpamThreshold: 6,
  linkFilterEnabled: true,
  capsFilterEnabled: true,
  capsPercentageLimit: 70,
  duplicateFilterEnabled: true,
  duplicateWindowSeconds: 45,
  raidProtectionEnabled: true,
  raidPreset: 'balanced',
};

export const defaultDashboardPreferences: DashboardPreferences = {
  defaultSection: 'overview',
  compactMode: false,
  showAdvancedCards: true,
};

export const defaultServerRolesChannelsSettings: ServerRolesChannelsSettings = {
  dashboardChannelId: null,
  ticketPanelChannelId: null,
  logsChannelId: null,
  transcriptChannelId: null,
  weeklyReportChannelId: null,
  liveMembersChannelId: null,
  liveRoleChannelId: null,
  liveRoleId: null,
  supportRoleId: null,
  adminRoleId: null,
  verifyRoleId: null,
};

export const defaultTicketsSettings: TicketsSettings = {
  maxTickets: 3,
  globalTicketLimit: 0,
  cooldownMinutes: 0,
  minDays: 0,
  autoCloseMinutes: 0,
  slaMinutes: 0,
  smartPingMinutes: 0,
  slaEscalationEnabled: false,
  slaEscalationMinutes: 0,
  slaEscalationRoleId: null,
  slaEscalationChannelId: null,
  slaOverridesPriority: {},
  slaOverridesCategory: {},
  slaEscalationOverridesPriority: {},
  slaEscalationOverridesCategory: {},
  autoAssignEnabled: false,
  autoAssignRequireOnline: true,
  autoAssignRespectAway: true,
  incidentModeEnabled: false,
  incidentPausedCategories: [],
  incidentMessage: null,
  dailySlaReportEnabled: false,
  dailySlaReportChannelId: null,
  dmOnOpen: true,
  dmOnClose: true,
  dmTranscripts: true,
  dmAlerts: true,
};

export const defaultVerificationSettings: VerificationSettings = {
  enabled: false,
  mode: 'button',
  channelId: null,
  verifiedRoleId: null,
  unverifiedRoleId: null,
  logChannelId: null,
  panelTitle: 'Verificacion',
  panelDescription: 'Para acceder al servidor, debes verificarte.',
  panelColor: '57F287',
  panelImage: null,
  question: 'Leiste las reglas del servidor?',
  questionAnswer: 'si',
  antiraidEnabled: false,
  antiraidJoins: 10,
  antiraidSeconds: 10,
  antiraidAction: 'pause',
  dmOnVerify: true,
  kickUnverifiedHours: 0,
};

export const defaultWelcomeSettings: WelcomeSettings = {
  welcomeEnabled: false,
  welcomeChannelId: null,
  welcomeMessage: 'Bienvenido/a **{mention}** al servidor **{server}**!',
  welcomeColor: '5865F2',
  welcomeTitle: 'Bienvenido/a',
  welcomeBanner: null,
  welcomeThumbnail: true,
  welcomeFooter: 'Espero que disfrutes tu estadia.',
  welcomeDm: false,
  welcomeDmMessage: 'Hola **{user}**! Bienvenido/a a **{server}**.',
  welcomeAutoroleId: null,
  goodbyeEnabled: false,
  goodbyeChannelId: null,
  goodbyeMessage: '**{user}** ha abandonado el servidor.',
  goodbyeColor: 'ED4245',
  goodbyeTitle: 'Hasta luego',
  goodbyeThumbnail: true,
  goodbyeFooter: 'Espero verte de nuevo pronto.',
};

export const defaultSuggestionSettings: SuggestionSettings = {
  enabled: false,
  channelId: null,
  logChannelId: null,
  approvedChannelId: null,
  rejectedChannelId: null,
  dmOnResult: true,
  requireReason: false,
  cooldownMinutes: 5,
  anonymous: false,
};

export const defaultModlogSettings: ModlogSettings = {
  enabled: false,
  channelId: null,
  logBans: true,
  logUnbans: true,
  logKicks: true,
  logMessageDelete: true,
  logMessageEdit: true,
  logRoleAdd: true,
  logRoleRemove: true,
  logNickname: true,
  logJoins: false,
  logLeaves: false,
  logVoice: false,
};

export const defaultCommandRateLimitOverride: CommandRateLimitOverride = {
  maxActions: 4,
  windowSeconds: 20,
  enabled: true,
};

export const defaultCommandSettings: CommandSettings = {
  disabledCommands: [],
  simpleHelpMode: true,
  rateLimitEnabled: true,
  rateLimitWindowSeconds: 10,
  rateLimitMaxActions: 8,
  rateLimitBypassAdmin: true,
  commandRateLimitEnabled: true,
  commandRateLimitWindowSeconds: 20,
  commandRateLimitMaxActions: 4,
  commandRateLimitOverrides: {},
};

export const defaultSystemSettings: SystemSettings = {
  maintenanceMode: false,
  maintenanceReason: null,
  legacyProtectionSettings: defaultLegacyProtectionSettings,
};

export const defaultGuildConfig: Omit<GuildConfig, 'guildId'> = {
  generalSettings: defaultGeneralSettings,
  serverRolesChannelsSettings: defaultServerRolesChannelsSettings,
  ticketsSettings: defaultTicketsSettings,
  verificationSettings: defaultVerificationSettings,
  welcomeSettings: defaultWelcomeSettings,
  suggestionSettings: defaultSuggestionSettings,
  modlogSettings: defaultModlogSettings,
  commandSettings: defaultCommandSettings,
  systemSettings: defaultSystemSettings,
  dashboardPreferences: defaultDashboardPreferences,
  updatedBy: null,
  updatedAt: null,
  configSource: 'bot',
};

export const defaultGuildInventory: Omit<GuildInventory, 'guildId'> = {
  roles: [],
  channels: [],
  categories: [],
  commands: [],
  updatedAt: null,
};

export const defaultGuildSyncStatus: GuildSyncStatus = {
  guildId: '',
  bridgeStatus: 'unknown',
  bridgeMessage: null,
  lastHeartbeatAt: null,
  lastInventoryAt: null,
  lastConfigSyncAt: null,
  lastMutationProcessedAt: null,
  lastBackupAt: null,
  pendingMutations: 0,
  failedMutations: 0,
  updatedAt: null,
};

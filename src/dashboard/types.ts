import type { Session, User } from '@supabase/supabase-js';

export type DashboardSectionId =
  | 'overview'
  | 'general'
  | 'moderation'
  | 'activity'
  | 'analytics';

export interface DashboardSessionState {
  session: Session | null;
  user: User | null;
}

export interface DashboardGuild {
  guildId: string;
  guildName: string;
  guildIcon: string | null;
  permissionsRaw: string;
  canManage: boolean;
  isOwner: boolean;
  botInstalled: boolean;
  memberCount: number | null;
  premiumTier: string | null;
  botLastSeenAt: string | null;
  lastSyncedAt: string | null;
}

export interface GeneralSettings {
  language: 'es' | 'en';
  commandMode: 'mention' | 'prefix';
  prefix: string;
  timezone: string;
  moderationPreset: 'relaxed' | 'balanced' | 'strict';
}

export interface ModerationSettings {
  antiSpamEnabled: boolean;
  antiSpamThreshold: number;
  linkFilterEnabled: boolean;
  capsFilterEnabled: boolean;
  capsPercentageLimit: number;
  duplicateFilterEnabled: boolean;
  duplicateWindowSeconds: number;
  raidProtectionEnabled: boolean;
  raidPreset: 'off' | 'balanced' | 'lockdown';
}

export interface DashboardPreferences {
  defaultSection: DashboardSectionId;
  compactMode: boolean;
  showAdvancedCards: boolean;
}

export interface GuildConfig {
  guildId: string;
  generalSettings: GeneralSettings;
  moderationSettings: ModerationSettings;
  dashboardPreferences: DashboardPreferences;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface GuildEvent {
  id: string;
  guildId: string;
  eventType: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface GuildMetricsDaily {
  guildId: string;
  metricDate: string;
  commandsExecuted: number;
  moderatedMessages: number;
  activeMembers: number;
  uptimePercentage: number;
}

export interface DashboardSyncResult {
  guilds: DashboardGuild[];
  syncedAt: string;
  manageableCount: number;
  installedCount: number;
}
